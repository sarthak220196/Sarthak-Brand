/**
 * THE SINGLE SOURCE OF TRUTH FOR THE SITE.
 * Edit this file to update copy, career, projects, links and travel.
 *
 * Links set to null render as a quiet "coming soon" label instead of a dead link.
 * Only facts supplied by Sarthak are in here. Keep it that way.
 */

export type Status = "closed" | "pipeline";

export interface LedgerItem {
  text: string;
  status: Status;
}

export interface Role {
  company: string;
  dates: string;
  /** Role or focus. Replace with exact job titles where you prefer them. */
  role: string;
  context?: string;
  points: string[];
  ledger?: LedgerItem[];
  note?: string;
}

export type StageId = "build" | "grow" | "lead" | "sell" | "connect";

export interface Stage {
  id: StageId;
  verb: string;
  chapter: string;
  years: string;
  lesson: string;
  carriedForward: string;
  roles: Role[];
}

export const person = {
  name: "Sarthak Sighat",
  base: "Mumbai, India",
  now: "Strategic partnerships in cross-border payments at Unlimit",
  intro:
    "Engineering graduate turned commercial operator. I've worked across product, go-to-market, enterprise sales and, now, global payments partnerships. I'm also a DJ, and I'm heading back to the decks.",
  taglines: ["I make money move.", "I make music move.", "I make things happen."],
  closing: [
    "Engineer by education.",
    "Commercial operator by experience.",
    "DJ by instinct.",
    "Builder by curiosity.",
  ],
};

export const stages: Stage[] = [
  {
    id: "build",
    verb: "Build",
    chapter: "The builder",
    years: "2019–2021",
    lesson: "Taking a product from development all the way into the market, and owning what happens there.",
    carriedForward: "Product ownership and commercial execution",
    roles: [
      {
        company: "Creative Awards & Rewards",
        dates: "2019–2021",
        role: "Product strategy, demand generation and sales",
        points: [
          "Helped develop and launch a B2B product.",
          "Owned product strategy, demand generation and sales execution.",
          "The product generated more than $300K in revenue, sold to hospitals and airlines.",
        ],
      },
    ],
  },
  {
    id: "grow",
    verb: "Grow",
    chapter: "The GTM operator",
    years: "2021–2023",
    lesson: "How to create demand from nothing, open new regions and turn outbound into a repeatable engine.",
    carriedForward: "Demand creation and market entry",
    roles: [
      {
        company: "Rocketium",
        dates: "Jan 2021 – Apr 2022",
        role: "Sales development and outbound",
        points: [
          "Built outbound motions for new regions.",
          "Achieved 190%+ of quota.",
          "Mentored junior SDRs.",
          "Optimised sales playbooks.",
        ],
      },
      {
        company: "Toddle",
        dates: "Apr 2022 – Mar 2023",
        role: "Outbound GTM strategy",
        context: "APAC, North America, LATAM",
        points: [
          "Designed outbound GTM strategy across APAC, North America and LATAM.",
          "Built $300K+ of outbound pipeline.",
          "Achieved 145%+ of quota for two consecutive quarters.",
          "Increased SQLs by 25%.",
        ],
      },
    ],
  },
  {
    id: "lead",
    verb: "Lead",
    chapter: "The team lead",
    years: "2023–2024",
    lesson: "Building a team and a system, not only hitting a number myself.",
    carriedForward: "Leading people and building structure",
    roles: [
      {
        company: "Sprinto",
        dates: "Mar 2023 – Apr 2024",
        role: "SDR Manager, inbound and outbound",
        context: "APAC, USA",
        points: [
          "Led and coached four SDRs.",
          "Built the company's first structured outbound engine.",
          "Generated $300K+ of qualified pipeline across APAC and the USA.",
          "Improved lead-to-meeting conversion by 35%.",
        ],
      },
    ],
  },
  {
    id: "sell",
    verb: "Sell",
    chapter: "The enterprise seller",
    years: "2024–2026",
    lesson:
      "Navigating complex enterprise relationships, long evaluations and real commercial negotiation, in fintech and payments.",
    carriedForward: "Full-cycle enterprise selling in regulated fintech",
    roles: [
      {
        company: "PortOne",
        dates: "Apr 2024 – Sep 2025",
        role: "Full-cycle enterprise sales, fintech and payments",
        context: "SEA, EU, USA",
        points: [
          "Built and managed $500K+ of qualified pipeline across SEA, the EU and the USA.",
          "Achieved 90–104% of quarterly quota.",
          "Closed enterprise contracts worth $30K–$60K ARR.",
          "Worked with global e-commerce and fintech merchants.",
          "Led discovery, demos, negotiation and onboarding.",
          "Worked with product and engineering on API and integration-led solutions.",
        ],
      },
      {
        company: "Glomo",
        dates: "Sep 2025 – Feb 2026",
        role: "Global Account Executive",
        context: "Regulated, compliance-focused fintech, GIFT City",
        points: [
          "Closed and onboarded three customers end to end.",
          "Generated additional outbound pipeline.",
          "Progressed several opportunities to late-stage evaluation.",
        ],
        note: "Moved on for surgery and recovery.",
      },
    ],
  },
  {
    id: "connect",
    verb: "Connect",
    chapter: "The partnerships builder",
    years: "2026 – now",
    lesson: "Moving from selling to one buyer towards building networks of partners, merchants and markets.",
    carriedForward: "Where it's all going",
    roles: [
      {
        company: "Unlimit",
        dates: "Apr 2026 – present",
        role: "International business development and strategic partnerships",
        context: "Cross-border payments, primarily global markets",
        points: [],
        ledger: [
          { text: "Two strategic partners", status: "closed" },
          { text: "Two enterprise merchants", status: "closed" },
          { text: "Opportunities across insurance companies", status: "pipeline" },
          { text: "Opportunities across fashion and e-commerce", status: "pipeline" },
          { text: "A significant opportunity with Mswipe", status: "pipeline" },
          { text: "Relationships with larger players in international payments", status: "pipeline" },
        ],
      },
    ],
  },
];

