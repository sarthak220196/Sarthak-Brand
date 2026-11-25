"use client";

import { AnimatePresence, motion, useReducedMotion, type Transition, type Variants } from "framer-motion";

// cast works around a pathLength typing bug in this framer-motion version
const draw = { hidden: { pathLength: 0 }, shown: { pathLength: 1 } } as unknown as Variants;
import type { StageId } from "@/data/site";

const C = { ink: "#000", char: "#2B2B2E", lime: "#C8F135", cobalt: "#1E3FD8", paper: "#F1EDE2" };

/** One drawing per career stage. Each shows the capability, not a logo. */
export default function StageVisual({ stage }: { stage: StageId }) {
  const reduce = useReducedMotion();
  const t = (d = 0): Transition => (reduce ? { duration: 0 } : { delay: d, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] });

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label={`Illustration: ${caption[stage]}`}>
      <AnimatePresence mode="wait">
        <motion.g key={stage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          {stage === "build" && (
            // A product being assembled: blocks fly into a grid
            <g>
              {Array.from({ length: 9 }).map((_, i) => {
                const x = 110 + (i % 3) * 62;
                const y = 110 + Math.floor(i / 3) * 62;
                return (
                  <motion.rect
                    key={i}
                    width={56}
                    height={56}
                    fill={i === 4 ? C.lime : i % 2 ? C.char : C.cobalt}
                    initial={{ x: x + (i % 3 - 1) * 120, y: y - 160, opacity: 0, rotate: 30 }}
                    animate={{ x, y, opacity: 1, rotate: 0 }}
                    transition={t(i * 0.07)}
                  />
                );
              })}
            </g>
          )}

          {stage === "grow" && (
            // A revenue engine starting: a turning flywheel and rising bars
            <g>
              <motion.g
                style={{ originX: "200px", originY: "150px" }}
                animate={reduce ? {} : { rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <circle cx={200} cy={150} r={70} fill="none" stroke={C.char} strokeWidth={14} strokeDasharray="22 14" />
              </motion.g>
              <circle cx={200} cy={150} r={22} fill={C.lime} stroke={C.ink} strokeWidth={3} />
              {[40, 62, 58, 90, 118, 140, 190].map((h, i) => (
                <motion.rect
                  key={i}
                  x={70 + i * 38}
                  width={26}
                  fill={i === 6 ? C.cobalt : C.char}
                  initial={{ y: 360, height: 0 }}
                  animate={{ y: 360 - h * 0.7, height: h * 0.7 }}
                  transition={t(0.2 + i * 0.08)}
                />
              ))}
              <line x1={50} x2={350} y1={360} y2={360} stroke={C.ink} strokeWidth={2} />
            </g>
          )}

          {stage === "lead" && (
            // Multiple people and markets connecting to one engine
            <g>
              {[
                [90, 90], [310, 90], [90, 310], [310, 310],
              ].map(([x, y], i) => (
                <g key={i}>
                  <motion.path d={`M200 200 L${x} ${y}`} fill="none" stroke={C.char} strokeWidth={3}
                    variants={draw} initial="hidden" animate="shown" transition={t(0.1 + i * 0.12)} />
                  <motion.circle cx={x} cy={y} r={20} fill={C.paper} stroke={C.ink} strokeWidth={3}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={t(0.3 + i * 0.12)} />
                </g>
              ))}
              {[["APAC", 200, 46], ["USA", 200, 366]].map(([label, x, y], i) => (
                <motion.text key={String(label)} x={Number(x)} y={Number(y)} textAnchor="middle" fontSize={16} fontWeight={700} fill={C.cobalt}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={t(0.8 + i * 0.1)}>{label}</motion.text>
              ))}
              <motion.rect x={170} y={170} width={60} height={60} fill={C.lime} stroke={C.ink} strokeWidth={3}
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={t(0)} />
            </g>
          )}

          {stage === "sell" && (
            // Complex enterprise relationships: two organisations, many threads between them
            <g>
              {[0, 1].map((side) =>
                Array.from({ length: 5 }).map((_, i) => {
                  const x = side ? 300 : 100;
                  const y = 90 + i * 55;
                  return (
                    <motion.circle key={`${side}-${i}`} cx={x} cy={y} r={side ? 14 : 18}
                      fill={side ? C.cobalt : C.paper} stroke={C.ink} strokeWidth={3}
                      initial={{ opacity: 0, x: side ? 40 : -40 }} animate={{ opacity: 1, x: 0 }} transition={t(i * 0.06)} />
                  );
                }),
              )}
              {[[0, 1], [1, 0], [1, 3], [2, 2], [3, 1], [4, 4], [2, 4], [0, 2]].map(([a, b], i) => (
                <motion.path key={i}
                  d={`M118 ${90 + a * 55} C 200 ${90 + a * 55}, 200 ${90 + b * 55}, 286 ${90 + b * 55}`}
                  fill="none" stroke={i === 3 ? C.lime : C.char} strokeWidth={i === 3 ? 6 : 2}
                  variants={draw} initial="hidden" animate="shown" transition={t(0.4 + i * 0.12)} />
              ))}
            </g>
          )}

          {stage === "connect" && (
            // A network of rails, partners and markets around one hub
            <g>
              {[70, 120, 165].map((r, i) => (
                <circle key={r} cx={200} cy={200} r={r} fill="none" stroke={C.char} strokeOpacity={0.25 + i * 0.1} strokeWidth={1.5} />
              ))}
              {Array.from({ length: 10 }).map((_, i) => {
                const ang = (i / 10) * Math.PI * 2 + 0.3;
                const r = i % 2 ? 120 : 165;
                const x = 200 + Math.cos(ang) * r;
                const y = 200 + Math.sin(ang) * r;
                return (
                  <g key={i}>
                    <motion.path d={`M200 200 L${x} ${y}`} fill="none" stroke={i < 4 ? C.cobalt : C.char} strokeWidth={i < 4 ? 3 : 1.5}
                      strokeDasharray={i < 4 ? undefined : "4 6"}
                      variants={draw} initial="hidden" animate="shown" transition={t(i * 0.06)} />
                    <motion.circle cx={x} cy={y} r={i < 4 ? 11 : 8} fill={i < 4 ? C.cobalt : C.paper} stroke={C.ink} strokeWidth={2}
                      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={t(0.3 + i * 0.06)} />
                  </g>
                );
              })}
              <circle cx={200} cy={200} r={28} fill={C.lime} stroke={C.ink} strokeWidth={3} />
            </g>
          )}
        </motion.g>
      </AnimatePresence>
    </svg>
  );
}

export const caption: Record<StageId, string> = {
  build: "a product being assembled",
  grow: "a revenue engine starting up",
  lead: "one engine, four people, two regions",
  sell: "many threads between two organisations",
  connect: "solid lines closed, dashed lines in progress",
};
