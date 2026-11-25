/**
 * A tiny two-deck mix engine. Every sound is synthesised in the browser:
 * no samples, no commercial music.
 *
 * Deck A: dhol-style percussion and a Bhupali (C D E G A) melody.
 * Deck B: a four-on-the-floor club pulse with a bassline in the same pentatonic set.
 * Both are written in the same note set so they always mix in key.
 */

export type DeckId = "a" | "b";

interface DeckChain {
  input: GainNode;
  filter: BiquadFilterNode;
  xf: GainNode;
  on: boolean;
}

const C4 = 261.63;
const note = (semi: number, base = C4) => base * Math.pow(2, semi / 12);

// 32-step melody for deck A (Bhupali: Sa Re Ga Pa Dha)
const MELODY_A: Record<number, number> = {
  0: note(0), 3: note(2), 6: note(4), 8: note(7), 12: note(9),
  14: note(7), 16: note(4), 19: note(2), 22: note(4), 24: note(0), 28: note(-3),
};
// 16-step bass for deck B, A minor pentatonic (shares notes with C major pentatonic)
const BASS_B: Record<number, number> = {
  0: 55, 3: 55, 6: 65.41, 8: 55, 10: 49, 11: 55, 14: 82.41,
};

export class MixEngine {
  ctx: AudioContext;
  master: GainNode;
  analyser: AnalyserNode;
  decks: Record<DeckId, DeckChain>;
  bpm = 100;
  private step = 0;
  private nextTime = 0;
  private timer: number | null = null;
  private noise: AudioBuffer;

  constructor() {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.55;
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.78;
    this.master.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
    this.noise = this.makeNoise();
    this.decks = { a: this.makeDeck(), b: this.makeDeck() };
    this.setCrossfade(0.5);
  }

  private makeDeck(): DeckChain {
    const input = this.ctx.createGain();
    input.gain.value = 0;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 20000;
    const xf = this.ctx.createGain();
    input.connect(filter).connect(xf).connect(this.master);
    return { input, filter, xf, on: false };
  }

  private makeNoise() {
    const len = this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  isPlaying(id: DeckId) {
    return this.decks[id].on;
  }

  setDeck(id: DeckId, on: boolean) {
    const deck = this.decks[id];
    deck.on = on;
    deck.input.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, 0.03);
    if (on) this.start();
    else if (!this.decks.a.on && !this.decks.b.on) this.stop();
  }

  /** -1 = full low-pass, 0 = open, +1 = full high-pass */
  setFilter(id: DeckId, v: number) {
    const f = this.decks[id].filter;
    const t = this.ctx.currentTime;
    if (v < -0.03) {
      f.type = "lowpass";
      f.frequency.setTargetAtTime(18000 * Math.pow(10, v * 2.2), t, 0.02);
    } else if (v > 0.03) {
      f.type = "highpass";
      f.frequency.setTargetAtTime(20 * Math.pow(10, v * 2.6), t, 0.02);
    } else {
      f.type = "lowpass";
      f.frequency.setTargetAtTime(20000, t, 0.02);
    }
  }

  /** 0 = deck A only, 1 = deck B only. Equal-power curve. */
  setCrossfade(x: number) {
    const t = this.ctx.currentTime;
    this.decks.a.xf.gain.setTargetAtTime(Math.cos((x * Math.PI) / 2), t, 0.02);
    this.decks.b.xf.gain.setTargetAtTime(Math.sin((x * Math.PI) / 2), t, 0.02);
  }

  private start() {
    void this.ctx.resume();
    if (this.timer !== null) return;
    this.step = 0;
    this.nextTime = this.ctx.currentTime + 0.06;
    this.timer = window.setInterval(() => this.schedule(), 25);
  }

  private stop() {
    if (this.timer !== null) window.clearInterval(this.timer);
    this.timer = null;
  }

  private schedule() {
    const sixteenth = 60 / this.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.12) {
      this.playStep(this.step, this.nextTime);
      this.nextTime += sixteenth;
      this.step = (this.step + 1) % 32;
    }
  }

  private playStep(s: number, t: number) {
    const a = this.decks.a.input;
    const b = this.decks.b.input;
    const s16 = s % 16;
    const len = 60 / this.bpm / 4;

    // Deck A: dhol-ish groove
    if ([0, 6, 10].includes(s16)) this.drop(t, a, 170, 58, 0.42, 0.9);
    if ([3, 12].includes(s16)) this.drop(t, a, 120, 70, 0.25, 0.5);
    if ([2, 4, 8, 11, 14].includes(s16)) this.tak(t, a, s16 === 8 ? 0.42 : 0.28);
    this.hiss(t, a, 6500, 0.035, s16 % 2 ? 0.07 : 0.13);
    if (MELODY_A[s] !== undefined) this.flute(t, a, MELODY_A[s], len * 2.6);

    // Deck B: club pulse
    if (s16 % 4 === 0) this.drop(t, b, 150, 44, 0.38, 1);
    if (s16 === 4 || s16 === 12) this.hiss(t, b, 1500, 0.16, 0.5, "bandpass");
    if (s16 % 4 === 2) this.hiss(t, b, 8000, 0.05, 0.28);
    if (BASS_B[s16] !== undefined) this.bass(t, b, BASS_B[s16], len * 1.6);
  }

  // voices -------------------------------------------------------------

  private drop(t: number, dest: AudioNode, f0: number, f1: number, dur: number, vol: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.35);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private tak(t: number, dest: AudioNode, vol: number) {
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(560, t);
    o.frequency.exponentialRampToValueAtTime(360, t + 0.06);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);
    o.connect(g).connect(dest);
    o.start(t);
    o.stop(t + 0.1);
    this.hiss(t, dest, 2600, 0.03, vol * 0.6, "bandpass");
  }

  private hiss(
    t: number,
    dest: AudioNode,
    freq: number,
    dur: number,
    vol: number,
    type: BiquadFilterType = "highpass",
  ) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    const f = this.ctx.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f).connect(g).connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(t + dur + 0.02);
  }

  private flute(t: number, dest: AudioNode, freq: number, dur: number) {
    const o = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const g = this.ctx.createGain();
    const f = this.ctx.createBiquadFilter();
    o.type = "triangle";
    o.frequency.value = freq;
    lfo.frequency.value = 5.5;
    lfoGain.gain.value = freq * 0.006;
    lfo.connect(lfoGain).connect(o.frequency);
    f.type = "lowpass";
    f.frequency.value = 2400;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.11, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(dest);
    o.start(t);
    lfo.start(t);
    o.stop(t + dur + 0.05);
    lfo.stop(t + dur + 0.05);
  }

  private bass(t: number, dest: AudioNode, freq: number, dur: number) {
    const o = this.ctx.createOscillator();
    const f = this.ctx.createBiquadFilter();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.value = freq;
    f.type = "lowpass";
    f.frequency.setValueAtTime(900, t);
    f.frequency.exponentialRampToValueAtTime(180, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.28, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(f).connect(g).connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  dispose() {
    this.stop();
    void this.ctx.close();
  }
}