export const capabilities = [
  "Cross-border payments",
  "Global acquiring",
  "Payment service providers",
  "Alternative payment methods",
  "Banking and financial infrastructure",
  "Local payment ecosystems",
  "Jurisdiction-specific regulation",
  "Enterprise merchant acquisition",
  "Strategic partnerships",
  "Commercial negotiation",
  "International GTM strategy",
  "International business development",
];

export interface Region {
  id: string;
  name: string;
  lon: number;
  lat: number;
  companies: string[];
}

/** Regions named in the career history. lon/lat are approximate region centres for the map. */
export const regions: Region[] = [
  { id: "na", name: "North America / USA", lon: -98, lat: 40, companies: ["Toddle", "Sprinto", "PortOne"] },
  { id: "latam", name: "LATAM", lon: -60, lat: -14, companies: ["Toddle"] },
  { id: "eu", name: "EU", lon: 10, lat: 50, companies: ["PortOne"] },
  { id: "apac", name: "APAC", lon: 128, lat: 32, companies: ["Toddle", "Sprinto"] },
  { id: "sea", name: "SEA", lon: 106, lat: 4, companies: ["PortOne"] },
  { id: "gift", name: "GIFT City", lon: 72.6, lat: 23.2, companies: ["Glomo"] },
];

export const home = { name: "Mumbai", lon: 72.88, lat: 19.07 };

export const dj = {
  history: [
    "Won DJ competitions in college.",
    "Played New Year's parties and other live events.",
    "Took a hiatus for work and life.",
    "Coming back to it, seriously this time.",
  ],
  setup: ["Pioneer DDJ-FLX4", "FL Studio 2025"],
  focus: "Bollywood × Hollywood mashups",
  mixesUrl: null as string | null,
};

export interface Project {
  name: string;
  kind: "Experiment" | "Concept";
  summary: string;
  stack: string[];
  url: string | null;
}

export const projects: Project[] = [
  {
    name: "RememberMe / I-WAS-THERE",
    kind: "Experiment",
    summary:
      "Turns Google Timeline location history into an interactive personal timeline. Decode the raw JSON, put it on a map, and scrub back through where you've been.",
    stack: ["Next.js", "Mapbox", "Location-history JSON decoding", "Timeline visualisation"],
    url: null,
  },
  {
    name: "Chatterbubble / Nagent AI",
    kind: "Concept",
    summary:
      "An AI-led business concept, explored through product positioning, B2B use cases and go-to-market experiments.",
    stack: ["Positioning", "B2B use cases", "GTM experiments"],
    url: null,
  },
];

/**
 * Travel journal. Empty on purpose: add only places actually visited.
 * Example entry:
 * { place: "City, Country", when: "2024", story: "One or two lines.", photo: "/photos/city.jpg" }
 */
export interface Place {
  place: string;
  when: string;
  story: string;
  photo?: string;
}
export const places: Place[] = [];

export const links = {
  email: null as string | null, // e.g. "you@domain.com"
  linkedin: null as string | null, // e.g. "https://www.linkedin.com/in/..."
  cv: null as string | null, // e.g. "/sarthak-sighat-cv.pdf" placed in /public
};

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const stations = [
  { id: "top", label: "Hello", freq: "88.0" },
  { id: "work", label: "Work", freq: "92.4" },
  { id: "network", label: "Network", freq: "96.1" },
  { id: "comeback", label: "Comeback", freq: "99.9" },
  { id: "decks", label: "Decks", freq: "101.7" },
  { id: "builds", label: "Builds", freq: "104.3" },
  { id: "explorer", label: "Explorer", freq: "106.5" },
  { id: "hello", label: "Say hi", freq: "108.0" },
] as const;

export type StationId = (typeof stations)[number]["id"];
