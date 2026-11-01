export const domains = {
  consulting: {
    name: "Consulting",
    id: "00000000-0000-4000-8000-000000000001",
    types: [
      "guesstimate",
      "profitability",
      "pricing-strategy",
      "market-entry",
      "mergers-and-acquisitions",
      "go-to-market",
    ],
  },
  product: {
    name: "Product Management",
    id: "00000000-0000-4000-8000-000000000002",
    types: ["guesstimate", "product-design", "metric-cases", "rca-cases"],
  },
} as const;
export type DomainKey = keyof typeof domains;
export const caseTypes: Record<
  string,
  { label: string; name: string; description: string }
> = {
  guesstimate: {
    name: "Guesstimate",
    label: "Guesstimates",
    description:
      "Estimate a number from first principles. The most common opener in both consulting and product interviews.",
  },
  profitability: {
    name: "Profitability",
    label: "Profitability Cases",
    description:
      "Find why profit fell and what to do about it, using a revenue and cost tree.",
  },
  "pricing-strategy": {
    name: "Pricing Strategy",
    label: "Pricing Strategy",
    description:
      "Set or change a price using cost, competitors and customer value.",
  },
  "market-entry": {
    name: "Market Entry",
    label: "Market Entry",
    description:
      "Decide whether to enter a market and how: build, buy or partner.",
  },
  "mergers-and-acquisitions": {
    name: "M&A",
    label: "Merger & Acq.",
    description:
      "Judge whether an acquisition or merger creates value, and at what price.",
  },
  "go-to-market": {
    name: "Go-to-Market",
    label: "Go-to-Market",
    description:
      "Plan a launch: who to target, what to say, where to sell and how to measure it.",
  },
  "product-design": {
    name: "Product Design",
    label: "Product Design",
    description:
      "Design or improve a product for a specific user, then prioritise and measure.",
  },
  "metric-cases": {
    name: "Metric Cases",
    label: "Metric Cases",
    description:
      "Define success for a product and choose metrics that cannot be easily gamed.",
  },
  "rca-cases": {
    name: "RCA Cases",
    label: "RCA Cases",
    description:
      "A metric moved. Work out why, in a structured way, and what to do next.",
  },
};
export const guideKinds = {
  hurry: "In a hurry",
  concepts: "Core Concepts",
  solved: "Solved Cases",
  patterns: "Patterns & Trends",
} as const;
export type GuideKind = keyof typeof guideKinds;
export function isDomain(value: string): value is DomainKey {
  return Object.hasOwn(domains, value);
}
export function isDomainType(domain: DomainKey, type: string) {
  return (domains[domain].types as readonly string[]).includes(type);
}
export const guesstimateId = "00000000-0000-4000-8000-000000000101";
