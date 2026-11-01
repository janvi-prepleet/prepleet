import { useState, useMemo, useRef, useEffect, createContext, useContext } from "react";
import {
  LayoutDashboard, Calculator, BookOpen, Library, Users, ChevronDown, ChevronRight, ArrowLeft, Search,
  Bookmark, Lock, Clock, Star, CheckCircle2, Circle, Download, MessageCircle, Flame, Menu, X, ThumbsUp,
  MessageSquare, Sparkles, Trophy, Quote, Plus, LayoutGrid, List, Send, Timer, Check, SlidersHorizontal,
  Briefcase, Target, LogOut, BadgeCheck, Play, Zap, TrendingUp, User, Pencil, CreditCard,
} from "lucide-react";

/* ───────────────────────── DATA ───────────────────────── */
const P = x => ({ t: "p", x }), UL = (...x) => ({ t: "ul", x }), OL = (...x) => ({ t: "ol", x }), CO = x => ({ t: "co", x });
const TB = (head, ...rows) => ({ t: "tb", head, rows });
const S = (id, title, ...blocks) => ({ id, title, blocks });
const A = (id, topic, tracks, title, mins, level, key, ...sections) => ({ id, topic, tracks, title, mins, level, key, sections });

const BASE = [
  A("g-approach", "Guesstimates", ["consulting", "product"], "The 5-step approach to any guesstimate", 9, "Easy",
    ["Clarify scope before touching a number", "Pick top-down or bottom-up and say why", "Split into 3–5 segments that don’t overlap", "Use round, defensible numbers and say them aloud", "Sanity-check against something you already know"],
    S("why", "What interviewers are really testing", P("A guesstimate is not a maths test. The interviewer wants to see whether you can break a vague problem into parts, make reasonable assumptions, and keep the arithmetic clean while you talk."),
      UL("Structure: can you split the problem so nothing overlaps and nothing is missed?", "Judgement: are your assumptions realistic for this market?", "Communication: can the interviewer follow every number without asking where it came from?")),
    S("steps", "The five steps", OL("Clarify. Ask what is being measured, where, and for which period.", "Structure. Choose top-down (start from a large population) or bottom-up (start from one unit and scale up).", "Segment. Split into 3–5 groups that behave differently.", "Estimate. Attach a round number to each branch and justify it in one line.", "Sanity-check. Compare the answer with a figure you know."),
      CO("Say your structure out loud before calculating. Most candidates lose marks for silent maths, not for wrong maths.")),
    S("numbers", "Numbers worth memorising", P("Approximate figures are enough. Interviewers care that you pick sensible anchors, not that you know exact census data."),
      TB(["Fact", "Value (approx.)"], ["India population", "1.45 billion"], ["Households", "~300 million, about 4.8 people each"], ["Urban share", "~36%"], ["Working-age share", "~65%"], ["Mumbai metro population", "~21 million"])),
    S("mistakes", "Common mistakes", UL("Jumping into numbers without clarifying scope", "Overlapping segments, so people get counted twice", "Awkward numbers like 37% when 40% works and is easier to defend", "Skipping the final sanity check"))),

  A("g-topdown", "Guesstimates", ["consulting", "product"], "Top-down vs bottom-up: which one to pick", 6, "Easy",
    ["Top-down: start from a big population and filter", "Bottom-up: start from one unit and multiply", "Use top-down for demand, bottom-up for supply", "If both land within 2x of each other, you’re close"],
    S("compare", "Side by side", TB(["", "Top-down", "Bottom-up"], ["Starts from", "Population or total market", "One store, one cab, one user"], ["Best for", "Demand and market size", "Supply, capacity, revenue of one unit"], ["Risk", "Filters pile up and errors compound", "Hard to know how many units exist"], ["Example", "Chai cups in Delhi", "Revenue of a cloud kitchen"])),
    S("triangulate", "Triangulate when you have time", P("Solve once top-down and once bottom-up. If the two answers are within a factor of two, say so; it signals that your assumptions are sound. If they are far apart, find which assumption is off and fix it."))),

  A("g-cabs", "Guesstimates", ["consulting", "product"], "Worked example: cabs in Mumbai", 12, "Easy",
    ["Demand side: riders × trips ÷ trips per cab", "20M people × 4% daily riders = 8 lakh riders", "1.5 trips each = 12 lakh trips a day", "12 trips per cab per day gives about 1 lakh cabs", "Sanity: roughly 1 cab per 200 residents"],
    S("clarify", "Clarify the question", UL("Do we include black-and-yellow taxis and app cabs? Assume yes, both.", "Mumbai city or the metropolitan region? Assume metro, about 20 million people.", "Cabs registered, or cabs running on a typical day? Assume running on a typical day.")),
    S("structure", "Structure", P("This is a demand-side problem. Work out how many cab trips happen per day, then divide by how many trips one cab can serve."), CO("Cabs = (Population × share who ride daily × trips per rider) ÷ trips per cab per day")),
    S("assumptions", "Assumptions", TB(["Input", "Value", "Why"], ["Population", "20 million", "Metro region, rounded"], ["Daily cab riders", "4%", "Most commuters use trains and buses"], ["Trips per rider", "1.5", "Some riders take a return trip"], ["Trips per cab per day", "12", "About 3 per 4-hour block over 16 working hours"])),
    S("calc", "Calculation", UL("20M × 4% = 8 lakh daily riders", "8 lakh × 1.5 = 12 lakh trips per day", "12 lakh ÷ 12 = 1 lakh cabs")),
    S("sanity", "Sanity check", P("One cab for every 200 residents sounds plausible for a dense city with heavy rail use. If your answer implied one cab per 10 people, you would know something was wrong.")),
    S("followups", "Likely follow-ups", UL("How does your number change on a rainy Friday evening?", "How would you estimate Ola vs Uber share?", "What would you do differently to estimate drivers instead of cabs?"))),

  A("g-smartphones", "Guesstimates", ["consulting"], "Annual smartphone sales in India", 8, "Easy",
    ["Use the installed base and replacement cycle", "650M users ÷ 4.5-year cycle ≈ 145M units", "Add first-time buyers as a small top-up", "Cross-check with household count"],
    S("structure", "Structure", P("Use installed base over replacement cycle. It is cleaner than counting purchases directly."), CO("Annual sales = Smartphone users ÷ average years between replacements")),
    S("assumptions", "Assumptions", TB(["Input", "Value"], ["Smartphone users", "650 million"], ["Replacement cycle", "4.5 years"], ["First-time buyers", "Small top-up, ignore for round numbers"])),
    S("calc", "Calculation and check", UL("650M ÷ 4.5 ≈ 145M handsets a year", "Cross-check: 300M households, roughly half buy one phone every 3 years, giving ~50M. That misses individual buyers, so the first number is more credible."))),

  A("g-chai", "Guesstimates", ["consulting"], "Cups of chai sold daily in Delhi", 7, "Easy",
    ["Filter the population: adults, tea drinkers, outside the home", "20M × 70% × 60% × 2 cups × 30% ≈ 5M", "State which segment you leave out (office pantries)", "Sanity: about 1 cup per 4 residents"],
    S("structure", "Structure", P("Start with the population and filter step by step to people who buy tea outside the home."), CO("Cups sold = Population × adults × tea drinkers × cups per day × share bought outside")),
    S("calc", "Calculation", TB(["Step", "Value", "Running total"], ["Population", "20M", "20M"], ["Adults", "70%", "14M"], ["Drink tea", "60%", "8.4M"], ["Cups per day", "2", "16.8M"], ["Bought outside home", "30%", "~5M cups"])),
    S("sanity", "Sanity check", P("About five million cups a day works out to roughly one cup per four residents. Plausible for a city where tea stalls sit on most corners."))),

  A("g-delivery", "Guesstimates", ["product"], "Daily food delivery orders in Bengaluru", 10, "Medium",
    ["Households × ordering share × orders per week ÷ 7", "3.5M households, 30% order, 2 orders a week", "About 3 lakh orders a day", "PM angle: each input is a growth lever"],
    S("structure", "Structure", P("Think in households, since one order usually feeds a household."), CO("Daily orders = Households × share that orders × orders per household per week ÷ 7")),
    S("calc", "Calculation", UL("14M people ÷ 4 = 3.5M households", "3.5M × 30% = 1.05M ordering households", "1.05M × 2 orders ÷ 7 = about 3 lakh orders a day")),
    S("pm", "The product-manager angle", P("A PM should end by naming the lever that matters most. Raising the ordering share from 30% to 35% adds about 50,000 orders a day. Raising frequency from 2 to 2.5 adds about 75,000. Frequency is the larger lever here."))),

  A("c-profit", "Profitability Cases", ["consulting"], "Profitability cases: the revenue-cost tree", 11, "Medium",
    ["Profit = revenue − cost; split each one", "Revenue = price × volume, by segment", "Costs: fixed vs variable, then by line item", "Find where the change happened: time, product, region", "Close with 2–3 prioritised actions"],
    S("tree", "The tree", P("Profit falls because revenue fell, costs rose, or both. Split each side until you can point to one driver."), TB(["Revenue", "Cost"], ["Price × volume", "Fixed: rent, salaries, depreciation"], ["By product, region, channel", "Variable: materials, logistics, commissions"])),
    S("diagnose", "Diagnose before you recommend", UL("Ask when the decline started and whether competitors saw the same", "Compare against the industry to separate company problems from market problems", "Segment until one product, region or customer group explains most of the gap")),
    S("recommend", "Recommendations", P("Give two or three actions, ranked by impact and ease, and name the risk of each. End with next steps."))),

  A("c-pricing", "Pricing Strategy", ["consulting"], "Pricing strategy: cost, competitor, value", 10, "Medium",
    ["Three anchors: cost floor, competitor reference, value ceiling", "Price between cost and customer value", "Segment customers by willingness to pay", "Test with an experiment before a full rollout"],
    S("anchors", "The three anchors", TB(["Approach", "Question it answers", "Weakness"], ["Cost-plus", "What is the minimum I can charge?", "Ignores what customers value"], ["Competitor-based", "What do customers compare me to?", "Starts a price war"], ["Value-based", "What is it worth to the customer?", "Hard to measure"])),
    S("segments", "Segment and tier", P("Different customers value the same product differently. Offer tiers so each group self-selects, for example a free plan, a standard plan and a premium plan.")),
    S("test", "Test it", P("Propose an A/B test or a regional pilot, name the metric (conversion and revenue per user), and say what result would make you roll back."))),

  A("c-entry", "Market Entry", ["consulting"], "Market entry: attractive, winnable, doable", 10, "Medium",
    ["Is the market attractive: size, growth, profit pool?", "Can we win: capabilities, competition?", "How to enter: build, buy or partner?", "Name the top risks and a go/no-go trigger"],
    S("market", "Is the market attractive?", UL("Size and growth", "Competitive intensity and profit margins", "Regulation and entry barriers")),
    S("fit", "Can we win?", P("Compare your capabilities with what customers in this market need. Be specific about what you have, what you lack, and how long it takes to close the gap.")),
    S("mode", "Entry mode", TB(["Mode", "Speed", "Control", "Capital"], ["Build", "Slow", "High", "Medium"], ["Buy", "Fast", "High", "High"], ["Partner", "Fast", "Low", "Low"]))),

  A("c-mna", "Merger & Acq.", ["consulting"], "M&A cases: fit, value, synergies, risk", 10, "Hard",
    ["Strategic fit comes first", "Value the target standalone", "Split synergies into revenue and cost", "Integration risk can erase the premium", "Recommend with a walk-away price"],
    S("fit", "Strategic fit", P("Why buy rather than build or partner? Name the capability, customer base or market access you are acquiring.")),
    S("value", "Valuation and synergies", UL("Standalone value from cash flows or comparable multiples", "Cost synergies are more reliable than revenue synergies", "Do not pay away more than 50% of synergies in the premium")),
    S("risk", "Integration risk", P("Culture clash, key-person loss, and system integration are the usual causes of failed deals. Name the biggest one and how you would mitigate it."))),

  A("c-gtm", "Go-to-Market", ["consulting"], "Go-to-market: segment, proposition, channel", 9, "Medium",
    ["Pick one beachhead segment", "State the proposition in a single sentence", "Choose channels by cost to acquire a customer", "Price to the segment, not the market", "Define launch metrics up front"],
    S("segment", "Choose the beachhead", P("Launching to everyone is launching to no one. Pick the segment with the sharpest pain and the shortest sales cycle.")),
    S("channels", "Channels", TB(["Channel", "Good for", "Watch out for"], ["Direct sales", "High-value B2B", "Slow, expensive"], ["Marketplaces", "Fast reach in consumer goods", "Margin share"], ["Partnerships", "Borrowed trust", "Dependence"])),
    S("metrics", "Launch metrics", UL("Awareness: reach and trial rate", "Conversion: trial to paid", "Retention: repeat purchase at 30 and 90 days"))),

  A("p-design", "Product Design", ["product"], "Product design: users, pain, solutions", 12, "Medium",
    ["Clarify the goal and the user group", "Segment users, pick one", "List their pain points, pick the biggest", "Generate 3 solutions, prioritise with a rule", "Define one success metric"],
    S("users", "Pick a user", P("Name two or three user groups, pick one, and say why. This is the step interviewers remember.")),
    S("pain", "Pain points and solutions", UL("List the user’s journey and mark where it hurts", "Pick the biggest pain point", "Offer three distinct solutions, not three versions of the same one")),
    S("prioritise", "Prioritise", TB(["Criterion", "Question"], ["Impact", "How much of the pain does this remove?"], ["Effort", "How long will it take to build?"], ["Risk", "What could go wrong?"]))),

  A("p-metric", "Metric Cases", ["product"], "Metric cases: goal, funnel, guardrails", 9, "Medium",
    ["Start with the product goal", "Map the user journey as a funnel", "Choose one north-star metric", "Add input metrics and guardrails", "Call out trade-offs"],
    S("goal", "Start with the goal", P("A metric is only useful relative to a goal. Ask what the product is for, then choose the number that proves it is working.")),
    S("funnel", "Funnel and metric types", TB(["Type", "Example for a food-delivery app"], ["North star", "Weekly orders per active user"], ["Input", "Search-to-cart conversion, delivery time"], ["Guardrail", "Cancellation rate, support tickets"])),
    S("tradeoff", "Trade-offs", P("Every metric can be gamed. Say how it could be, and which guardrail would catch it."))),

  A("p-rca", "RCA Cases", ["product"], "RCA cases: find why a metric moved", 10, "Medium",
    ["Confirm the drop is real: data and definition", "Slice by time, platform, geography, cohort", "Rule out external causes", "Then look at what changed internally", "Rank hypotheses and say how you’d test the top one"],
    S("confirm", "Confirm the drop", UL("Is the data pipeline healthy?", "Is the metric defined the same way as last week?", "Was this seasonal or a one-off?")),
    S("slice", "Slice the data", P("Look for the segment where the drop is concentrated. If it is only on Android in one city, you have already cut the search space by 90%.")),
    S("causes", "Internal vs external", TB(["Internal", "External"], ["Release or bug", "Competitor campaign"], ["Pricing or promo change", "Weather or holiday"], ["Algorithm change", "Regulation"]))),
];

const TOPICS = {
  consulting: ["Guesstimates", "Profitability Cases", "Pricing Strategy", "Market Entry", "Merger & Acq.", "Go-to-Market"],
  product: ["Guesstimates", "Product Design", "Metric Cases", "RCA Cases"],
};
const TRACK_NAME = { consulting: "Consulting", product: "Product Management" };
const TOPIC_TYPE = { "Guesstimates": "Guesstimate", "Profitability Cases": "Profitability", "Pricing Strategy": "Pricing Strategy", "Market Entry": "Market Entry", "Merger & Acq.": "M&A", "Go-to-Market": "Go-to-Market", "Product Design": "Product Design", "Metric Cases": "Metric Cases", "RCA Cases": "RCA Cases" };
const TYPE_LABEL = Object.fromEntries(Object.entries(TOPIC_TYPE).map(([k, v]) => [v, k]));
const TRACK_TYPES = { consulting: ["Guesstimate", "Profitability", "Pricing Strategy", "Market Entry", "M&A", "Go-to-Market"], product: ["Guesstimate", "Product Design", "Metric Cases", "RCA Cases"] };
const trackFor = t => t !== "Guesstimate" && TRACK_TYPES.product.includes(t) ? "product" : "consulting";
const TYPE_DESC = {
  "Guesstimate": "Estimate a number from first principles. The most common opener in both consulting and product interviews.",
  "Profitability": "Find why profit fell and what to do about it, using a revenue and cost tree.",
  "Pricing Strategy": "Set or change a price using cost, competitors and customer value.",
  "Market Entry": "Decide whether to enter a market and how: build, buy or partner.",
  "M&A": "Judge whether an acquisition or merger creates value, and at what price.",
  "Go-to-Market": "Plan a launch: who to target, what to say, where to sell and how to measure it.",
  "Product Design": "Design or improve a product for a specific user, then prioritise and measure.",
  "Metric Cases": "Define success for a product and choose metrics that cannot be easily gamed.",
  "RCA Cases": "A metric moved. Work out why, in a structured way, and what to do next.",
};
const KINDS = [
  ["hurry", "In a hurry", "5-minute revision sheets", Zap],
  ["concepts", "Core Concepts", "Frameworks and theory", BookOpen],
  ["solved", "Solved Cases", "Worked cases with one-pagers", CheckCircle2],
  ["patterns", "Patterns & Trends", "What keeps getting asked", TrendingUp],
];
const KIND_LABEL = Object.fromEntries(KINDS.map(k => [k[0], k[1]]));

const TAG = { "g-approach": ["Guesstimate", "concepts"], "g-topdown": ["Guesstimate", "concepts"], "g-cabs": ["Guesstimate", "solved"], "g-smartphones": ["Guesstimate", "solved"], "g-chai": ["Guesstimate", "solved"], "g-delivery": ["Guesstimate", "solved"], "c-profit": ["Profitability", "concepts"], "c-pricing": ["Pricing Strategy", "concepts"], "c-entry": ["Market Entry", "concepts"], "c-mna": ["M&A", "concepts"], "c-gtm": ["Go-to-Market", "concepts"], "p-design": ["Product Design", "concepts"], "p-metric": ["Metric Cases", "concepts"], "p-rca": ["RCA Cases", "concepts"] };
const XA = (type, kind, id, title, mins, level, key, ...secs) => ({ id, type, kind, title, mins, level, key, sections: secs.map(([t, ...b], i) => ({ id: "s" + i, title: t, blocks: b.map(x => typeof x === "string" ? P(x) : Array.isArray(x) ? UL(...x) : x) })) });
const SV = (type, id, title, mins, level, key, cl, st, an, rc) => XA(type, "solved", id, title, mins, level, key, ["Clarify the problem", cl], ["Structure", st], ["Analysis", an], ["Recommendation", rc]);

const NEW = [
  /* ── Guesstimate ── */
  XA("Guesstimate", "hurry", "gh1", "Guesstimates in 5 minutes", 5, "Easy", ["Clarify, structure, segment, estimate, sanity-check", "Prefer round numbers: 20M, 40%, 1.5", "Say the formula before the arithmetic", "Finish with a sanity check and one lever"],
    ["The whole method", CO("Clarify the scope, pick top-down or bottom-up, split into 3–5 segments, attach round numbers, then sanity-check.")], ["Before you speak", ["Restate the question with units and a time period", "Name your formula out loud", "Give each assumption a one-line reason"]]),
  XA("Guesstimate", "hurry", "gh2", "Numbers cheat sheet", 4, "Easy", ["India: 1.45B people, ~300M households", "Urban ~36%, working-age ~65%", "Metros: Mumbai ~21M, Delhi ~20M, Bengaluru ~14M", "Smartphone users ~650M"],
    ["Population anchors", TB(["Anchor", "Value (approx.)"], ["India", "1.45 billion"], ["Households", "~300 million"], ["Metro Mumbai", "~21 million"], ["Metro Delhi", "~20 million"], ["Metro Bengaluru", "~14 million"])], ["Use them well", ["Pick the anchor closest to the question", "Round to one significant figure", "Say “approximately” once, then move on"]]),
  XA("Guesstimate", "hurry", "gh3", "Mental maths shortcuts", 4, "Easy", ["Convert to lakhs and crores early", "Build any percentage from 10% and 1%", "Multiply by 25 as ×100 then ÷4", "Keep two significant figures"],
    ["Shortcuts that save time", ["10% is one decimal place; 5% is half of that", "×25 is ×100 then ÷4; ×12 is ×10 plus ×2", "Divide by 5 by doubling, then dividing by 10"]], ["Practise", "Do five conversions a day between millions, lakhs and crores until it feels automatic."]),
  XA("Guesstimate", "concepts", "gc3", "Segmentation and MECE splits", 8, "Medium", ["Segments must not overlap and must cover everything", "Split by behaviour, not only demographics", "Three to five segments is the sweet spot", "Each segment should need a different number"],
    ["What MECE means", "Mutually exclusive, collectively exhaustive. Every person or unit lands in exactly one bucket, and no bucket is missing."], ["Useful splits", TB(["Question", "Good split"], ["Cabs in a city", "Commuters, tourists, airport trips"], ["Chai cups", "Home, office, street stalls"], ["Smartphones", "Replacement, first-time, upgrade"])], ["Test your split", ["Can one person fit two buckets? If yes, fix it", "Do the buckets add up to the total?", "Would each bucket need a different number?"]]),
  XA("Guesstimate", "concepts", "gc4", "Choosing assumptions you can defend", 7, "Medium", ["Anchor on something the interviewer also knows", "Give a one-line reason for each number", "Round to numbers that multiply easily", "Flag the biggest assumption and offer to flex it"],
    ["A defensible assumption has a reason", CO("Number, then because. “4% ride cabs daily, because most commuters use trains.”")], ["Flag your biggest lever", "The assumption that moves the answer most deserves its own sentence. Offer to test it with a different value."]),
  XA("Guesstimate", "patterns", "gp1", "Guesstimate patterns in 2026 interviews", 6, "Easy", ["Mobility and delivery dominate this season", "Interviewers add a twist after the number", "Supply-side and demand-side variants of the same question", "Product roles ask for a lever, not just a number"],
    ["What keeps coming up", TB(["Theme", "Example"], ["Mobility", "Cabs in Mumbai, EV chargers"], ["Food and delivery", "Orders in Bengaluru, cloud kitchen revenue"], ["Banking and fintech", "ATMs for a new state"])], ["The usual twists", ["Peak versus off-peak", "Rural versus urban", "What changes if the price doubles?"]]),
  XA("Guesstimate", "patterns", "gp2", "Assumption traps interviewers love", 6, "Medium", ["Overlapping segments", "Mixing registered and active units", "Ignoring peak behaviour", "False precision like 37.2%"],
    ["Four traps", ["Double counting: someone who walks and rides is counted twice", "Registered versus active: cars registered are not cars on the road today", "Averages hiding peaks: a stall busy four hours is not busy all day", "False precision: exact decimals signal that you invented the number"]], ["Recovery", "If you spot a mistake mid-answer, say so, correct it and carry on. Interviewers reward the correction."]),

  /* ── Profitability ── */
  XA("Profitability", "hurry", "ph1", "Profitability in 5 minutes", 5, "Easy", ["Profit = revenue minus cost", "Revenue = price × volume, by segment", "Cost = fixed plus variable, by line item", "Find where the change happened", "Close with 2–3 ranked actions"],
    ["The tree", CO("Profit falls because revenue fell, cost rose, or both. Split until one driver explains the gap.")], ["Order of questions", ["When did the decline start?", "Is the whole industry affected?", "Which product, region or customer explains most of it?"]]),
  XA("Profitability", "hurry", "ph2", "Profitability checklist and red flags", 4, "Easy", ["Check the industry trend first", "Compare margin by product", "Look at cost per unit, not only total cost", "Watch for one-off items"],
    ["Checklist", ["Industry versus company", "Price versus volume", "Fixed versus variable cost", "One-offs and accounting changes"]], ["Red flags", ["Revenue up, profit down: look at discounting and mix", "One cost line up sharply: look at suppliers and wastage"]]),
  XA("Profitability", "concepts", "pc2", "Cost structure: fixed, variable, semi-variable", 8, "Medium", ["Fixed cost does not move with volume", "Variable cost rises with each unit", "Semi-variable cost steps up in chunks", "High fixed cost means high operating leverage"],
    ["Three kinds of cost", TB(["Kind", "Behaviour", "Example"], ["Fixed", "Same at any volume", "Factory rent"], ["Variable", "Rises with volume", "Raw materials"], ["Semi-variable", "Steps up in chunks", "Extra shift supervisors"])], ["Why it matters", "When most cost is fixed, a small fall in volume cuts profit sharply. This is operating leverage, and interviewers like candidates who name it."]),
  SV("Profitability", "ps1", "Cement maker: margins down 5 points", 14, "Medium", ["Revenue flat, so start with cost", "Fuel and power cost per tonne up 25%", "Competitors fell only 2 points", "Fix: alternative fuels and nearer dispatch"],
    ["Margin fell from 22% to 17% over two years", "Revenue is flat and the market is growing slowly", "Single product line across five plants"], "Revenue is flat, so look at cost first. Split cost into raw materials, fuel and power, freight and overheads.",
    ["Raw material cost per tonne is steady", "Fuel and power per tonne is up 25% as coal prices rose", "Freight is up 8% because average delivery distance grew", "Competitors lost 2 points, so about 3 points are company-specific"], ["Move part of the fuel mix to alternative fuels", "Rebalance dispatch toward nearer plants", "Hedge fuel contracts", "Risk: alternative fuel supply is limited"]),
  SV("Profitability", "ps2", "Regional airline losing money on short routes", 16, "Hard", ["Compute profit per route, not per airline", "Load factor and yield drive revenue", "Fixed cost per flight hurts short routes", "Fix: cut or re-time routes before cutting cost"],
    ["Net loss on routes under 600 km", "Fleet is turboprop aircraft; competitors fly the same routes", "Goal: return to breakeven in 12 months"], "Profit per route = seats × load factor × fare − cost per flight. Split costs into fuel, crew, landing fees and maintenance.",
    ["Load factor is 58% against a 75% breakeven", "Landing and handling fees are a large share of cost on short sectors", "Fares are flat because of a rival’s promotions"], ["Cut the five worst routes and redeploy aircraft to routes above breakeven", "Re-time flights to business-traveller peaks", "Negotiate airport fees in return for volume", "Risk: lost feeder traffic to the main network"]),
  XA("Profitability", "patterns", "pp1", "What profitability cases test in 2026", 5, "Easy", ["Industries: manufacturing, aviation, retail, FMCG", "Most cases hide one dominant driver", "Interviewers reward segmenting before solving", "Recommendations must be ranked"],
    ["Recurring shapes", TB(["Pattern", "What is hidden"], ["Revenue flat, margin down", "A single cost line"], ["Revenue up, profit down", "Discounting or mix shift"], ["Profit down in one region", "Local competitor or cost"])], ["How to prepare", "Do the same case twice: once to find the driver, once to practise the recommendation out loud."]),

  /* ── Pricing ── */
  XA("Pricing Strategy", "hurry", "pr_h1", "Pricing in 5 minutes", 5, "Easy", ["Three anchors: cost, competitor, value", "Price sits between cost floor and value ceiling", "Segment by willingness to pay", "Test before a full rollout"],
    ["The three anchors", CO("Cost sets the floor, value sets the ceiling, competitors tell you what customers compare you to.")], ["Checklist", ["Who are the segments?", "What is each segment’s alternative?", "What test would settle it?"]]),
  XA("Pricing Strategy", "hurry", "pr_h2", "Price elasticity cheat sheet", 4, "Easy", ["Elasticity = % change in volume ÷ % change in price", "Below 1: raising price raises revenue", "Above 1: cutting price raises revenue", "Essentials are inelastic, discretionary items elastic"],
    ["Quick guide", TB(["Elasticity", "Meaning", "Action"], ["Below 1", "Customers barely react", "Consider raising price"], ["Around 1", "Revenue stays flat", "Hold price"], ["Above 1", "Customers react strongly", "Consider cutting price"])], ["Say it aloud", "Even without data, state which side of 1 you think the product is on, and why."]),
  XA("Pricing Strategy", "concepts", "pr_c2", "Willingness to pay and segmentation", 8, "Medium", ["Customers value the same product differently", "Tiers let customers sort themselves", "Anchor the top tier to make the middle look sensible", "Fences stop heavy users trading down"],
    ["Why segment", "A single price leaves money on the table from customers who would pay more and loses customers who would pay less."], ["Common structures", TB(["Structure", "Example"], ["Good, better, best", "Basic, standard, premium plans"], ["Usage-based", "Pay per ride or per message"], ["Bundling", "Music, video and delivery in one plan"])], ["Fences", "Differences in features, quality or timing that stop high-value customers choosing the cheap tier."]),
  SV("Pricing Strategy", "pr_s1", "Premium tier for a streaming app", 13, "Medium", ["Value-based pricing with segments", "Premium targets households with many screens", "Anchor against the standard plan", "Test in two cities for four weeks"],
    ["Standard plan costs ₹199 a month with 30M subscribers", "Goal: add a premium tier without cannibalising standard", "No new content, only quality and screens"], "Customer segments, then willingness to pay, then tier design, then test.",
    ["Large households and heavy viewers value 4K and four screens", "Survey suggests 15% would pay ₹349 for premium", "Risk: 10% of standard users trade up and gain no new revenue per user"], ["Launch premium at ₹349 with 4K, four screens and downloads", "Run a four-week test in two cities", "Success metric: revenue per user, not tier mix", "Roll back if standard churn rises above 2%"]),
  SV("Pricing Strategy", "pr_s2", "Surge pricing for ride-hailing", 13, "Medium", ["Surge balances demand and supply", "Riders hate surprises; show the multiplier", "Cap the multiplier and explain it", "Measure completed trips, not only revenue"],
    ["Evening peak shows long waits and cancellations", "Goal: improve completed trips at peak", "Constraint: customer trust"], "Surge works on both sides: it reduces demand and attracts more drivers. Check each effect separately.",
    ["Demand falls about 10–15% when prices rise 1.5×", "More drivers log in within ten minutes of surge", "Riders who see the multiplier upfront cancel less than those surprised at the end"], ["Show the multiplier before booking and cap it at 2×", "Use soft nudges: “wait 10 minutes for a lower fare”", "Track completed trips, wait time and rider complaints", "Risk: regulators and PR in extreme events"]),
  XA("Pricing Strategy", "patterns", "pr_p1", "Pricing patterns across interviews", 5, "Easy", ["Consulting: new product price and discount rules", "Tech: subscription tiers and surge", "Interviewers want an experiment, not a guess", "Always link price to a metric"],
    ["What shows up", TB(["Setting", "Typical question"], ["Consulting", "Price a new industrial product"], ["Consumer tech", "Add a premium plan"], ["Marketplace", "Dynamic or surge pricing"])], ["How to prepare", "Always end by naming an experiment, a success metric and a rollback rule."]),

  /* ── Market Entry ── */
  XA("Market Entry", "hurry", "me_h1", "Market entry in 5 minutes", 5, "Easy", ["Is the market attractive?", "Can we win?", "How to enter: build, buy or partner?", "Name risks and a go/no-go trigger"],
    ["Three questions", CO("Attractive, winnable, doable. Answer them in order and give a verdict at the end.")], ["Checklist", ["Size, growth, margins", "Our edge versus incumbents", "Capital, time and control", "Top two risks"]]),
  XA("Market Entry", "hurry", "me_h2", "Entry mode decision table", 4, "Easy", ["Build: slow, full control", "Buy: fast, high capital", "Partner: fast, low control", "Pick on speed, capital and control"],
    ["Decision table", TB(["Mode", "Speed", "Control", "Capital"], ["Build", "Slow", "High", "Medium"], ["Buy", "Fast", "High", "High"], ["Partner", "Fast", "Low", "Low"])], ["Rule of thumb", "Unknown market and low capital: partner. Known market and strategic importance: buy or build."]),
  XA("Market Entry", "concepts", "me_c2", "Sizing the prize and the barriers", 8, "Medium", ["Market size × share you can win", "Barriers: regulation, distribution, brand", "Compare cost to enter with value of the prize", "Say what must be true for entry to pay off"],
    ["Sizing the prize", "Estimate market size, a realistic share after three years, and the margin. This gives a rough profit pool."], ["Barriers", TB(["Barrier", "Question to ask"], ["Regulation", "Licences, foreign ownership limits"], ["Distribution", "Who controls access to customers?"], ["Brand", "Do customers know us here?"])], ["What must be true", "Finish with two or three conditions that make entry worthwhile. It makes the recommendation testable."]),
  SV("Market Entry", "me_s1", "Japanese QSR chain entering India", 18, "Medium", ["Attractive: large, young, fast-growing market", "Winnable: menu localisation is the gap", "Mode: master franchise with a local partner", "Go/no-go: unit economics of the first 10 stores"],
    ["A Japanese quick-service chain with 3,000 stores wants to enter India", "Goal: 100 stores in five years", "Capital is limited"], "Attractiveness, capability, entry mode, then risks.",
    ["QSR market is large and growing double digits", "Competition is intense, led by global burger and pizza chains", "The chain’s edge is speed and consistency, but the menu needs vegetarian options", "Real estate and supply chain are the hard parts"], ["Enter through a master franchise with a local operator", "Open 10 pilot stores in two metros", "Go/no-go: store-level profit above 15% by month 12", "Risk: menu fit and rent inflation"]),
  SV("Market Entry", "me_s2", "Insurer expanding into Tier-3 cities", 18, "Hard", ["Demand exists, distribution is the barrier", "Agents and bank branches are the channels", "Simple products win trust", "Start with partnerships, not own branches"],
    ["An insurer has strong metro presence and little reach beyond Tier-2", "Goal: grow premium by 20% from Tier-3", "Regulation allows bank and agent distribution"], "Customer need, channel, product, then economics.",
    ["Low insurance penetration and growing incomes", "Customers trust local agents and neighbours", "Ticket sizes are smaller, so cost to serve must be low"], ["Simple term and health products with minimal paperwork", "Partner with regional banks and local agents on commission", "Pilot in three states, scale on conversion and persistency", "Risk: mis-selling and low renewals"]),
  XA("Market Entry", "patterns", "me_p1", "Market entry patterns this season", 5, "Easy", ["Foreign brands into India", "Indian firms into Southeast Asia", "Domestic expansion into smaller cities", "Interviewers push on entry mode"],
    ["Typical setups", ["A foreign consumer brand entering India", "An Indian fintech entering a new country", "A metro-based company moving to Tier-2 and Tier-3"]], ["How to prepare", "Memorise the entry mode table and practise giving a one-line verdict on the pros and cons."]),

  /* ── M&A ── */
  XA("M&A", "hurry", "ma_h1", "M&A in 5 minutes", 5, "Easy", ["Strategic fit first", "Value the target on its own", "Add synergies, split revenue and cost", "Integration risk can erase the premium"],
    ["The four steps", CO("Why buy, what is it worth, what are the synergies, and can we integrate it?")], ["Checklist", ["Build, buy or partner?", "Standalone value", "Synergy sizing", "Biggest integration risk"]]),
  XA("M&A", "hurry", "ma_h2", "Synergy cheat sheet", 4, "Easy", ["Cost synergies are more reliable", "Revenue synergies are optimistic", "Never pay away all the synergy", "One-time integration cost reduces value"],
    ["Where synergies come from", TB(["Type", "Examples", "Reliability"], ["Cost", "Shared procurement, overlap in head office", "High"], ["Revenue", "Cross-selling, new geographies", "Low"], ["Financial", "Cheaper borrowing", "Medium"])], ["Rule of thumb", "Pay no more than half the value of the synergies as a premium."]),
  XA("M&A", "concepts", "ma_c2", "Valuation basics for case interviews", 8, "Hard", ["Three methods: cash flows, multiples, precedents", "Value = value of cash flows today", "Multiples need comparable companies", "Always cross-check with a second method"],
    ["Three methods", TB(["Method", "How it works", "Use when"], ["DCF", "Discount future cash flows", "Stable, predictable business"], ["Trading multiples", "Compare with listed peers", "Good comparables exist"], ["Precedent deals", "Prices paid for similar deals", "Control premium matters"])], ["Keep it simple", "Interviews rarely need real numbers. Show you know which method fits and what drives the answer."]),
  SV("M&A", "ma_s1", "PE firm evaluating a diagnostics chain", 20, "Hard", ["Attractive sector, fragmented market", "Value comes from lab utilisation", "Synergies: shared logistics and test mix", "Walk-away price set by downside case"],
    ["A private equity firm is considering buying a 200-centre diagnostics chain", "Target: 20% annual return over five years", "Seller expects 18× earnings"], "Market attractiveness, target quality, valuation, then risks and exit.",
    ["Market grows 12% a year with strong tailwinds in preventive care", "Centre utilisation is 55%, with room to improve", "Brand is strong in two regions, weak elsewhere", "At 18× earnings the base case returns about 16%"], ["Offer at 15× earnings, raise to 16× only with an earn-out", "Value-creation plan: utilisation, test mix, collection centres", "Walk away above 17× in the downside case", "Risk: reimbursement changes and key-doctor attrition"]),
  SV("M&A", "ma_s2", "Pharma merger: finding the synergies", 18, "Medium", ["Cost synergies: manufacturing and G&A", "Revenue synergies: complementary portfolios", "Quantify, then haircut revenue synergies", "Integration risk: sales-force overlap"],
    ["Two mid-sized pharma companies plan to merge", "Both sell in India and Southeast Asia", "Board wants a number for synergies"], "Split synergies into cost and revenue, size each, and then apply a realism check.",
    ["Cost: closing a duplicate plant and merging back office could save 6% of combined cost", "Revenue: cross-selling into each other’s doctors could add 3% but is uncertain", "One-time cost to integrate is about a year of savings"], ["Plan around cost synergies, treat revenue synergies as upside", "Integrate manufacturing first, sales force second", "Set a 100-day plan with named owners", "Risk: key-talent loss in the sales team"]),
  XA("M&A", "patterns", "ma_p1", "M&A patterns across firms", 5, "Easy", ["PE firms ask about value creation", "Strategy firms ask about fit and synergies", "Expect a numbers round on valuation", "Integration is the common tiebreaker"],
    ["What changes by employer", TB(["Employer", "Focus"], ["PE and advisory", "Valuation and exit"], ["Strategy consulting", "Fit and synergies"], ["Corporate strategy", "Integration"])], ["How to prepare", "Learn one valuation method well enough to explain its drivers in two minutes."]),

  /* ── Go-to-Market ── */
  XA("Go-to-Market", "hurry", "gt_h1", "Go-to-market in 5 minutes", 5, "Easy", ["Pick one beachhead segment", "One-sentence proposition", "Channels by cost to acquire", "Price for the segment", "Define launch metrics up front"],
    ["The five choices", CO("Segment, proposition, channel, price, metrics. Make one clear choice at each step.")], ["Checklist", ["Who feels the pain most?", "Why us?", "Where do they already shop?", "How will we know it works?"]]),
  XA("Go-to-Market", "hurry", "gt_h2", "Launch metrics cheat sheet", 4, "Easy", ["Awareness, trial, conversion, retention", "Customer acquisition cost versus lifetime value", "Payback under 12 months for consumer, 18 for B2B", "Pick one metric per stage"],
    ["The funnel", TB(["Stage", "Metric"], ["Awareness", "Reach, branded searches"], ["Trial", "Sign-ups, first purchase"], ["Conversion", "Trial to paid"], ["Retention", "30 and 90 day repeat"])], ["Unit economics", "Lifetime value should be at least three times acquisition cost."]),
  XA("Go-to-Market", "concepts", "gt_c2", "Channels and unit economics", 8, "Medium", ["Channel choice follows ticket size", "Direct sales for high-value B2B", "Marketplaces and retail for consumer goods", "Check payback period for each channel"],
    ["Match channel to ticket size", TB(["Ticket size", "Best channel"], ["Low, high volume", "Marketplaces, retail, digital"], ["Medium", "Inside sales, partners"], ["High", "Field sales"])], ["Unit economics", "Contribution per customer, minus acquisition cost, gives payback. If payback is long, change the channel or the price."]),
  SV("Go-to-Market", "gt_s1", "Launching a protein snack brand", 15, "Medium", ["Beachhead: urban gym-goers aged 22–35", "Proposition: high protein, tastes like a snack", "Channels: quick-commerce, then modern trade", "Metric: repeat purchase at 30 days"],
    ["A new brand makes protein bars and chips", "Budget is limited; launch in three cities", "Goal: reach ₹50 crore in 18 months"], "Segment, proposition, channel, price, metrics.",
    ["Gym-goers and health-conscious office workers are the sharpest segment", "Taste, not protein, is what repeat buyers cite", "Quick-commerce gives fast reach and data; modern trade follows once repeat is proven"], ["Launch in quick-commerce in three metros", "Price at a small premium to mainstream bars", "Success: 30-day repeat above 25%", "Risk: copycat launches from large FMCG players"]),
  SV("Go-to-Market", "gt_s2", "B2B SaaS go-to-market for SMB accounting", 18, "Hard", ["Beachhead: trading firms with 10–50 staff", "Sell through accountants as a channel", "Low-touch onboarding", "Metric: payback under 12 months"],
    ["A start-up has built cloud accounting software for small businesses", "ARPU is ₹1,500 a month", "Direct sales are too expensive at this price"], "Segment, proposition, channel, pricing, metrics.",
    ["Direct field sales cost more than first-year revenue", "Chartered accountants advise many small firms and influence software choice", "A reseller programme lowers acquisition cost"], ["Build an accountant partner programme with revenue share", "Offer free migration and a two-month trial", "Measure partner-sourced payback and monthly churn", "Risk: dependence on a few large accounting firms"]),
  XA("Go-to-Market", "patterns", "gt_p1", "Go-to-market patterns", 5, "Easy", ["FMCG launches favour quick-commerce", "B2B cases hinge on channel economics", "Interviewers like a clear beachhead", "Metrics must match the stage"],
    ["Common setups", ["New consumer brand with a small budget", "B2B product moving from large clients to SMBs", "An existing brand launching in a new city"]], ["How to prepare", "For every GTM case, state your beachhead in the first two minutes."]),

  /* ── Product Design ── */
  XA("Product Design", "hurry", "pd_h1", "Product design in 5 minutes", 5, "Easy", ["Clarify goal and user group", "Pick one user and say why", "List pain points, pick the biggest", "Three distinct solutions", "Prioritise, then one success metric"],
    ["The flow", CO("Goal, user, pain, solutions, prioritisation, metric. Spend the most time on the user.")], ["Checklist", ["State your assumptions about the product goal", "Name the user’s job to be done", "Offer three solutions that differ in kind"]]),
  XA("Product Design", "hurry", "pd_h2", "Prioritisation frameworks cheat sheet", 4, "Easy", ["Impact versus effort", "RICE: reach, impact, confidence, effort", "Choose one and explain it in a line", "Name the risk of the winner"],
    ["Frameworks", TB(["Framework", "Use when"], ["Impact and effort", "Quick, visual choice"], ["RICE", "Several competing ideas with data"], ["Must, should, could", "Scoping a first release"])], ["Tip", "Interviewers care that your choice is explained, not which framework you use."]),
  XA("Product Design", "concepts", "pd_c2", "Understanding users and their pain points", 8, "Medium", ["Segment by need, not only demographics", "Use jobs to be done", "Map the journey and mark where it hurts", "Pick the pain with highest frequency and severity"],
    ["Find the job", "Ask what the user is trying to get done, in what situation, and what they use today."], ["Rank pain points", TB(["Pain point", "How often", "How severe"], ["Example: finding safe walking routes", "Daily", "High"], ["Example: reading small map labels", "Weekly", "Low"])], ["Choose one", "Say which pain you are solving and which you are leaving for later."]),
  SV("Product Design", "pd_s1", "Savings app for gig workers", 20, "Medium", ["User: delivery and cab drivers with irregular income", "Pain: no buffer between uneven weeks", "Solution: automatic micro-savings per trip", "Metric: weekly active savers"],
    ["Design a savings product for gig workers", "Goal: help them build an emergency buffer", "Assume a mobile-first, low-data context"], "Goal, user, pain points, solutions, prioritisation, metrics.",
    ["Income arrives daily but varies widely week to week", "Pain points: no buffer, cash needs mid-month, distrust of lock-ins", "Solutions: round-up on each payout, goal-based pots, emergency withdrawal with no penalty"], ["Ship round-ups with instant withdrawal first", "Why: highest impact for the lowest effort and builds trust", "Metric: share of users saving in four of the next five weeks", "Risk: users withdraw everything within days"]),
  SV("Product Design", "pd_s2", "Improving Google Maps for pedestrians", 18, "Easy", ["User: tourists walking in a new city", "Pain: unsafe and confusing walking routes", "Solution: walking-first mode with shaded and lit routes", "Metric: completed walking routes"],
    ["Improve Maps for people who walk", "Goal: increase walking trips completed", "Assume global usage"], "Segment pedestrians, find pain, propose solutions, prioritise.",
    ["Segments: commuters, tourists, fitness walkers", "Tourists have the sharpest pain because they do not know the area", "Pain points: unclear crossings, dead ends, unsafe streets"], ["Ship a walking mode that shows lit, shaded and busy routes", "Add landmark-based directions for tourists", "Metric: completed walking routes per tourist", "Risk: map data quality varies by city"]),
  XA("Product Design", "patterns", "pd_p1", "Product design patterns", 5, "Easy", ["“Improve X” and “Design Y for Z” are the two shapes", "Interviewers test user focus first", "Prioritisation is the second filter", "Metrics close the answer"],
    ["Common prompts", ["Improve a familiar app for a specific group", "Design a product for an underserved user", "Add a feature to an existing app"]], ["How to prepare", "Practise the first ten minutes: goal, user, pain. They decide the rest of the interview."]),

  /* ── Metric Cases ── */
  XA("Metric Cases", "hurry", "mc_h1", "Metric cases in 5 minutes", 5, "Easy", ["Start from the product goal", "Map the funnel", "One north-star metric", "Input metrics and guardrails", "Call out trade-offs"],
    ["The steps", CO("Goal, funnel, north star, inputs, guardrails, trade-offs.")], ["Checklist", ["What is the product for?", "Who is the user?", "How could this metric be gamed?"]]),
  XA("Metric Cases", "hurry", "mc_h2", "Metric glossary", 4, "Easy", ["DAU, WAU, MAU: active users", "Retention: users returning after N days", "Conversion: share completing a step", "Churn: share leaving"],
    ["Terms", TB(["Metric", "Meaning"], ["DAU, MAU", "Daily and monthly active users"], ["Retention", "Share returning after N days"], ["Conversion", "Share completing a step"], ["ARPU", "Average revenue per user"])], ["Tip", "Define a metric once, with its numerator and denominator, before using it."]),
  XA("Metric Cases", "concepts", "mc_c2", "North star, input metrics and guardrails", 8, "Medium", ["North star: one number that captures user value", "Inputs: levers the team can move", "Guardrails: what must not get worse", "Gaming risk applies to every metric"],
    ["Three layers", TB(["Layer", "Example for a food-delivery app"], ["North star", "Weekly orders per active user"], ["Inputs", "Search-to-cart conversion, delivery time"], ["Guardrails", "Cancellation rate, support tickets"])], ["Test your metric", "Ask how a team could hit the number while hurting the user. Add a guardrail for that."]),
  SV("Metric Cases", "mc_s1", "Defining success for Instagram Reels", 14, "Medium", ["Goal: creator and viewer engagement", "North star: minutes watched per active user", "Inputs: creators posting, completion rate", "Guardrails: time-spent regret, creator retention"],
    ["Reels is a short-video product within a social app", "Goal: growth in healthy engagement", "Success should serve viewers and creators"], "Two sides: viewers and creators. Funnel for each, then one north star.",
    ["Viewer funnel: open, watch, finish, like or share, return", "Creator funnel: record, post, get views, post again", "Minutes watched alone can be gamed by autoplay"], ["North star: minutes watched per weekly active user", "Inputs: completion rate, posts per creator", "Guardrails: reported dissatisfaction, creator retention", "Trade-off: more recommendations for new creators versus watch time"]),
  SV("Metric Cases", "mc_s2", "Health of a food-delivery app", 12, "Easy", ["Health = demand, supply and experience", "North star: weekly orders per active user", "Guardrails: cancellations, delivery time", "Check both sides of the marketplace"],
    ["Measure the overall health of a delivery app", "Three sides: customers, restaurants and delivery partners"], "Metrics for each side, then one overall number.",
    ["Customers: new, active, order frequency, repeat rate", "Restaurants: acceptance rate, preparation time, rating", "Delivery partners: utilisation, earnings per hour, attrition"], ["North star: weekly orders per active user", "Guardrails: delivery time and cancellation rate", "Review each side monthly", "Trade-off: faster delivery can raise partner stress"]),
  XA("Metric Cases", "patterns", "mc_p1", "Metric case patterns", 5, "Easy", ["“Define success” and “measure health” are the two shapes", "Marketplaces need metrics for each side", "Interviewers probe gaming", "Prepare one example per product type"],
    ["Common prompts", ["Define success for a new feature", "Which metrics would you track for a marketplace?", "How do you know a launch worked?"]], ["How to prepare", "Learn one north star and three guardrails for five familiar products."]),

  /* ── RCA ── */
  XA("RCA Cases", "hurry", "rc_h1", "RCA in 5 minutes", 5, "Easy", ["Confirm the drop is real", "Slice by time, platform, geography, cohort", "Rule out external causes", "Then internal changes", "Rank hypotheses and test the top one"],
    ["The order", CO("Confirm, slice, external, internal, hypotheses, action.")], ["Checklist", ["Is the data pipeline healthy?", "Has the metric definition changed?", "Is it seasonal?"]]),
  XA("RCA Cases", "hurry", "rc_h2", "RCA hypotheses checklist", 4, "Easy", ["Releases and bugs", "Pricing and promotions", "Competitor moves", "Seasonality and events"],
    ["Where causes come from", TB(["Internal", "External"], ["Release or bug", "Competitor campaign"], ["Pricing or promo change", "Weather or holiday"], ["Algorithm change", "Regulation"])], ["Tip", "State your hypotheses before asking for data, then use data to rule each one out."]),
  XA("RCA Cases", "concepts", "rc_c2", "Slicing data: where to look first", 8, "Medium", ["Time: when did it start?", "Platform: iOS, Android, web", "Geography and cohort", "A concentrated drop shrinks the search space"],
    ["Slice in this order", TB(["Slice", "Why first"], ["Time", "Matches events to the start of the drop"], ["Platform", "Catches release bugs"], ["Geography", "Catches local competitors or events"], ["Cohort", "Catches new versus existing user problems"])], ["Quantify", "If the drop is only on Android in one city, you have cut the search space by about 90%."]),
  SV("RCA Cases", "rc_s1", "Swiggy orders down 12% week on week", 16, "Medium", ["Confirm data and definition first", "Slice by city, platform and time", "Drop concentrated in one city on Android", "Likely cause: app release bug"],
    ["Orders fell 12% week on week", "Data pipeline is healthy and the metric definition is unchanged", "No major holiday this week"], "Confirm, slice, external factors, internal changes.",
    ["The fall is concentrated in two cities on Android", "A release went live on Monday in those cities", "Checkout failures rose sharply after release", "No competitor campaign found"], ["Roll back the release in the two cities", "Fix the checkout bug and add monitoring", "Recover with a short offer to affected users", "Monitor daily orders and checkout failures"]),
  SV("RCA Cases", "rc_s2", "Cart conversion fell after an app update", 13, "Easy", ["Cart-to-order conversion fell 4 points", "Compare old and new app versions", "Check the funnel step by step", "Likely cause: payment step change"],
    ["Conversion from cart to order fell after the latest update", "Traffic and cart volume are stable"], "Funnel by step, then by app version and payment method.",
    ["Old versions are unchanged, so the cause is in the update", "Drop-off is highest at the payment screen", "UPI failures are up while card payments are flat"], ["Fix the UPI flow in the new version", "Hot-fix release within 48 hours", "Add a payment-success alert", "Risk: users who left may not return"]),
  XA("RCA Cases", "patterns", "rc_p1", "RCA patterns", 5, "Easy", ["Most RCA cases hide a release or a seasonal cause", "Interviewers reward sequence over speed", "Good answers rank hypotheses", "End with a way to test the top one"],
    ["Common shapes", TB(["Prompt", "Likely cause"], ["Sudden drop on one day", "Release or outage"], ["Slow decline over weeks", "Competitor or product-market change"], ["Drop in one region", "Local event or partner issue"])], ["How to prepare", "Practise stating the sequence out loud until it feels automatic."]),
];

const ARTICLES = [...BASE.map(a => ({ ...a, type: TAG[a.id][0], kind: TAG[a.id][1] })), ...NEW];
const getArt = id => ARTICLES.find(a => a.id === id);
const itemsFor = (type, kind) => ARTICLES.filter(a => a.type === type && a.kind === kind);

const TYPES = ["Guesstimate", "Profitability", "Pricing Strategy", "Market Entry", "M&A", "Go-to-Market", "Product Design", "Metric Cases", "RCA Cases"];
const TC = { "Guesstimate": "#E59B0B", "Profitability": "#2F7D6B", "Pricing Strategy": "#3B6FB6", "Market Entry": "#7A5BB5", "M&A": "#B5547A", "Go-to-Market": "#C0662B", "Product Design": "#1F8FA3", "Metric Cases": "#5B7B2E", "RCA Cases": "#A64B3C" };
const trackOf = c => c.type === "Guesstimate" ? "Both" : ["Product Design", "Metric Cases", "RCA Cases"].includes(c.type) ? "Product" : "Consulting";
const SKILLS = {
  "Guesstimate": ["Structuring", "Estimation", "Mental maths", "Sanity checks"],
  "Profitability": ["Structuring", "Hypothesis-driven analysis", "Quantitative reasoning", "Recommendations"],
  "Pricing Strategy": ["Customer segmentation", "Value thinking", "Competitive reasoning", "Experiment design"],
  "Market Entry": ["Market sizing", "Capability fit", "Entry modes", "Risk assessment"],
  "M&A": ["Strategic fit", "Valuation basics", "Synergies", "Integration risk"],
  "Go-to-Market": ["Segmentation", "Positioning", "Channel choice", "Launch metrics"],
  "Product Design": ["User empathy", "Problem framing", "Solution ideation", "Prioritisation"],
  "Metric Cases": ["Goal setting", "Funnel thinking", "Metric design", "Trade-offs"],
  "RCA Cases": ["Data hygiene", "Segmentation", "Hypothesis ranking", "Experiment design"],
};
const READ = { c1: "g-cabs", c2: "g-smartphones", c3: "g-chai", c4: "g-delivery", c9: "ps1", c10: "ps2", c12: "pr_s1", c14: "pr_s2", c15: "me_s1", c16: "me_s2", c18: "ma_s1", c19: "ma_s2", c20: "gt_s1", c21: "gt_s2", c22: "pd_s1", c23: "pd_s2", c25: "mc_s1", c26: "mc_s2", c28: "rc_s1", c30: "rc_s2" };
const readFor = c => READ[c.id] || ({ "Guesstimate": "g-approach", "Profitability": "c-profit", "Pricing Strategy": "c-pricing", "Market Entry": "c-entry", "M&A": "c-mna", "Go-to-Market": "c-gtm", "Product Design": "p-design", "Metric Cases": "p-metric", "RCA Cases": "p-rca" })[c.type];
const promptFor = c => c.type === "Guesstimate" ? `Estimate this for me: ${c.title.replace(/\?$/, "")}. Walk me through your approach before you calculate.` : `${c.title}. Take a minute to clarify the problem, lay out your structure, and talk me through it.`;

const C = (id, title, type, diff, mins, asked, ind, att, rt, pro = false) => ({ id, title, type, diff, mins, asked, ind, att, rt, pro });
const CASES = [
  C("c1", "How many cabs run in Mumbai every day?", "Guesstimate", "Easy", 15, ["McKinsey", "Uber"], "Mobility", 12840, 4.6),
  C("c2", "Annual smartphone sales in India", "Guesstimate", "Easy", 15, ["BCG", "Flipkart"], "Consumer tech", 9120, 4.5),
  C("c3", "Cups of chai sold daily in Delhi", "Guesstimate", "Easy", 12, ["Bain", "ITC"], "Food & beverage", 7410, 4.4),
  C("c4", "Daily food delivery orders in Bengaluru", "Guesstimate", "Medium", 20, ["Swiggy", "Google"], "Food tech", 8760, 4.7),
  C("c5", "Number of ATMs needed in a new state", "Guesstimate", "Medium", 20, ["Deloitte", "HDFC Bank"], "Banking", 3190, 4.2),
  C("c6", "Daily commuters on Mumbai local trains", "Guesstimate", "Medium", 20, ["EY", "Amazon"], "Transport", 5240, 4.5),
  C("c7", "Market size for EV charging in India by 2030", "Guesstimate", "Hard", 30, ["BCG", "Tata Power"], "Energy", 2870, 4.3, true),
  C("c8", "Revenue of a cloud kitchen in a metro", "Guesstimate", "Hard", 30, ["Bain", "Zomato"], "Food tech", 1980, 4.1, true),
  C("c9", "Declining margins at a cement manufacturer", "Profitability", "Medium", 35, ["McKinsey", "Bain"], "Manufacturing", 6310, 4.6),
  C("c10", "Regional airline losing money on short routes", "Profitability", "Hard", 40, ["BCG", "Accenture"], "Aviation", 4480, 4.5, true),
  C("c11", "D2C apparel brand: growing but unprofitable", "Profitability", "Medium", 35, ["Kearney", "Meesho"], "Retail", 3720, 4.3),
  C("c12", "Pricing a premium tier for a streaming app", "Pricing Strategy", "Medium", 30, ["Bain", "Netflix"], "Media", 4150, 4.4),
  C("c13", "Tiered pricing for an HR SaaS product", "Pricing Strategy", "Hard", 35, ["Zinnov", "Google"], "SaaS", 2260, 4.2, true),
  C("c14", "Surge pricing for a ride-hailing app", "Pricing Strategy", "Medium", 30, ["Uber", "Ola"], "Mobility", 3980, 4.5),
  C("c15", "Japanese QSR chain entering India", "Market Entry", "Medium", 40, ["McKinsey", "Deloitte"], "Restaurants", 5530, 4.5),
  C("c16", "Insurer expanding into Tier-3 cities", "Market Entry", "Hard", 40, ["BCG", "Bajaj Allianz"], "Insurance", 2640, 4.3, true),
  C("c17", "Fintech entering Indonesia", "Market Entry", "Hard", 45, ["Bain", "PhonePe"], "Fintech", 2110, 4.2, true),
  C("c18", "PE firm evaluating a diagnostics chain", "M&A", "Hard", 45, ["EY-Parthenon", "Bain"], "Healthcare", 1870, 4.4, true),
  C("c19", "Pharma merger: where are the synergies?", "M&A", "Medium", 40, ["McKinsey", "Kearney"], "Pharma", 2390, 4.3),
  C("c20", "Launching a protein snack brand", "Go-to-Market", "Medium", 35, ["Bain", "HUL"], "FMCG", 3350, 4.4),
  C("c21", "B2B SaaS go-to-market for SMB accounting", "Go-to-Market", "Hard", 40, ["BCG", "Zoho"], "SaaS", 1760, 4.1, true),
  C("c22", "Design a savings app for gig workers", "Product Design", "Medium", 45, ["Google", "PhonePe"], "Fintech", 6820, 4.7),
  C("c23", "Improve Google Maps for pedestrians", "Product Design", "Easy", 40, ["Google", "Microsoft"], "Maps", 5940, 4.5),
  C("c24", "Design a grocery app for first-time smartphone users", "Product Design", "Hard", 45, ["Amazon", "Meta"], "E-commerce", 2980, 4.3, true),
  C("c25", "Define success for Instagram Reels", "Metric Cases", "Medium", 30, ["Meta", "Google"], "Social", 7110, 4.6),
  C("c26", "Measure the health of a food-delivery app", "Metric Cases", "Easy", 25, ["Swiggy", "Amazon"], "Food tech", 4620, 4.5),
  C("c27", "Metrics for LinkedIn Jobs", "Metric Cases", "Hard", 35, ["LinkedIn", "Microsoft"], "Social", 2050, 4.2, true),
  C("c28", "Swiggy orders dropped 12% week on week", "RCA Cases", "Medium", 30, ["Swiggy", "Flipkart"], "Food tech", 6480, 4.7),
  C("c29", "WhatsApp Status views fell 8%", "RCA Cases", "Hard", 35, ["Meta", "Google"], "Social", 2790, 4.3, true),
  C("c30", "Cart conversion fell after an app update", "RCA Cases", "Easy", 25, ["Amazon", "Flipkart"], "E-commerce", 4310, 4.4),
];
const COMPANIES = [...new Set(CASES.flatMap(c => c.asked))].sort();

const REAL_QS = [
  { id: "q1", q: "Estimate the number of cabs in Mumbai.", co: "McKinsey", role: "Business Analyst", round: "Round 1", type: "Guesstimate", yr: 2026, up: 214, got: 58, cm: 31, a: "Went demand-side: riders per day, trips per rider, trips per cab. The interviewer pushed on peak versus off-peak." },
  { id: "q2", q: "A cement company’s margins fell 5 points in two years. What happened?", co: "Bain", role: "Associate Consultant", round: "Round 2", type: "Profitability", yr: 2026, up: 176, got: 41, cm: 24, a: "Split revenue and cost, found raw-material cost was the driver, then asked about fuel hedging." },
  { id: "q3", q: "How would you improve Google Maps for people who walk?", co: "Google", role: "APM", round: "Product sense", type: "Product Design", yr: 2026, up: 162, got: 37, cm: 19, a: "Picked tourists as the user group. Interviewer wanted one clear metric, so I chose completed walking routes." },
  { id: "q4", q: "Daily active users on Instagram Reels dropped 6%. What do you do?", co: "Meta", role: "Product Manager", round: "Execution", type: "RCA Cases", yr: 2025, up: 149, got: 33, cm: 27, a: "Confirmed the data first, then sliced by platform and country. A Diwali weekend was the external cause." },
  { id: "q5", q: "Should a Japanese QSR chain enter India? How would it enter?", co: "BCG", role: "Consultant", round: "Round 1", type: "Market Entry", yr: 2025, up: 131, got: 29, cm: 15, a: "Used market, capability and mode. Recommended a master-franchise partner to cut capital and speed up entry." },
  { id: "q6", q: "How many ATMs does a new state of 30 million people need?", co: "HDFC Bank", role: "Management Trainee", round: "Round 2", type: "Guesstimate", yr: 2025, up: 118, got: 26, cm: 12, a: "Bottom-up: transactions per day over capacity per ATM, then adjusted for rural spread." },
  { id: "q7", q: "Price a premium plan for a streaming service.", co: "Netflix", role: "Product Manager", round: "Strategy", type: "Pricing Strategy", yr: 2025, up: 97, got: 18, cm: 14, a: "Value-based. Segmented by household size and screens, then proposed a 4-week test in two cities." },
  { id: "q8", q: "Define success metrics for a food-delivery app.", co: "Swiggy", role: "APM", round: "Round 1", type: "Metric Cases", yr: 2026, up: 92, got: 22, cm: 9, a: "North star was weekly orders per active user, with delivery time and cancellations as guardrails." },
];
const STORIES = [
  { id: "s1", name: "Riya S.", from: "Mechanical engineer, 2 years at an auto maker", to: "Associate at a top-3 strategy firm", college: "Tier-2 MBA", weeks: 10, cases: 46, quote: "I had never seen a case before my MBA. What changed it was doing one guesstimate a day and reading how others structured the same question.", tips: ["Did one guesstimate every morning for six weeks", "Practised aloud with the AI interviewer, then with a peer", "Kept a one-page list of numbers to remember"] },
  { id: "s2", name: "Aman K.", from: "Software developer, 3 years at a services firm", to: "APM at a consumer-tech company", college: "Tier-1 MBA", weeks: 8, cases: 38, quote: "Engineers over-build solutions. Product design cases taught me to spend the first ten minutes on the user.", tips: ["Wrote a user-first outline before every design case", "Used metric cases to learn how PMs talk about goals", "Read each community answer to see what interviewers pushed on"] },
  { id: "s3", name: "Neha P.", from: "Chartered accountant, 4 years in audit", to: "Consultant at a Big-4 advisory arm", college: "Tier-2 MBA", weeks: 12, cases: 52, quote: "Numbers were never my problem. Structure was. Reading the profitability write-up three times fixed that.", tips: ["Rebuilt the revenue-cost tree from memory daily", "Booked weekly mock interviews with peers", "Reviewed real interview questions for her target firms"] },
  { id: "s4", name: "Siddharth R.", from: "Sales manager, 5 years in FMCG", to: "Product Manager at a fintech", college: "Tier-1 MBA", weeks: 14, cases: 61, quote: "I knew customers but not frameworks. RCA cases gave me a routine I could trust under pressure.", tips: ["Practised RCA cases until the slicing order was automatic", "Turned every case into a one-pager for revision", "Shared his notes with two batchmates"] },
];
const PEERS = [
  { id: "pc1", title: "Why did metro ridership dip during the monsoon?", type: "RCA Cases", diff: "Medium", by: "Karan M.", college: "IIM Indore", up: 128, uses: 342, ver: true },
  { id: "pc2", title: "Should a local gym chain launch a mobile app?", type: "Go-to-Market", diff: "Easy", by: "Isha T.", college: "FMS Delhi", up: 96, uses: 281, ver: true },
  { id: "pc3", title: "Estimate the daily revenue of a Mumbai vada pav stall", type: "Guesstimate", diff: "Easy", by: "Rohan D.", college: "SPJIMR", up: 88, uses: 410, ver: true },
  { id: "pc4", title: "Design a feature to reduce no-shows at clinics", type: "Product Design", diff: "Medium", by: "Meera V.", college: "XLRI", up: 71, uses: 164, ver: false },
  { id: "pc5", title: "A bank’s credit-card spend is flat. Where is the leak?", type: "Profitability", diff: "Hard", by: "Dev A.", college: "MDI Gurgaon", up: 54, uses: 119, ver: false },
];

const INIT_STAT = { c1: "done", c2: "done", c12: "done", c22: "done", c3: "prog", c9: "prog", c28: "prog" };
const SCRIPT = [
  "Good start. Before going deeper: what clarifying questions would you ask, and how will you structure your answer?",
  "I like that structure. Which single assumption matters most to your final answer, and how would you pressure-test it?",
  "Let’s put numbers on it. Walk me through the calculation one step at a time.",
  "Nice. Last check: compare your answer with something you already know. When you’re ready, end the session for feedback.",
];
const FEEDBACK = { score: 74, parts: [["Structuring", 78], ["Quantitative accuracy", 70], ["Insight and hypotheses", 64], ["Communication", 82]], good: ["Clear MECE split before calculating", "Round numbers that were easy to follow"], fix: ["State your sanity check earlier, before the interviewer asks", "Name the assumption with the biggest impact and test it"] };

/* ───────────────────────── STYLES ───────────────────────── */
const CSS = `
.pl{--pine:#0B2B26;--pine2:#123F38;--pine3:#1D5C52;--saf:#FFB020;--saf2:#FFF0CC;--bg:#F3F5F2;--ink:#14201C;--mut:#5E6D67;--line:#DCE3DF;--mint:#DFF3E9;--ok:#1E8E5A;--warn:#A86B0A;--hard:#C0410C;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg);height:100vh;display:flex;flex-direction:column;font-size:14px;line-height:1.45;position:relative;overflow:hidden}
.pl *{box-sizing:border-box}
:where(.pl) button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
:where(.pl) h1,:where(.pl) h2,:where(.pl) h3,:where(.pl) h4,:where(.pl) p{margin:0}
:where(.pl) input,:where(.pl) select,:where(.pl) textarea{font:inherit;color:inherit}
.pl :focus-visible{outline:2px solid var(--saf);outline-offset:2px}
.pl .scroll{flex:1;overflow-y:auto;min-height:0}
.logo{display:flex;align-items:center;gap:9px;font-weight:800;font-size:19px;letter-spacing:-.02em;color:var(--pine)}
.logo.light{color:#fff}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 16px;border-radius:10px;border:1px solid var(--line);background:#fff;font-weight:600;color:var(--ink);white-space:nowrap}
.btn:hover{border-color:#B3C2BB}
.btn.pri{background:var(--pine);border-color:var(--pine);color:#fff}.btn.pri:hover{background:var(--pine2)}
.btn.saf{background:var(--saf);border-color:var(--saf);color:var(--pine)}.btn.saf:hover{filter:brightness(.96)}
.btn.lg{padding:13px 22px;font-size:15px;border-radius:12px}.btn.sm{padding:6px 11px;font-size:13px;border-radius:8px}
.btn.ghost{border-color:transparent;background:transparent}.btn.full{width:100%}
.ic{display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:8px;color:var(--mut)}.ic:hover{background:#EAEFEC;color:var(--ink)}
.chip{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:500;padding:3px 10px;border-radius:999px;background:#EDF1EE;color:#3A4A43}
.chip .dot,.dot{width:8px;height:8px;border-radius:50%;display:inline-block}
.chip.pro{background:var(--saf2);color:#7A5200}
.d-Easy{background:#DDF3E8;color:#17724A}.d-Medium{background:#FFF0CC;color:#8A5A00}.d-Hard{background:#FBE0D2;color:#A2360A}
.tag{font-size:12px;padding:2px 8px;border-radius:6px;border:1px solid var(--line);color:var(--mut);background:#fff}
.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px}
.muted{color:var(--mut)}
/* public */
.pub-top{height:62px;display:flex;align-items:center;gap:24px;padding:0 28px;background:#fff;border-bottom:1px solid var(--line);flex:none}
.pub-nav{display:flex;gap:2px;flex:1;overflow-x:auto}
.pub-nav button{padding:8px 14px;border-radius:8px;font-weight:500;color:var(--mut)}
.pub-nav button:hover{background:#EEF2EF;color:var(--ink)}.pub-nav button.on{color:var(--pine);background:var(--mint);font-weight:600}
.wrap{max-width:1180px;margin:0 auto;padding:0 28px}
.hero{display:grid;grid-template-columns:1.05fr 1fr;gap:56px;align-items:center;padding:64px 0 56px}
.hero h1{font-size:50px;line-height:1.05;letter-spacing:-.035em;font-weight:800;color:var(--pine)}
.hero p.lead{font-size:18px;color:var(--mut);margin:18px 0 28px;max-width:520px;line-height:1.55}
.hero .cta{display:flex;gap:12px;flex-wrap:wrap}
.est{background:var(--pine);color:#E6F1EC;border-radius:20px;padding:26px;box-shadow:0 24px 50px -24px rgba(11,43,38,.55)}
.est h3{font-size:16px;font-weight:600;color:#fff;margin-bottom:4px}
.est .sub{color:#9DB8AE;font-size:13px;margin-bottom:18px}
.node{border:1px solid rgba(255,255,255,.18);border-radius:12px;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;background:rgba(255,255,255,.05)}
.node b{font-size:18px;color:var(--saf)}
.node.final{background:var(--saf);border-color:var(--saf);color:var(--pine)}.node.final b{color:var(--pine);font-size:24px}
.link{width:2px;height:12px;background:rgba(255,255,255,.25);margin:0 0 0 22px}
.sl{margin-top:18px;display:grid;gap:10px}
.sl label{display:flex;justify-content:space-between;font-size:13px;color:#BCD3CA}
.sl input{width:100%;accent-color:var(--saf)}
.sanity{margin-top:16px;font-size:13px;color:#9DB8AE}
.feat{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:12px 0 56px}
.feat .card h3{font-size:18px;margin:10px 0 8px;letter-spacing:-.01em}.feat ul{margin:12px 0 0;padding-left:18px;color:var(--mut)}
.ficon{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:var(--mint);color:var(--pine)}
.sec-h{display:flex;align-items:end;justify-content:space-between;margin:8px 0 18px}.sec-h h2{font-size:26px;letter-spacing:-.02em}
.band{background:var(--pine);color:#fff;border-radius:22px;padding:40px;display:flex;align-items:center;justify-content:space-between;gap:24px;margin:48px 0}
.band h2{font-size:28px;letter-spacing:-.02em;max-width:520px}
.foot{padding:28px 0 40px;color:var(--mut);font-size:13px;border-top:1px solid var(--line);display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px}
.pgh{padding:40px 0 16px}.pgh h1{font-size:34px;letter-spacing:-.025em;color:var(--pine)}.pgh p{color:var(--mut);margin-top:8px;max-width:620px;font-size:16px}
.gate{background:var(--saf2);border:1px solid #F3D78C;color:#6B4700;border-radius:12px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;margin:8px 0 20px}
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:28px 0}
.plan{display:flex;flex-direction:column;gap:14px}.plan.hot{border:2px solid var(--pine);position:relative}
.plan .price{font-size:36px;font-weight:800;letter-spacing:-.03em}.plan ul{list-style:none;padding:0;margin:0;display:grid;gap:9px}
.plan li{display:flex;gap:8px;align-items:flex-start}.plan li svg{color:var(--ok);margin-top:3px;flex:none}
.seg{display:inline-flex;background:#E6ECE8;border-radius:10px;padding:3px}.seg button{padding:6px 14px;border-radius:8px;font-weight:600;color:var(--mut)}.seg button.on{background:#fff;color:var(--ink);box-shadow:0 1px 2px rgba(0,0,0,.08)}
/* app shell */
.top{height:56px;background:#fff;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:16px;padding:0 18px;flex:none}
.top .search{flex:1;max-width:420px;position:relative;margin-left:12px}
.top .search input{width:100%;padding:8px 12px 8px 34px;border-radius:10px;border:1px solid var(--line);background:#F6F8F6}
.top .search svg{position:absolute;left:11px;top:9px;color:var(--mut)}
.top .sp{flex:1}
.streak{display:flex;align-items:center;gap:6px;font-weight:700;color:#B45309;background:var(--saf2);padding:5px 11px;border-radius:999px}
.avatar{width:34px;height:34px;border-radius:50%;background:var(--pine);color:#fff;display:grid;place-items:center;font-weight:700}
.menu{position:absolute;right:18px;top:52px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:6px;min-width:190px;box-shadow:0 12px 30px rgba(0,0,0,.12);z-index:40}
.menu button{display:flex;gap:8px;align-items:center;width:100%;padding:9px 10px;border-radius:8px}.menu button:hover{background:#F0F4F1}
.body{flex:1;display:flex;min-height:0}
.left{width:276px;background:var(--pine);color:#CFE0D9;flex:none;overflow-y:auto;padding:14px 12px 20px;display:flex;flex-direction:column;gap:2px}
.ni{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:9px;color:#CFE0D9;width:100%;text-align:left}
.ni:hover{background:rgba(255,255,255,.07)}
.ni.on{background:rgba(255,176,32,.14);color:#fff;box-shadow:inset 3px 0 0 var(--saf)}
.ni .grow{flex:1}.ni.sub{padding:7px 12px 7px 14px;font-size:13.5px;color:#B5CBC2;align-items:flex-start}
.ni.sub span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ni .chev{padding:4px;border-radius:6px;display:grid;place-items:center}.ni .chev:hover{background:rgba(255,255,255,.12)}
.lhead{font-weight:700;color:#fff;font-size:16px;padding:6px 12px 10px;letter-spacing:-.01em}
.lsub{font-size:12.5px;color:#82A196;padding:12px 12px 4px;font-weight:600}
.indent{margin-left:14px;padding-left:6px;border-left:1px solid rgba(255,255,255,.14);display:grid;gap:1px}
.back{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:9px;color:#9DB8AE;font-weight:500}.back:hover{background:rgba(255,255,255,.07);color:#fff}
.lcard{margin-top:auto;background:var(--pine2);border-radius:14px;padding:14px;color:#D6E6DF}
.lcard b{color:#fff;display:block;margin-bottom:4px}
.mid{flex:1;overflow-y:auto;min-width:0;background:var(--bg);position:relative}
.pad{padding:28px 36px 56px;max-width:1080px;margin:0 auto}
.right{width:310px;flex:none;overflow-y:auto;border-left:1px solid var(--line);background:#fff;padding:20px;display:flex;flex-direction:column;gap:18px}
.h1{font-size:28px;letter-spacing:-.025em;font-weight:800;color:var(--pine)}.h2{font-size:18px;font-weight:700;letter-spacing:-.01em}
.crumb{display:flex;align-items:center;gap:6px;color:var(--mut);font-size:13px;margin-bottom:14px;flex-wrap:wrap}.crumb button:hover{color:var(--ink)}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}.grid2.asym{grid-template-columns:1.4fr 1fr}.grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
/* article */
.art{font-family:Georgia,"Times New Roman",serif;font-size:17.5px;line-height:1.78;max-width:690px;color:#1E2B26}
.art h2{font-family:-apple-system,"Segoe UI",Roboto,sans-serif;font-size:23px;letter-spacing:-.02em;margin:40px 0 12px;color:var(--pine);scroll-margin-top:16px}
.art p{margin:0 0 14px}.art ul,.art ol{padding-left:22px;margin:0 0 16px}.art li{margin-bottom:6px}
.art .co{background:var(--saf2);border-left:4px solid var(--saf);padding:14px 18px;border-radius:0 12px 12px 0;margin:18px 0;font-family:-apple-system,"Segoe UI",Roboto,sans-serif;font-size:15.5px;line-height:1.6;font-weight:500}
.art table{width:100%;border-collapse:collapse;font-family:-apple-system,"Segoe UI",Roboto,sans-serif;font-size:14.5px;margin:16px 0 22px;background:#fff;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
.art th{background:#EAF1ED;text-align:left;padding:10px 14px;font-weight:700}.art td{padding:10px 14px;border-top:1px solid var(--line);vertical-align:top}
.title{font-size:36px;line-height:1.12;letter-spacing:-.03em;font-weight:800;color:var(--pine);margin:6px 0 14px;max-width:720px}
.meta{display:flex;gap:14px;align-items:center;color:var(--mut);margin-bottom:26px;flex-wrap:wrap}.meta span{display:inline-flex;gap:5px;align-items:center}
.one{background:var(--pine);color:#E6F1EC;border-radius:16px;padding:18px}
.one h4{color:#fff;font-size:15px;margin-bottom:10px}.one ol{margin:0 0 14px;padding-left:20px;display:grid;gap:7px;font-size:13.5px}
.toc{display:grid;gap:2px}.toc button{text-align:left;padding:7px 12px;border-left:2px solid var(--line);color:var(--mut);font-size:13.5px}
.toc button:hover{color:var(--ink)}.toc button.on{border-left-color:var(--saf);color:var(--ink);font-weight:600;background:#FFF9EA}
.nextcard{display:flex;justify-content:space-between;align-items:center;gap:16px;margin-top:36px;max-width:690px}
/* library */
.fbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:16px 0 10px}
.fbar .sbox{position:relative;flex:1;min-width:220px}.fbar .sbox input{width:100%;padding:9px 12px 9px 34px;border-radius:10px;border:1px solid var(--line);background:#fff}.fbar .sbox svg{position:absolute;left:11px;top:10px;color:var(--mut)}
.sel{padding:8px 10px;border-radius:10px;border:1px solid var(--line);background:#fff}
.fchips{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
.fc{display:inline-flex;gap:7px;align-items:center;padding:6px 12px;border-radius:999px;border:1px solid var(--line);background:#fff;font-weight:500}
.fc:hover{border-color:#9DB3AA}.fc.on{background:var(--pine);color:#fff;border-color:var(--pine)}.fc small{opacity:.65}
.cgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;margin-top:14px}
.cgrid.list{grid-template-columns:1fr;gap:10px}
.cc{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;display:flex;flex-direction:column;gap:12px;cursor:pointer;text-align:left}
.cc:hover{border-color:var(--pine3);box-shadow:0 8px 24px -14px rgba(11,43,38,.4)}
.cc-top{display:flex;gap:8px;align-items:center}.cc-top .ic{margin-left:auto;width:28px;height:28px}
.cc h3{font-size:16px;line-height:1.35;letter-spacing:-.01em;font-weight:650}
.cc-meta{display:flex;gap:14px;align-items:center;color:var(--mut);font-size:13px;flex-wrap:wrap}.cc-meta span{display:inline-flex;gap:5px;align-items:center}.cc-meta .chip{padding:2px 9px}
.cc-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:auto}.tags{display:flex;gap:6px;flex-wrap:wrap}
.st{display:inline-flex;gap:5px;align-items:center;font-size:12.5px;color:var(--mut);white-space:nowrap}.st.done{color:var(--ok);font-weight:600}.st.prog{color:var(--warn);font-weight:600}
.cc.list{flex-direction:row;align-items:center;gap:18px;padding:12px 16px}.cc.list h3{flex:1}.cc.list .cc-top{order:3}.cc.list .cc-foot{margin:0;min-width:210px;justify-content:flex-end}
.empty{text-align:center;padding:48px 20px;color:var(--mut)}
.bookm svg{color:var(--saf)}
/* dashboard & misc */
.ring{position:relative;width:84px;height:84px}.ring b{position:absolute;inset:0;display:grid;place-items:center;font-size:18px}
.bar{height:8px;border-radius:99px;background:#E4EBE7;overflow:hidden}.bar i{display:block;height:100%;background:var(--pine3);border-radius:99px}
.wk{display:flex;gap:10px;align-items:flex-end;height:90px}.wk div{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;justify-content:flex-end;height:100%;color:var(--mut);font-size:12px}.wk i{width:100%;background:var(--pine3);border-radius:6px 6px 2px 2px;display:block}
.rowi{display:flex;gap:12px;align-items:center;padding:12px 0;border-top:1px solid var(--line);cursor:pointer;text-align:left;width:100%}.rowi:first-child{border-top:0}
.rowi .num{width:30px;height:30px;border-radius:50%;background:var(--mint);color:var(--pine);display:grid;place-items:center;font-weight:700;flex:none}
.tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);margin:14px 0 18px;overflow-x:auto}
.tabs button{padding:10px 14px;font-weight:600;color:var(--mut);border-bottom:2px solid transparent;white-space:nowrap}.tabs button.on{color:var(--pine);border-bottom-color:var(--saf)}
.qi{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin-bottom:12px}
.qi h3{font-size:16.5px;margin:10px 0 12px;line-height:1.4}.qa{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.ans{margin-top:12px;background:#F4F8F5;border-radius:10px;padding:12px 14px;color:#33463E}
.story .pair{display:grid;grid-template-columns:70px 1fr;gap:4px 10px;margin:12px 0}.story .pair dt{color:var(--mut)}.story .pair dd{margin:0;font-weight:500}
.story blockquote{margin:12px 0;padding-left:14px;border-left:3px solid var(--saf);color:#2E4038;line-height:1.6}
.scorebar{display:grid;grid-template-columns:170px 1fr 40px;gap:12px;align-items:center;margin:10px 0}
.toast{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);background:var(--pine);color:#fff;padding:10px 18px;border-radius:10px;z-index:90;box-shadow:0 10px 30px rgba(0,0,0,.25)}
.modal-bg{position:absolute;inset:0;background:rgba(11,43,38,.55);display:grid;place-items:center;z-index:80;padding:16px}
.modal{background:#fff;border-radius:18px;padding:28px;width:100%;max-width:410px;position:relative;display:grid;gap:12px}
.modal input{padding:11px 12px;border:1px solid var(--line);border-radius:10px;width:100%}
.modal .x{position:absolute;right:12px;top:12px}
.sess{position:absolute;inset:0;background:var(--bg);z-index:70;display:flex;flex-direction:column}
.sess-top{display:flex;align-items:center;gap:14px;padding:12px 20px;background:#fff;border-bottom:1px solid var(--line)}
.sess-body{flex:1;display:flex;min-height:0}.chat{flex:1;display:flex;flex-direction:column;min-width:0}
.msgs{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:14px}
.m{max-width:620px;padding:12px 16px;border-radius:14px;line-height:1.55}.m.ai{background:#fff;border:1px solid var(--line);align-self:flex-start}.m.me{background:var(--pine);color:#fff;align-self:flex-end}
.composer{display:flex;gap:10px;padding:14px 20px;background:#fff;border-top:1px solid var(--line)}.composer input{flex:1;padding:11px 14px;border:1px solid var(--line);border-radius:10px}
.pad-side{width:320px;border-left:1px solid var(--line);background:#fff;padding:18px;display:flex;flex-direction:column;gap:10px}.pad-side textarea{flex:1;border:1px solid var(--line);border-radius:10px;padding:12px;resize:none}
.dd{position:relative}.dd-btn{display:inline-flex;gap:8px;align-items:center;padding:8px 12px;border-radius:10px;border:1px solid var(--line);background:#fff;font-weight:500}
.dd-btn:hover{border-color:#9DB3AA}.dd-btn.on{border-color:var(--pine3);background:#F0F7F3}
.dd-btn .n{background:var(--pine);color:#fff;border-radius:999px;min-width:18px;height:18px;font-size:11px;display:grid;place-items:center;padding:0 5px}
.dd-pop{position:absolute;top:calc(100% + 6px);left:0;z-index:30;min-width:210px;max-height:300px;overflow:auto;background:#fff;border:1px solid var(--line);border-radius:12px;padding:6px;box-shadow:0 14px 34px rgba(0,0,0,.14)}
.dd-o{display:flex;gap:10px;align-items:center;width:100%;padding:8px 10px;border-radius:8px;text-align:left}.dd-o:hover{background:#F0F4F1}
.dd-o .bx{width:16px;height:16px;border-radius:5px;border:1.5px solid #9DB3AA;display:grid;place-items:center;flex:none;color:#fff}
.dd-o.on .bx{background:var(--pine);border-color:var(--pine)}.dd-o .bx.r{border-radius:50%}
.ni.row{padding:8px 10px 8px 14px;color:#DCEAE4;font-size:14px}.ni.row:hover{background:rgba(255,255,255,.07)}.ni .chv{color:#8FB0A4}
.kh{display:flex;align-items:center;gap:9px;width:100%;padding:9px 10px;border-radius:9px;color:#fff;font-weight:600;text-align:left;margin-top:4px}.kh:hover{background:rgba(255,255,255,.07)}
.kh small{margin-left:auto;color:#8FB0A4;font-weight:500}.kh svg:last-child{color:#8FB0A4}
.dl{display:grid;grid-template-columns:150px 1fr;gap:10px 16px;margin:0}.dl dd{margin:0;font-weight:500}
.fi{display:grid;gap:5px;align-content:start}.fi label{font-size:12.5px;color:var(--mut);font-weight:600}
.fi input,.fi select{padding:9px 11px;border:1px solid var(--line);border-radius:10px;background:#fff;width:100%}
.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.entry{border:1px solid var(--line);border-radius:12px;padding:14px;margin-top:12px}
.grid3.s{grid-template-columns:repeat(3,1fr)}
.menu-btn{display:none}
@media (max-width:1180px){.right{display:none}}
@media (max-width:960px){
.hero,.feat,.plans,.grid2,.grid2.asym,.grid3,.grid4,.fgrid{grid-template-columns:1fr}.dl{grid-template-columns:1fr}.hero h1{font-size:38px}.band{flex-direction:column;align-items:flex-start}
.left{position:absolute;z-index:50;top:56px;bottom:0;left:0;transform:translateX(-100%);transition:transform .2s}.left.open{transform:none}
.menu-btn{display:grid}.top .search,.streak{display:none}.pad{padding:20px 16px 48px}.title{font-size:28px}.pad-side{display:none}
.cc.list{flex-direction:column;align-items:flex-start}.cc.list .cc-foot{min-width:0}.scorebar{grid-template-columns:1fr 1fr 36px}
}
@media (prefers-reduced-motion:reduce){.left{transition:none}}
`;

/* ───────────────────────── CONTEXT ───────────────────────── */
const Ctx = createContext(null);
const useC = () => useContext(Ctx);

/* ───────────────────────── SMALL PIECES ───────────────────────── */
const Logo = ({ light }) => (
  <div className={"logo" + (light ? " light" : "")}>
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill={light ? "#FFB020" : "#0B2B26"} />
      <path d="M9 21V7h6.2a4.2 4.2 0 010 8.4H9" fill="none" stroke={light ? "#0B2B26" : "#fff"} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="20.5" cy="20.5" r="2" fill={light ? "#0B2B26" : "#FFB020"} /></svg>
    <span>PrepLeet</span>
  </div>
);
const NI = ({ icon: I, label, on, onClick, sub, right }) => (
  <button className={"ni" + (on ? " on" : "") + (sub ? " sub" : "")} onClick={onClick}>
    {I && <I size={18} />}<span className="grow" style={{ flex: 1 }}>{label}</span>{right}
  </button>
);
const Blocks = ({ blocks }) => blocks.map((b, i) => {
  if (b.t === "p") return <p key={i}>{b.x}</p>;
  if (b.t === "ul") return <ul key={i}>{b.x.map((x, j) => <li key={j}>{x}</li>)}</ul>;
  if (b.t === "ol") return <ol key={i}>{b.x.map((x, j) => <li key={j}>{x}</li>)}</ol>;
  if (b.t === "co") return <div key={i} className="co">{b.x}</div>;
  return <table key={i}><thead><tr>{b.head.map((h, j) => <th key={j}>{h}</th>)}</tr></thead><tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{c}</td>)}</tr>)}</tbody></table>;
});

/* ───────────────────────── LIBRARY ───────────────────────── */
function CaseCard({ c, list, onOpen }) {
  const { stat, marks, toggleMark, authed } = useC();
  const s = stat[c.id];
  return (
    <div className={"cc" + (list ? " list" : "")} role="button" tabIndex={0} onClick={() => onOpen(c)} onKeyDown={e => e.key === "Enter" && onOpen(c)}>
      <div className="cc-top">
        <span className="chip"><i className="dot" style={{ background: TC[c.type] }} />{c.type}</span>
        {c.pro && <span className="chip pro"><Lock size={11} />Pro</span>}
        <button className={"ic" + (marks[c.id] ? " bookm" : "")} aria-label="Save case" onClick={e => { e.stopPropagation(); toggleMark(c.id); }}>
          <Bookmark size={16} fill={marks[c.id] ? "currentColor" : "none"} /></button>
      </div>
      <h3>{c.title}</h3>
      <div className="cc-meta">
        <span className={"chip d-" + c.diff}>{c.diff}</span>
        <span><Clock size={13} />{c.mins} min</span>
        <span><Star size={13} fill="currentColor" />{c.rt}</span>
        <span><Users size={13} />{c.att.toLocaleString("en-IN")}</span>
      </div>
      <div className="cc-foot">
        <div className="tags">{c.asked.map(a => <span key={a} className="tag">{a}</span>)}</div>
        {authed && <span className={"st " + (s || "new")}>{s === "done" ? <><CheckCircle2 size={14} />Completed</> : s === "prog" ? <><Circle size={14} />In progress</> : "Not started"}</span>}
      </div>
    </div>
  );
}

function Dd({ label, options, value, onChange, multi = true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const n = multi ? value.length : 0;
  const pick = o => multi ? onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]) : (onChange(o), setOpen(false));
  return (
    <div className="dd" ref={ref} onKeyDown={e => e.key === "Escape" && setOpen(false)}>
      <button className={"dd-btn" + (n ? " on" : "")} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen(!open)}>
        {multi ? label : <>{label}: <b>{value}</b></>}{n > 0 && <span className="n">{n}</span>}<ChevronDown size={15} />
      </button>
      {open && <div className="dd-pop" role="listbox" aria-label={label}>
        {options.map(o => { const on = multi ? value.includes(o) : value === o; return (
          <button key={o} role="option" aria-selected={on} className={"dd-o" + (on ? " on" : "")} onClick={() => pick(o)}>
            <span className={"bx" + (multi ? "" : " r")}>{on && <Check size={11} />}</span>{o}
          </button>); })}
        {multi && n > 0 && <button className="dd-o" style={{ color: "var(--mut)", borderTop: "1px solid var(--line)", borderRadius: 0, marginTop: 4 }} onClick={() => onChange([])}>Clear {label.toLowerCase()}</button>}
      </div>}
    </div>
  );
}

const SORTS = ["Most practised", "Highest rated", "Easiest first", "Hardest first", "Shortest first"];
const DURS = ["Up to 20 min", "21–35 min", "36+ min"];
const typeShown = (t, track) => track === "All" || trackOf({ type: t }) === "Both" || trackOf({ type: t }) === track;

function LibraryView({ preset = {}, onOpen, title = "Case library", sub }) {
  const { stat, marks, authed } = useC();
  const t0 = preset.track || "All";
  const [q, setQ] = useState(preset.q || "");
  const [track, setTrack] = useState(t0);
  const [types, setTypes] = useState((preset.type || []).filter(t => typeShown(t, t0)));
  const [diffs, setDiffs] = useState([]);
  const [durs, setDurs] = useState([]);
  const [cos, setCos] = useState([]);
  const [sts, setSts] = useState([]);
  const [acc, setAcc] = useState([]);
  const [sort, setSort] = useState("Most practised");
  const [vm, setVm] = useState("grid");
  const shown = TYPES.filter(t => typeShown(t, track));
  const chooseTrack = t => { setTrack(t); setTypes(ts => ts.filter(x => typeShown(x, t))); };
  const togType = v => setTypes(types.includes(v) ? types.filter(x => x !== v) : [...types, v]);
  const dur = c => c.mins <= 20 ? DURS[0] : c.mins <= 35 ? DURS[1] : DURS[2];
  const list = useMemo(() => {
    const r = CASES.filter(c => {
      if (q && !(c.title + c.type + c.ind + c.asked.join(" ")).toLowerCase().includes(q.toLowerCase())) return false;
      if (!typeShown(c.type, track)) return false;
      if (types.length && !types.includes(c.type)) return false;
      if (diffs.length && !diffs.includes(c.diff)) return false;
      if (durs.length && !durs.includes(dur(c))) return false;
      if (cos.length && !c.asked.some(a => cos.includes(a))) return false;
      if (acc.length === 1 && (acc[0] === "Pro") !== c.pro) return false;
      if (sts.length) { const s = stat[c.id]; if (!sts.some(x => x === "Not started" ? !s : x === "In progress" ? s === "prog" : x === "Completed" ? s === "done" : !!marks[c.id])) return false; }
      return true;
    });
    const dv = { Easy: 1, Medium: 2, Hard: 3 };
    const f = { "Most practised": (a, b) => b.att - a.att, "Highest rated": (a, b) => b.rt - a.rt, "Easiest first": (a, b) => dv[a.diff] - dv[b.diff], "Hardest first": (a, b) => dv[b.diff] - dv[a.diff], "Shortest first": (a, b) => a.mins - b.mins }[sort];
    return r.sort(f);
  }, [q, track, types, diffs, durs, cos, sts, acc, sort, stat, marks]);
  const active = q || track !== "All" || types.length || diffs.length || durs.length || cos.length || sts.length || acc.length;
  const clear = () => { setQ(""); setTrack("All"); setTypes([]); setDiffs([]); setDurs([]); setCos([]); setSts([]); setAcc([]); };
  const tcount = t => CASES.filter(c => c.type === t).length;
  const total = CASES.filter(c => typeShown(c.type, track)).length;
  return (
    <div>
      <h1 className="h1">{title}</h1>
      {sub && <p className="muted" style={{ marginTop: 6 }}>{sub}</p>}
      <div className="fbar">
        <div className="sbox"><Search size={16} /><input aria-label="Search cases" placeholder="Search by title, company or industry" value={q} onChange={e => setQ(e.target.value)} /></div>
        <div className="seg" role="group" aria-label="Track">{[["All", "All"], ["Consulting", "Consulting"], ["Product", "Product Management"]].map(([v, l]) => <button key={v} className={track === v ? "on" : ""} onClick={() => chooseTrack(v)}>{l}</button>)}</div>
        <Dd label="Sort" multi={false} options={SORTS} value={sort} onChange={setSort} />
        <div className="seg" role="group" aria-label="View"><button className={vm === "grid" ? "on" : ""} aria-label="Grid view" onClick={() => setVm("grid")}><LayoutGrid size={16} /></button><button className={vm === "list" ? "on" : ""} aria-label="List view" onClick={() => setVm("list")}><List size={16} /></button></div>
      </div>
      <div className="fchips" role="group" aria-label="Case type">
        <button className={"fc" + (!types.length ? " on" : "")} onClick={() => setTypes([])}>All types<small>{total}</small></button>
        {shown.map(t => <button key={t} className={"fc" + (types.includes(t) ? " on" : "")} onClick={() => togType(t)}><i className="dot" style={{ background: TC[t] }} />{t}<small>{tcount(t)}</small></button>)}
      </div>
      <div className="fbar" style={{ marginTop: 4 }}>
        <SlidersHorizontal size={16} className="muted" />
        <Dd label="Difficulty" options={["Easy", "Medium", "Hard"]} value={diffs} onChange={setDiffs} />
        <Dd label="Duration" options={DURS} value={durs} onChange={setDurs} />
        <Dd label="Asked at" options={COMPANIES} value={cos} onChange={setCos} />
        {authed && <Dd label="Status" options={["Not started", "In progress", "Completed", "Saved"]} value={sts} onChange={setSts} />}
        <Dd label="Access" options={["Free", "Pro"]} value={acc} onChange={setAcc} />
        {active ? <button className="btn sm ghost" onClick={clear}>Clear all</button> : null}
        <span className="muted" style={{ marginLeft: "auto" }}>{list.length} of {total} cases</span>
      </div>
      {list.length ? <div className={"cgrid" + (vm === "list" ? " list" : "")}>{list.map(c => <CaseCard key={c.id} c={c} list={vm === "list"} onOpen={onOpen} />)}</div>
        : <div className="empty"><h3 className="h2">No cases match these filters</h3><p style={{ margin: "6px 0 16px" }}>Remove a filter or search by company name.</p><button className="btn" onClick={clear}>Clear all</button></div>}
    </div>
  );
}

function CaseDetail({ c, onBack, onRead }) {
  const { stat, marks, toggleMark, startSession } = useC();
  const art = getArt(readFor(c));
  const s = stat[c.id];
  return (
    <div>
      <div className="crumb"><button onClick={onBack} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><ArrowLeft size={14} />Back</button></div>
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          <span className="chip"><i className="dot" style={{ background: TC[c.type] }} />{c.type}</span>
          <span className={"chip d-" + c.diff}>{c.diff}</span>
          {c.pro && <span className="chip pro"><Lock size={11} />Pro</span>}
          <span className="chip"><Clock size={12} />{c.mins} min</span><span className="chip">{c.ind}</span>
        </div>
        <h1 className="title" style={{ fontSize: 30 }}>{c.title}</h1>
        <div className="meta"><span><Star size={14} fill="currentColor" color="#E59B0B" />{c.rt} average rating</span><span><Users size={14} />{c.att.toLocaleString("en-IN")} people practised</span><span>Asked at {c.asked.join(" and ")}</span></div>
        <div style={{ background: "#F4F8F5", borderRadius: 12, padding: "16px 18px", marginBottom: 20, lineHeight: 1.6 }}><b>The prompt</b><p style={{ marginTop: 6 }}>{promptFor(c)}</p></div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn pri lg" onClick={() => startSession(c)}><Sparkles size={18} />{s === "prog" ? "Resume with AI interviewer" : "Practice with AI interviewer"}</button>
          <button className="btn lg" onClick={() => toggleMark(c.id)}><Bookmark size={18} fill={marks[c.id] ? "currentColor" : "none"} />{marks[c.id] ? "Saved" : "Save for later"}</button>
        </div>
      </div>
      <div className="grid2" style={{ marginTop: 16 }}>
        <div className="card"><h3 className="h2" style={{ marginBottom: 10 }}>Skills you’ll practise</h3><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{SKILLS[c.type].map(k => <span key={k} className="chip">{k}</span>)}</div>
          <h3 className="h2" style={{ margin: "20px 0 10px" }}>Before you start</h3><p className="muted">Give yourself {c.mins} minutes. Say your structure out loud before calculating.</p></div>
        <div className="card"><h3 className="h2" style={{ marginBottom: 10 }}>Recommended read</h3>
          {art && <button className="rowi" style={{ borderTop: 0 }} onClick={() => onRead(art)}><span className="num"><BookOpen size={15} /></span><span style={{ flex: 1 }}><b>{art.title}</b><br /><span className="muted">{art.mins} min read</span></span><ChevronRight size={16} /></button>}
          <h3 className="h2" style={{ margin: "14px 0 6px" }}>Where candidates slip</h3><p className="muted">Skipping the clarifying questions and running out of time before the sanity check.</p></div>
      </div>
    </div>
  );
}

/* ───────────────────────── HUBS ───────────────────────── */
function Hub({ hub, onType, onLib }) {
  const cnt = ty => ARTICLES.filter(a => a.type === ty).length;
  const Track = ({ t }) => (
    <div className="card">
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span className="ficon">{t === "consulting" ? <Briefcase size={20} /> : <Target size={20} />}</span><h2 className="h2">{TRACK_NAME[t]}</h2></div>
      <div style={{ margin: "12px 0" }}>{TRACK_TYPES[t].map(ty => (
        <button key={ty} className="rowi" onClick={() => onType(ty, t)}>
          <span style={{ flex: 1 }}><b>{TYPE_LABEL[ty]}</b><br /><span className="muted">{cnt(ty)} guides in 4 sections</span></span><ChevronRight size={16} />
        </button>))}</div>
      <button className="btn" onClick={() => onLib(t)}>Practice {t === "consulting" ? "consulting" : "product management"}</button>
    </div>
  );
  if (hub === "learn") return (
    <div className="pad">
      <h1 className="h1">Learn</h1>
      <p className="muted" style={{ margin: "6px 0 22px", fontSize: 15 }}>Pick a track, then a case type. Each case type has a 5-minute revision sheet, core concepts, solved cases and interview patterns.</p>
      <div className="grid2" style={{ alignItems: "start" }}><Track t="consulting" /><Track t="product" /></div>
    </div>
  );
  return (
    <div className="pad">
      <h1 className="h1">{TRACK_NAME[hub]}</h1>
      <p className="muted" style={{ margin: "6px 0 22px", fontSize: 15 }}>{TRACK_TYPES[hub].length} case types. Open one to see its revision sheets, concepts, solved cases and patterns.</p>
      <div style={{ maxWidth: 560 }}><Track t={hub} /></div>
    </div>
  );
}

function TypeHub({ type, onItem, onLib, go }) {
  const { reads } = useC();
  const label = TYPE_LABEL[type], n = CASES.filter(c => c.type === type).length;
  return (
    <div className="pad">
      <h1 className="h1">{label}</h1>
      <p className="muted" style={{ margin: "6px 0 22px", maxWidth: 640, fontSize: 15 }}>{TYPE_DESC[type]}</p>
      <div className="grid2" style={{ alignItems: "start" }}>{KINDS.map(([k, l, d, I]) => (
        <div key={k} className="card">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}><span className="ficon"><I size={20} /></span><div><h2 className="h2">{l}</h2><span className="muted">{d}</span></div></div>
          <div style={{ marginTop: 8 }}>{itemsFor(type, k).map(a => (
            <button key={a.id} className="rowi" onClick={() => onItem(a)}>
              <span style={{ flex: 1 }}><b>{a.title}</b><br /><span className="muted">{a.mins} min read</span></span>
              {reads[a.id] && <CheckCircle2 size={16} color="#1E8E5A" />}<ChevronRight size={16} />
            </button>))}</div>
        </div>))}</div>
      <div className="card" style={{ marginTop: 16, background: "var(--pine)", color: "#E6F1EC", borderColor: "var(--pine)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div><h3 className="h2" style={{ color: "#fff" }}>Practice from the case library</h3><p style={{ color: "#B8D0C6", marginTop: 4 }}>{n} {label.toLowerCase()} {n === 1 ? "case" : "cases"} with the AI interviewer.</p></div>
        <div style={{ display: "flex", gap: 10 }}><button className="btn saf" onClick={() => onLib()}><Play size={16} />Open {label}</button><button className="btn" onClick={() => go("community", { k: "comm", tab: "questions", type })}>Real questions</button></div>
      </div>
    </div>
  );
}

/* ───────────────────────── READER ───────────────────────── */
function Reader({ a, go, pc }) {
  const { reads, toggleRead, toast, startSession } = useC();
  const ref = useRef(null);
  const rail = a.kind === "solved";
  const [act, setAct] = useState(a.sections[0].id);
  const onScroll = () => {
    const el = ref.current; let cur = a.sections[0].id;
    for (const s of a.sections) { const h = el.querySelector("#s-" + s.id); if (h && h.offsetTop - el.scrollTop < 140) cur = s.id; }
    setAct(cur);
  };
  const jump = id => { const el = ref.current, h = el.querySelector("#s-" + id); el.scrollTo({ top: h.offsetTop - 16, behavior: "smooth" }); };
  const list = itemsFor(a.type, a.kind), idx = list.findIndex(x => x.id === a.id), next = list[idx + 1];
  const label = TYPE_LABEL[a.type], track = pc.track;
  const open = x => go("type", { k: "read", id: x.id }, pc);
  const dl = () => {
    const txt = `${a.title}\nPrepLeet one-pager\n\n` + a.key.map((k, i) => `${i + 1}. ${k}`).join("\n");
    const u = URL.createObjectURL(new Blob([txt], { type: "text/plain" })); const l = document.createElement("a"); l.href = u; l.download = a.id + "-one-pager.txt"; l.click(); URL.revokeObjectURL(u); toast("One-pager downloaded");
  };
  const wa = "https://wa.me/?text=" + encodeURIComponent(`${a.title}\n\n` + a.key.map((k, i) => `${i + 1}. ${k}`).join("\n") + "\n\nvia PrepLeet");
  const demoCase = CASES.find(c => READ[c.id] === a.id) || CASES.find(c => c.type === a.type) || CASES[0];
  return (<>
    <main className="mid" ref={ref} onScroll={rail ? onScroll : undefined}>
      <div className="pad">
        <div className="crumb">
          <button onClick={() => go("learn", { k: "hub", hub: "learn" })}>Learn</button><ChevronRight size={13} />
          <button onClick={() => go("learn", { k: "hub", hub: track })}>{TRACK_NAME[track]}</button><ChevronRight size={13} />
          <button onClick={() => go("type", { k: "thub", type: a.type }, pc)}>{label}</button><ChevronRight size={13} /><span>{KIND_LABEL[a.kind]}</span>
        </div>
        <h1 className="title">{a.title}</h1>
        <div className="meta"><span className={"chip d-" + a.level}>{a.level}</span><span><Clock size={14} />{a.mins} min read</span><span>Updated October 2026</span></div>
        <article className="art">
          {a.sections.map(s => <section key={s.id}><h2 id={"s-" + s.id}>{s.title}</h2><Blocks blocks={s.blocks} /></section>)}
        </article>
        {!rail && <div style={{ marginTop: 24 }}><button className="btn" onClick={() => toggleRead(a.id)}>{reads[a.id] ? <><CheckCircle2 size={16} color="#1E8E5A" />Marked as read</> : <><Circle size={16} />Mark as read</>}</button></div>}
        <div className="card nextcard"><div><b>Put it into practice</b><p className="muted">Try a {label.toLowerCase()} case with the AI interviewer.</p></div>
          <button className="btn pri" onClick={() => go("type", { k: "lib", preset: { type: [a.type] } }, pc)}>Open {label} cases</button></div>
        {next && <div className="card nextcard"><div><span className="muted">Up next in {KIND_LABEL[a.kind]}</span><br /><b>{next.title}</b></div><button className="btn" onClick={() => open(next)}>Read next<ChevronRight size={16} /></button></div>}
      </div>
    </main>
    {rail && <aside className="right" aria-label="Page tools">
      <div className="one">
        <h4>One-pager: the no-faff summary</h4>
        <ol>{a.key.map((k, i) => <li key={i}>{k}</li>)}</ol>
        <div style={{ display: "grid", gap: 8 }}>
          <button className="btn saf full" onClick={dl}><Download size={16} />Download one-pager</button>
          <a className="btn full" style={{ textDecoration: "none", background: "#25D366", borderColor: "#25D366", color: "#06361A" }} href={wa} target="_blank" rel="noreferrer"><MessageCircle size={16} />Share on WhatsApp</a>
          <button className="btn full" onClick={() => startSession(demoCase)}><Sparkles size={16} />Practice with AI</button>
        </div>
      </div>
      <button className="btn full" onClick={() => toggleRead(a.id)}>{reads[a.id] ? <><CheckCircle2 size={16} color="#1E8E5A" />Marked as read</> : <><Circle size={16} />Mark as read</>}</button>
      <div><h4 className="h2" style={{ fontSize: 15, marginBottom: 8 }}>On this page</h4>
        <div className="toc">{a.sections.map(s => <button key={s.id} className={act === s.id ? "on" : ""} onClick={() => jump(s.id)}>{s.title}</button>)}</div></div>
    </aside>}
  </>);
}

/* ───────────────────────── COMMUNITY ───────────────────────── */
function Community({ tab: t0 = "questions", type0, onTab, gate }) {
  const { toast } = useC();
  const [tab, setTab] = useState(t0);
  const [type, setType] = useState(type0 || "All types");
  const [co, setCo] = useState("All companies");
  const [open, setOpen] = useState({});
  const [got, setGot] = useState({});
  const [sort, setSort] = useState("Top");
  const [open2, setOpen2] = useState({});
  useEffect(() => setTab(t0), [t0]);
  const act = (m) => gate ? gate() : toast(m);
  const qs = REAL_QS.filter(q => (type === "All types" || q.type === type) && (co === "All companies" || q.co === co));
  const peers = PEERS.filter(p => type === "All types" || p.type === type).sort((a, b) => sort === "Top" ? b.up - a.up : b.uses - a.uses);
  const setT = x => { setTab(x); onTab && onTab(x); };
  return (
    <div className="pad">
      <h1 className="h1">Community</h1>
      <p className="muted" style={{ margin: "6px 0 0", fontSize: 15 }}>What was really asked, how people got in, and cases shared by peers.</p>
      {gate && <div className="tabs">{[["questions", "Real interview questions"], ["stories", "Success stories"], ["peers", "Case library by peers"]].map(([k, l]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setT(k)}>{l}</button>)}</div>}
      {!gate && <div style={{ height: 16 }} />}
      {tab === "questions" && <>
        <div className="fbar" style={{ marginTop: 0 }}>
          <select className="sel" aria-label="Type" value={type} onChange={e => setType(e.target.value)}><option>All types</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <select className="sel" aria-label="Company" value={co} onChange={e => setCo(e.target.value)}><option>All companies</option>{[...new Set(REAL_QS.map(q => q.co))].map(t => <option key={t}>{t}</option>)}</select>
          <button className="btn pri" style={{ marginLeft: "auto" }} onClick={() => act("Question form opens here")}><Plus size={16} />Add a question you were asked</button>
        </div>
        {qs.length ? qs.map(q => (
          <div key={q.id} className="qi">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><span className="chip pro">{q.co}</span><span className="chip">{q.role}</span><span className="chip">{q.round}</span><span className="chip"><i className="dot" style={{ background: TC[q.type] }} />{q.type}</span><span className="muted" style={{ marginLeft: "auto" }}>{q.yr}</span></div>
            <h3>{q.q}</h3>
            <div className="qa">
              <button className={"btn sm" + (got[q.id] ? " pri" : "")} onClick={() => gate ? gate() : setGot({ ...got, [q.id]: !got[q.id] })}><Check size={14} />I got this too ({q.got + (got[q.id] ? 1 : 0)})</button>
              <button className="btn sm" onClick={() => act("Upvoted")}><ThumbsUp size={14} />{q.up}</button>
              <button className="btn sm" onClick={() => setOpen({ ...open, [q.id]: !open[q.id] })}><MessageSquare size={14} />{q.cm} comments</button>
              <button className="btn sm ghost" onClick={() => act("Opening practice")}><Sparkles size={14} />Practise this</button>
            </div>
            {open[q.id] && <div className="ans"><b>Top answer</b><p style={{ marginTop: 4 }}>{q.a}</p></div>}
          </div>)) : <div className="empty">No questions for this filter yet. Be the first to add one.</div>}
      </>}
      {tab === "stories" && <div className="grid2">{STORIES.map(s => (
        <div key={s.id} className="card story">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}><span className="avatar">{s.name[0]}</span><div><b>{s.name}</b><br /><span className="muted">{s.college}</span></div><span className="chip d-Easy" style={{ marginLeft: "auto" }}><Trophy size={12} />Placed</span></div>
          <dl className="pair"><dt className="muted">Before</dt><dd>{s.from}</dd><dt className="muted">Now</dt><dd>{s.to}</dd></dl>
          <div style={{ display: "flex", gap: 8 }}><span className="chip">{s.weeks} weeks of prep</span><span className="chip">{s.cases} cases</span></div>
          <blockquote><Quote size={14} style={{ marginRight: 6 }} />{s.quote}</blockquote>
          <button className="btn sm" onClick={() => setOpen2({ ...open2, [s.id]: !open2[s.id] })}>{open2[s.id] ? "Hide" : "What worked for her or him"}<ChevronDown size={14} /></button>
          {open2[s.id] && <ul style={{ margin: "12px 0 0", paddingLeft: 18, display: "grid", gap: 6 }}>{s.tips.map(t => <li key={t}>{t}</li>)}</ul>}
        </div>))}</div>}
      {tab === "peers" && <>
        <div className="fbar" style={{ marginTop: 0 }}>
          <select className="sel" aria-label="Type" value={type} onChange={e => setType(e.target.value)}><option>All types</option>{TYPES.map(t => <option key={t}>{t}</option>)}</select>
          <div className="seg"><button className={sort === "Top" ? "on" : ""} onClick={() => setSort("Top")}>Top voted</button><button className={sort === "Used" ? "on" : ""} onClick={() => setSort("Used")}>Most practised</button></div>
          <button className="btn pri" style={{ marginLeft: "auto" }} onClick={() => act("Case submission form opens here")}><Plus size={16} />Share your case</button>
        </div>
        <div style={{ display: "grid", gap: 12 }}>{peers.map(p => (
          <div key={p.id} className="qi" style={{ margin: 0 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}><span className="chip"><i className="dot" style={{ background: TC[p.type] }} />{p.type}</span><span className={"chip d-" + p.diff}>{p.diff}</span>{p.ver ? <span className="chip d-Easy"><BadgeCheck size={13} />Reviewed by PrepLeet</span> : <span className="chip">Awaiting review</span>}</div>
            <h3>{p.title}</h3>
            <div className="qa"><span className="muted">By {p.by} from {p.college}</span><span className="muted" style={{ marginLeft: 10 }}>{p.uses} practised</span>
              <button className="btn sm" style={{ marginLeft: "auto" }} onClick={() => act("Upvoted")}><ThumbsUp size={14} />{p.up}</button><button className="btn sm pri" onClick={() => act("Opening practice")}><Sparkles size={14} />Practise</button></div>
          </div>))}</div>
      </>}
    </div>
  );
}

/* ───────────────────────── DASHBOARD ───────────────────────── */
function Dash({ go }) {
  const { stat, reads, openCase, user, prof } = useC();
  const prog = CASES.filter(c => stat[c.id] === "prog");
  const rec = CASES.filter(c => !stat[c.id]).sort((a, b) => { const sc = c => (prof.target.some(t => t.startsWith(trackOf(c) === "Both" ? "" : trackOf(c))) ? 2 : 0) + (c.type === "Guesstimate" ? 1 : 0); return sc(b) - sc(a); }).slice(0, 4);
  const done = Object.values(stat).filter(s => s === "done").length;
  const days = [["M", 20], ["T", 45], ["W", 30], ["T", 55], ["F", 15], ["S", 70], ["S", 40]];
  const lp = t => { const u = [...new Set(ARTICLES.filter(a => TRACK_TYPES[t].includes(a.type)).map(a => a.id))]; return [u.filter(i => reads[i]).length, u.length]; };
  const c = 2 * Math.PI * 34, goal = Math.min(done + 1, 5) / 5;
  return (
    <div className="pad">
      <h1 className="h1">Welcome back, {user}</h1>
      <p className="muted" style={{ margin: "6px 0 22px", fontSize: 15 }}>You’re 2 cases away from this week’s goal.</p>
      <div className="grid3">
        <div className="card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div className="ring"><svg width="84" height="84" viewBox="0 0 84 84"><circle cx="42" cy="42" r="34" fill="none" stroke="#E4EBE7" strokeWidth="9" /><circle cx="42" cy="42" r="34" fill="none" stroke="#1D5C52" strokeWidth="9" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - goal)} transform="rotate(-90 42 42)" /></svg><b>{Math.min(done + 1, 5)}/5</b></div>
          <div><b>Weekly goal</b><p className="muted">Cases finished this week</p></div></div>
        <div className="card" style={{ display: "flex", gap: 14, alignItems: "center" }}><span className="ficon" style={{ background: "var(--saf2)", color: "#B45309" }}><Flame size={22} /></span><div><b style={{ fontSize: 24 }}>6 days</b><p className="muted">Current streak</p></div></div>
        <div className="card"><b>This week</b><div className="wk" style={{ marginTop: 10 }}>{days.map(([d, m], i) => <div key={i}><i style={{ height: m + "%" }} />{d}</div>)}</div></div>
      </div>
      <div className="grid2 asym" style={{ marginTop: 16, alignItems: "start" }}>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="card"><h3 className="h2" style={{ marginBottom: 6 }}>Continue where you left off</h3>
            {prog.length ? prog.map(p => <button key={p.id} className="rowi" onClick={() => openCase(p)}><span className="num" style={{ background: TC[p.type] + "22", color: TC[p.type] }}><Play size={14} /></span><span style={{ flex: 1 }}><b>{p.title}</b><br /><span className="muted">{p.type}, {p.mins} min</span></span><ChevronRight size={16} /></button>) : <p className="muted">Nothing in progress. Pick a case below.</p>}</div>
          <div className="card"><h3 className="h2" style={{ marginBottom: 6 }}>Recommended next</h3>
            {rec.map(p => <button key={p.id} className="rowi" onClick={() => openCase(p)}><span style={{ flex: 1 }}><b>{p.title}</b><br /><span className="muted">{p.type}</span></span><span className={"chip d-" + p.diff}>{p.diff}</span></button>)}
            <button className="btn sm" style={{ marginTop: 10 }} onClick={() => go("main", { k: "lib", preset: {} })}>Open case library</button></div>
        </div>
        <div style={{ display: "grid", gap: 16 }}>
          <div className="card"><h3 className="h2" style={{ marginBottom: 12 }}>Skill readiness</h3>{[["Structuring", 78], ["Quantitative", 70], ["Insight", 62], ["Communication", 82]].map(([k, v]) => <div key={k} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span>{k}</span><b>{v}%</b></div><div className="bar"><i style={{ width: v + "%" }} /></div></div>)}</div>
          <div className="card"><h3 className="h2" style={{ marginBottom: 12 }}>Learning progress</h3>{["consulting", "product"].map(t => { const [r, n] = lp(t); return <div key={t} style={{ marginBottom: 12 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><span>{TRACK_NAME[t]}</span><span className="muted">{r} of {n} guides</span></div><div className="bar"><i style={{ width: (n ? r / n * 100 : 0) + "%" }} /></div></div>; })}</div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── LEFT PANELS ───────────────────────── */
const Back = ({ label, onClick }) => <button className="back" onClick={onClick}><ArrowLeft size={16} />{label}</button>;

function MainPanel({ view, go, panel }) {
  const [drop, setDrop] = useState(false);
  const { openCase } = useC();
  const toType = (type, track) => go("type", { k: "thub", type }, { type, track, from: "learn" });
  return (<>
    <NI icon={LayoutDashboard} label="Dashboard" on={view.k === "dash"} onClick={() => go("main", { k: "dash" })} />
    <NI icon={Calculator} label="Guesstimates" onClick={() => go("type", { k: "thub", type: "Guesstimate" }, { type: "Guesstimate", track: "consulting", from: "main" })} />
    <NI icon={BookOpen} label="Learn" onClick={() => go("learn", { k: "hub", hub: "learn" })} right={<span className="chev" role="button" aria-label="Toggle Learn menu" onClick={e => { e.stopPropagation(); setDrop(!drop); }}>{drop ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</span>} />
    {drop && <div className="indent">{["consulting", "product"].map(t => (
      <div key={t}><button className="ni sub" style={{ fontWeight: 600, color: "#fff" }} onClick={() => go("learn", { k: "hub", hub: t })}><span>Learn {TRACK_NAME[t]}</span></button>
        <div className="indent">{TOPICS[t].map(tp => <NI key={tp} sub label={tp} onClick={() => toType(TOPIC_TYPE[tp], t)} />)}</div></div>))}</div>}
    <NI icon={Library} label="Practice" on={(view.k === "lib" || view.k === "case") && panel === "main"} onClick={() => go("main", { k: "lib", preset: {} })} />
    <NI icon={Users} label="Community" onClick={() => go("community", { k: "comm", tab: "questions" })} />
    <div className="lcard"><b>Today’s guesstimate</b>Cups of chai sold daily in Delhi. 12 minutes.<button className="btn saf sm full" style={{ marginTop: 10 }} onClick={() => openCase(CASES[2])}>Start</button></div>
  </>);
}

function LearnPanel({ view, go }) {
  const [o, setO] = useState({ consulting: true, product: true });
  return (<>
    <Back label="Back to main menu" onClick={() => go("main", { k: "dash" })} />
    <div className="lhead">Learn</div>
    {["consulting", "product"].map(t => (
      <div key={t}>
        <NI icon={t === "consulting" ? Briefcase : Target} label={TRACK_NAME[t]} on={view.k === "hub" && view.hub === t}
          onClick={() => { setO({ ...o, [t]: !o[t] }); go("learn", { k: "hub", hub: t }); }} right={o[t] ? <ChevronDown size={15} /> : <ChevronRight size={15} />} />
        {o[t] && <div className="indent">
          {TRACK_TYPES[t].map(ty => (
            <button key={ty} className="ni row" onClick={() => go("type", { k: "thub", type: ty }, { type: ty, track: t, from: "learn" })}>
              <span style={{ flex: 1 }}>{TYPE_LABEL[ty]}</span><ChevronRight size={15} className="chv" />
            </button>))}
          <NI icon={Library} label={"Practice " + (t === "consulting" ? "Consulting" : "Product Management")} on={view.k === "lib" && (view.preset || {}).track === (t === "consulting" ? "Consulting" : "Product")} onClick={() => go("learn", { k: "lib", preset: { track: t === "consulting" ? "Consulting" : "Product" } })} />
        </div>}
      </div>))}
  </>);
}

function TypePanel({ pc, view, go }) {
  const { type, from } = pc;
  const [open, setOpen] = useState({ hurry: true, concepts: true, solved: true, patterns: true });
  const rid = view.k === "read" ? view.id : null;
  const back = from === "main" ? ["Back to main menu", () => go("main", { k: "dash" })] : ["Back to Learn", () => go("learn", { k: "hub", hub: "learn" })];
  return (<>
    <Back label={back[0]} onClick={back[1]} />
    <div className="lhead">{TYPE_LABEL[type]}</div>
    <NI icon={LayoutDashboard} label="Overview" on={view.k === "thub"} onClick={() => go("type", { k: "thub", type }, pc)} />
    {KINDS.map(([k, l, , I]) => { const items = itemsFor(type, k); return (
      <div key={k}>
        <button className="kh" aria-expanded={open[k]} onClick={() => setOpen({ ...open, [k]: !open[k] })}><I size={17} />{l}<small>{items.length}</small>{open[k] ? <ChevronDown size={15} /> : <ChevronRight size={15} />}</button>
        {open[k] && <div className="indent">{items.map(a => <NI key={a.id} sub label={a.title} on={rid === a.id} onClick={() => go("type", { k: "read", id: a.id }, pc)} />)}</div>}
      </div>); })}
    <div className="lsub">Practice</div>
    <NI icon={Library} label="Practice from Case library" on={view.k === "lib" || view.k === "case"} onClick={() => go("type", { k: "lib", preset: { type: [type] } }, pc)} />
  </>);
}

function CommunityPanel({ view, go }) {
  return (<>
    <Back label="Back to main menu" onClick={() => go("main", { k: "dash" })} /><div className="lhead">Community</div>
    <NI icon={MessageSquare} label="Real Interview Questions" on={view.tab === "questions"} onClick={() => go("community", { k: "comm", tab: "questions" })} />
    <NI icon={Trophy} label="Success Stories" on={view.tab === "stories"} onClick={() => go("community", { k: "comm", tab: "stories" })} />
    <NI icon={Library} label="Case Library by Peers" on={view.tab === "peers"} onClick={() => go("community", { k: "comm", tab: "peers" })} />
  </>);
}

function LeftPanel({ panel, view, go, pc }) {
  if (panel === "type") return <TypePanel key={pc.type + pc.from} pc={pc} view={view} go={go} />;
  if (panel === "learn") return <LearnPanel view={view} go={go} />;
  if (panel === "community") return <CommunityPanel view={view} go={go} />;
  return <MainPanel view={view} go={go} panel={panel} />;
}

/* ───────────────────────── PROFILE ───────────────────────── */
function Field({ label, value, edit, onChange, type = "text", wide, options }) {
  return (
    <div className="fi" style={wide ? { gridColumn: "1 / -1" } : null}>
      <label>{label}</label>
      {edit ? (options ? <select aria-label={label} value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select>
        : <input aria-label={label} type={type} value={value} onChange={e => onChange(e.target.value)} />)
        : <div style={{ fontWeight: 500, minHeight: 20 }}>{value || <span className="muted">Not added</span>}</div>}
    </div>
  );
}

function Profile({ tab }) {
  const { prof, setProf, toast, sub, reads } = useC();
  const [t, setT] = useState(tab || "profile");
  const [edit, setEdit] = useState(false);
  const [d, setD] = useState(prof);
  const v = edit ? d : prof;
  const set = (k, x) => setD(s => ({ ...s, [k]: x }));
  const setArr = (k, i, f, x) => setD(s => ({ ...s, [k]: s[k].map((e, j) => j === i ? { ...e, [f]: x } : e) }));
  const addArr = k => setD(s => ({ ...s, [k]: [...s[k], { company: "", role: "", period: "", note: "" }] }));
  const delArr = (k, i) => setD(s => ({ ...s, [k]: s[k].filter((_, j) => j !== i) }));
  const togTarget = x => set("target", d.target.includes(x) ? d.target.filter(y => y !== x) : [...d.target, x]);
  const save = () => { setProf(d); setEdit(false); toast("Profile saved"); };
  const cancel = () => { setD(prof); setEdit(false); };
  const Entries = ({ k, title, empty }) => (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><h3 className="h2">{title}</h3>{edit && <button className="btn sm" onClick={() => addArr(k)}><Plus size={14} />Add</button>}</div>
      {v[k].length === 0 && <p className="muted" style={{ marginTop: 8 }}>{empty}</p>}
      {v[k].map((e, i) => edit ? (
        <div key={i} className="entry"><div className="fgrid">
          <Field edit label="Company" value={e.company} onChange={x => setArr(k, i, "company", x)} /><Field edit label="Role" value={e.role} onChange={x => setArr(k, i, "role", x)} />
          <Field edit label="Period" value={e.period} onChange={x => setArr(k, i, "period", x)} /><Field edit label="What you did" value={e.note} onChange={x => setArr(k, i, "note", x)} />
        </div><button className="btn sm ghost" style={{ marginTop: 8 }} onClick={() => delArr(k, i)}><X size={14} />Remove</button></div>
      ) : (
        <div key={i} className="entry"><b>{e.role}</b>{e.company && <> at {e.company}</>}<br /><span className="muted">{e.period}</span>{e.note && <p style={{ marginTop: 6 }}>{e.note}</p>}</div>
      ))}
    </div>
  );
  const headline = [v.degree && `${v.degree} ${v.batch}`, v.college].filter(Boolean).join(", ");
  const nRead = Object.values(reads).filter(Boolean).length;
  return (
    <div className="pad">
      <div className="card" style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
        <span className="avatar" style={{ width: 64, height: 64, fontSize: 26 }}>{v.name[0]}</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h1 className="h1" style={{ fontSize: 24 }}>{v.name}</h1>
          <p className="muted">{headline}</p>
          <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}><span className="chip pro"><Sparkles size={12} />{sub.plan} {sub.status.toLowerCase()}</span>{v.target.map(x => <span key={x} className="chip">{x}</span>)}</div>
        </div>
        {t === "profile" && (edit ? <div style={{ display: "flex", gap: 8 }}><button className="btn" onClick={cancel}>Cancel</button><button className="btn pri" onClick={save}>Save changes</button></div>
          : <button className="btn" onClick={() => { setD(prof); setEdit(true); }}><Pencil size={15} />Edit profile</button>)}
      </div>
      <div className="tabs"><button className={t === "profile" ? "on" : ""} onClick={() => setT("profile")}>Profile</button><button className={t === "sub" ? "on" : ""} onClick={() => setT("sub")}>Subscription</button></div>

      {t === "profile" && <div style={{ display: "grid", gap: 16 }}>
        <div className="card"><h3 className="h2" style={{ marginBottom: 12 }}>About and goals</h3><div className="fgrid">
          <Field label="Full name" value={v.name} edit={edit} onChange={x => set("name", x)} /><Field label="Email" value={v.email} edit={edit} onChange={x => set("email", x)} />
          <Field label="City" value={v.city} edit={edit} onChange={x => set("city", x)} /><Field label="Target interview season" value={v.season} edit={edit} onChange={x => set("season", x)} />
          <div className="fi" style={{ gridColumn: "1 / -1" }}><label>Preparing for</label>
            {edit ? <div className="fchips" style={{ margin: 0 }}>{["Consulting", "Product Management"].map(x => <button key={x} className={"fc" + (d.target.includes(x) ? " on" : "")} onClick={() => togTarget(x)}>{x}</button>)}</div>
              : <div style={{ fontWeight: 500 }}>{v.target.join(" and ") || <span className="muted">Not added</span>}</div>}</div>
          <Field wide label="Target firms and roles" value={v.firms} edit={edit} onChange={x => set("firms", x)} />
        </div></div>
        <div className="card"><h3 className="h2" style={{ marginBottom: 12 }}>Education</h3><div className="fgrid">
          <Field label="MBA college" value={v.college} edit={edit} onChange={x => set("college", x)} /><Field label="Programme" value={v.degree} edit={edit} onChange={x => set("degree", x)} />
          <Field label="Specialisation" value={v.spec} edit={edit} onChange={x => set("spec", x)} /><Field label="Batch (graduation year)" value={v.batch} edit={edit} onChange={x => set("batch", x)} />
          <Field label="Undergraduate degree" value={v.ug} edit={edit} onChange={x => set("ug", x)} /><Field label="Undergraduate college and year" value={v.ugCollege} edit={edit} onChange={x => set("ugCollege", x)} />
        </div></div>
        <div className="card"><h3 className="h2" style={{ marginBottom: 12 }}>Current work</h3><div className="fgrid">
          <Field label="Total work experience" value={v.exp} edit={edit} onChange={x => set("exp", x)} /><Field label="Industry" value={v.industry} edit={edit} onChange={x => set("industry", x)} />
          <Field label="Current company" value={v.company} edit={edit} onChange={x => set("company", x)} /><Field label="Current role" value={v.role} edit={edit} onChange={x => set("role", x)} />
        </div></div>
        <Entries k="work" title="Previous work experience" empty="No previous roles added." />
        <Entries k="interns" title="Internships" empty="No internships added." />
      </div>}

      {t === "sub" && <div style={{ display: "grid", gap: 16 }}>
        <div className="card" style={{ background: "var(--pine)", color: "#E6F1EC", borderColor: "var(--pine)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div><span className="chip pro">{sub.status}</span><h2 style={{ fontSize: 28, margin: "10px 0 4px", color: "#fff" }}>{sub.plan} plan</h2><p style={{ color: "#B8D0C6" }}>Free trial ends {sub.trialEnds}, {sub.daysLeft} days left. First charge of {sub.price} on {sub.nextCharge}.</p></div>
            <div style={{ display: "flex", gap: 10 }}><button className="btn saf" onClick={() => toast("Plan picker opens here")}>Change plan</button><button className="btn" onClick={() => toast("Cancel flow opens here")}>Cancel trial</button></div>
          </div></div>
        <div className="grid3">
          {[["AI sessions this month", sub.sessions, "Unlimited on Pro"], ["Cases opened", sub.cases, "Of 30 in the library"], ["Guides read", nRead, "Across all case types"]].map(([k, n, s]) => <div key={k} className="card"><span className="muted">{k}</span><div style={{ fontSize: 30, fontWeight: 800, color: "var(--pine)", margin: "4px 0" }}>{n}</div><span className="muted">{s}</span></div>)}
        </div>
        <div className="grid2" style={{ alignItems: "start" }}>
          <div className="card"><h3 className="h2" style={{ marginBottom: 10 }}>Plan details</h3><dl className="dl">
            <dt className="muted">Plan</dt><dd>Pro, monthly</dd><dt className="muted">Started</dt><dd>{sub.started}</dd><dt className="muted">Trial ends</dt><dd>{sub.trialEnds}</dd><dt className="muted">Price after trial</dt><dd>{sub.price}</dd><dt className="muted">Next charge</dt><dd>{sub.nextCharge}</dd></dl></div>
          <div className="card"><h3 className="h2" style={{ marginBottom: 10 }}>Payment method</h3><p className="muted" style={{ marginBottom: 12 }}>No payment method added yet. Add one before {sub.nextCharge} to keep Pro.</p><button className="btn" onClick={() => toast("Payment form opens here")}><CreditCard size={16} />Add payment method</button></div>
        </div>
        <div className="card"><h3 className="h2" style={{ marginBottom: 10 }}>Billing history</h3>
          <table className="art" style={{ fontFamily: "inherit", fontSize: 14, margin: 0, maxWidth: "none" }}><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{sub.history.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody></table></div>
      </div>}
    </div>
  );
}

/* ───────────────────────── APP SHELL ───────────────────────── */
function AppShell({ panel, view, go, pc }) {
  const { signOut, user, sub } = useC();
  const [drawer, setDrawer] = useState(false), [menu, setMenu] = useState(false);
  const goD = (p, v, c) => { setDrawer(false); setMenu(false); go(p, v, c); };
  const onLibTrack = t => go("learn", { k: "lib", preset: { track: t === "consulting" ? "Consulting" : "Product" } });
  const vk = view.k + (view.id || view.hub || view.tab || view.type || "") + JSON.stringify(view.preset || {});
  let mid;
  if (view.k === "dash") mid = <Dash go={go} />;
  else if (view.k === "hub") mid = <Hub hub={view.hub} onType={(ty, tr) => go("type", { k: "thub", type: ty }, { type: ty, track: tr, from: "learn" })} onLib={onLibTrack} />;
  else if (view.k === "thub") mid = <TypeHub type={view.type} onItem={a => go("type", { k: "read", id: a.id }, pc)} onLib={() => go("type", { k: "lib", preset: { type: [view.type] } }, pc)} go={go} />;
  else if (view.k === "lib") { const ty = view.preset && view.preset.type; mid = <div className="pad"><LibraryView key={vk} preset={view.preset} onOpen={c => go(panel, { k: "case", id: c.id, back: view })} title={ty && ty.length === 1 ? TYPE_LABEL[ty[0]] + " case library" : "Case library"} sub="Every case you can practise with the AI interviewer, filtered your way." /></div>; }
  else if (view.k === "case") mid = <div className="pad"><CaseDetail c={CASES.find(c => c.id === view.id)} onBack={() => go(panel, view.back || { k: "lib", preset: {} })} onRead={a => go("type", { k: "read", id: a.id }, { type: a.type, track: trackFor(a.type), from: "learn" })} /></div>;
  else if (view.k === "comm") mid = <Community key={vk} tab={view.tab} type0={view.type} onTab={t => go(panel, { ...view, tab: t })} />;
  else if (view.k === "profile") mid = <Profile key={view.tab} tab={view.tab} />;
  return (<>
    <header className="top">
      <button className="ic menu-btn" aria-label="Open menu" onClick={() => setDrawer(!drawer)}>{drawer ? <X size={20} /> : <Menu size={20} />}</button>
      <Logo />
      <div className="search"><Search size={16} /><input aria-label="Search" placeholder="Search cases and guides" onKeyDown={e => e.key === "Enter" && e.target.value && goD("main", { k: "lib", preset: { q: e.target.value } })} /></div>
      <div className="sp" />
      <div className="streak"><Flame size={16} />6</div>
      <button className="avatar" aria-label="Account menu" onClick={() => setMenu(!menu)}>{user[0]}</button>
      {menu && <div className="menu"><div style={{ padding: "8px 10px" }}><b>{user}</b><br /><span className="muted">{sub.plan} {sub.status.toLowerCase()}, {sub.daysLeft} days left</span></div>
        <button onClick={() => goD("main", { k: "profile", tab: "profile" })}><User size={16} />Profile</button>
        <button onClick={() => goD("main", { k: "profile", tab: "sub" })}><CreditCard size={16} />Subscription</button>
        <button onClick={signOut}><LogOut size={16} />Sign out</button></div>}
    </header>
    <div className="body">
      <nav className={"left" + (drawer ? " open" : "")} aria-label="Main navigation"><LeftPanel panel={panel} view={view} go={goD} pc={pc} /></nav>
      {view.k === "read" ? <Reader key={view.id} a={getArt(view.id)} go={go} pc={pc} /> : <main className="mid" key={vk}>{mid}</main>}
    </div>
  </>);
}

/* ───────────────────────── PUBLIC SITE ───────────────────────── */
function CabTree() {
  const [share, setShare] = useState(4), [tr, setTr] = useState(1.5), [cab, setCab] = useState(12);
  const riders = 20e6 * share / 100, trips = riders * tr, cabs = trips / cab;
  const f = n => n >= 1e7 ? (n / 1e7).toFixed(1) + " crore" : n >= 1e5 ? (n / 1e5).toFixed(1) + " lakh" : Math.round(n).toLocaleString("en-IN");
  return (
    <div className="est">
      <h3>Try one now: how many cabs run in Mumbai?</h3><p className="sub">Move the assumptions and watch the answer change.</p>
      <div className="node"><span>Mumbai population</span><b>2 crore</b></div><div className="link" />
      <div className="node"><span>Daily cab riders</span><b>{f(riders)}</b></div><div className="link" />
      <div className="node"><span>Cab trips per day</span><b>{f(trips)}</b></div><div className="link" />
      <div className="node final"><span>Cabs needed</span><b>{f(cabs)}</b></div>
      <div className="sl">
        <label>Share who ride daily<b>{share}%</b></label><input type="range" min="1" max="10" step="0.5" value={share} onChange={e => setShare(+e.target.value)} aria-label="Share who ride daily" />
        <label>Trips per rider<b>{tr}</b></label><input type="range" min="1" max="3" step="0.5" value={tr} onChange={e => setTr(+e.target.value)} aria-label="Trips per rider" />
        <label>Trips per cab per day<b>{cab}</b></label><input type="range" min="6" max="20" step="1" value={cab} onChange={e => setCab(+e.target.value)} aria-label="Trips per cab per day" />
      </div>
      <p className="sanity">Sanity check: about one cab for every {Math.round(20e6 / cabs)} residents.</p>
    </div>
  );
}

function Pricing({ openLogin }) {
  const [q, setQ] = useState(false);
  return (
    <div className="wrap">
      <div className="pgh" style={{ textAlign: "center" }}><h1>Pricing that fits a placement season</h1><p style={{ margin: "8px auto 18px" }}>Start free. Upgrade when you need the full case library and unlimited AI practice.</p>
        <div className="seg"><button className={!q ? "on" : ""} onClick={() => setQ(false)}>Monthly</button><button className={q ? "on" : ""} onClick={() => setQ(true)}>Quarterly, save 20%</button></div></div>
      <div className="plans">
        {[{ n: "Free", p: "₹0", s: "For getting started", f: ["All guesstimate guides", "3 free cases each month", "One-pager downloads", "Community read access"], b: "Start free" },
          { n: "Pro", p: q ? "₹1,199" : "₹499", s: q ? "per quarter" : "per month", f: ["Full case library, all 9 types", "Unlimited AI interviewer sessions", "Detailed feedback scorecards", "Post questions and cases", "WhatsApp-ready one-pagers"], b: "Start 14-day trial", hot: true },
          { n: "Sprint", p: "₹1,499", s: "one-time, 60 days", f: ["Everything in Pro", "Placement-season access", "Priority case reviews", "Resume for peer mock interviews"], b: "Get Sprint" }].map(p => (
          <div key={p.n} className={"card plan" + (p.hot ? " hot" : "")}><h3 className="h2">{p.n}</h3><div><span className="price">{p.p}</span> <span className="muted">{p.s}</span></div>
            <ul>{p.f.map(x => <li key={x}><Check size={16} />{x}</li>)}</ul><button className={"btn lg full " + (p.hot ? "pri" : "")} style={{ marginTop: "auto" }} onClick={openLogin}>{p.b}</button></div>))}
      </div>
    </div>
  );
}

function Public({ pub, setPub, openLogin }) {
  const [vh, setVh] = useState(null);
  const gate = () => openLogin("signup");
  const nav = [["guess", "Guesstimates"], ["learn", "Learn"], ["practice", "Practice"], ["community", "Community"], ["pricing", "Pricing"]];
  const PH = ({ t, s }) => <div className="pgh"><h1>{t}</h1><p>{s}</p></div>;
  const Gate = () => <div className="gate"><span>Sign up free to open cases, save progress and practise with the AI interviewer.</span><button className="btn sm pri" onClick={gate}>Sign up</button></div>;
  return (<>
    <header className="pub-top">
      <button onClick={() => setPub("home")} aria-label="PrepLeet home"><Logo /></button>
      <nav className="pub-nav" aria-label="Primary">{nav.map(([k, l]) => <button key={k} className={pub === k ? "on" : ""} onClick={() => setPub(k)}>{l}</button>)}</nav>
      <button className="btn ghost" onClick={() => openLogin("login")}>Log in</button><button className="btn pri" onClick={() => openLogin("signup")}>Sign up</button>
    </header>
    <div className="scroll">
      {pub === "home" && <div className="wrap">
        <section className="hero">
          <div><h1>Crack guesstimates before you crack cases.</h1>
            <p className="lead">Frameworks written by people who got the offer, an AI interviewer that pushes back, and a community that shares what was really asked.</p>
            <div className="cta"><button className="btn pri lg" onClick={() => openLogin("signup")}>Start with guesstimates, free</button><button className="btn lg" onClick={() => setPub("practice")}>Browse the case library</button></div></div>
          <CabTree />
        </section>
        <section className="feat">
          {[[BookOpen, "Learn", "Guides for 9 case types, each with a one-pager you can share on WhatsApp.", ["Guesstimates, profitability, pricing, market entry", "Product design, metrics and RCA"]],
            [Sparkles, "Practice", "A filterable library and an AI interviewer that asks the follow-ups real interviewers ask.", ["Filter by difficulty, type, company and time", "Scorecards after every session"]],
            [Users, "Community", "See real questions from this season and how people who got in prepared.", ["Real interview questions", "Success stories and peer cases"]]].map(([I, t, d, l]) => (
            <div key={t} className="card"><span className="ficon"><I size={20} /></span><h3>{t}</h3><p className="muted">{d}</p><ul>{l.map(x => <li key={x}>{x}</li>)}</ul></div>))}
        </section>
        <div className="sec-h"><h2>Popular guesstimates</h2><button className="btn" onClick={() => setPub("guess")}>See all</button></div>
        <div className="cgrid" style={{ marginTop: 0 }}>{CASES.slice(0, 3).map(c => <CaseCard key={c.id} c={c} onOpen={gate} />)}</div>
        <div className="band"><h2>Your first ten guesstimates are on us.</h2><button className="btn saf lg" onClick={() => openLogin("signup")}>Create free account</button></div>
        <footer className="foot"><Logo /><span>Prototype with sample content. Pricing and statistics are placeholders.</span></footer>
      </div>}
      {pub === "pricing" && <Pricing openLogin={gate} />}
      {pub === "guess" && <div className="wrap"><Gate /><TypeHub type="Guesstimate" onItem={gate} onLib={gate} go={gate} /><div className="pad" style={{ padding: "0 0 40px" }}><LibraryView preset={{ type: ["Guesstimate"] }} onOpen={gate} title="Guesstimate cases" /></div></div>}
      {pub === "learn" && <div className="wrap"><Gate /><Hub hub="learn" onType={gate} onLib={gate} /></div>}
      {pub === "practice" && <div className="wrap"><PH t="Practice" s="Filter by type, difficulty, company and time." /><Gate /><div className="pad" style={{ padding: "0 0 40px" }}><LibraryView onOpen={gate} /></div></div>}
      {pub === "community" && <div className="wrap"><Gate /><Community tab={vh || "questions"} onTab={setVh} gate={gate} /></div>}
    </div>
  </>);
}

/* ───────────────────────── PRACTICE SESSION ───────────────────────── */
function Session({ c, onExit }) {
  const [msgs, setMsgs] = useState([{ r: "ai", t: promptFor(c) }]);
  const [txt, setTxt] = useState(""), [sec, setSec] = useState(0), [fb, setFb] = useState(false), [n, setN] = useState(0);
  const end = useRef(null);
  useEffect(() => { if (fb) return; const i = setInterval(() => setSec(s => s + 1), 1000); return () => clearInterval(i); }, [fb]);
  useEffect(() => { end.current && end.current.scrollIntoView({ block: "end" }); }, [msgs]);
  const send = () => { const t = txt.trim(); if (!t) return; setTxt(""); setMsgs(m => [...m, { r: "me", t }]); const k = n; setN(k + 1); setTimeout(() => setMsgs(m => [...m, { r: "ai", t: SCRIPT[Math.min(k, SCRIPT.length - 1)] }]), 700); };
  const mm = String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0");
  return (
    <div className="sess" role="dialog" aria-label="AI practice session">
      <div className="sess-top"><button className="btn sm" onClick={() => onExit(false)}><ArrowLeft size={15} />Exit</button><div style={{ flex: 1, minWidth: 0 }}><b>{c.title}</b></div>
        {!fb && <><span className="chip"><Timer size={13} />{mm} of {c.mins}:00</span><button className="btn pri sm" onClick={() => setFb(true)}>End and get feedback</button></>}</div>
      {!fb ? <div className="sess-body">
        <div className="chat"><div className="msgs">{msgs.map((m, i) => <div key={i} className={"m " + m.r}>{m.r === "ai" && <b style={{ display: "block", fontSize: 12, color: "#5E6D67", marginBottom: 2 }}>Interviewer</b>}{m.t}</div>)}<div ref={end} /></div>
          <div className="composer"><input aria-label="Your answer" value={txt} placeholder="Type your answer" onChange={e => setTxt(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} /><button className="btn pri" onClick={send}><Send size={16} />Send</button></div></div>
        <aside className="pad-side"><b>Your structure</b><span className="muted">Jot your framework here. Only you can see it.</span><textarea aria-label="Scratchpad" placeholder="Clarify, structure, assumptions, calculation, sanity check" /></aside>
      </div> : <div className="scroll"><div className="pad" style={{ maxWidth: 720 }}>
        <h1 className="h1">Session feedback</h1>
        <div className="card" style={{ margin: "18px 0", display: "flex", gap: 20, alignItems: "center" }}><div style={{ fontSize: 48, fontWeight: 800, color: "var(--pine)" }}>{FEEDBACK.score}</div><div><b>Overall score out of 100</b><p className="muted">A solid first attempt. Your structure was clear; push on insight.</p></div></div>
        <div className="card">{FEEDBACK.parts.map(([k, v]) => <div key={k} className="scorebar"><span>{k}</span><div className="bar"><i style={{ width: v + "%" }} /></div><b>{v}</b></div>)}</div>
        <div className="grid2" style={{ marginTop: 16 }}><div className="card"><h3 className="h2" style={{ marginBottom: 8 }}>What worked</h3><ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>{FEEDBACK.good.map(x => <li key={x}>{x}</li>)}</ul></div>
          <div className="card"><h3 className="h2" style={{ marginBottom: 8 }}>Work on next</h3><ul style={{ paddingLeft: 18, margin: 0, display: "grid", gap: 6 }}>{FEEDBACK.fix.map(x => <li key={x}>{x}</li>)}</ul></div></div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}><button className="btn pri" onClick={() => onExit(true)}>Back to cases</button></div>
      </div></div>}
    </div>
  );
}

function LoginModal({ mode, setMode, onClose, onDone }) {
  const su = mode === "signup";
  return (
    <div className="modal-bg" onClick={onClose}><div className="modal" role="dialog" aria-label={su ? "Sign up" : "Log in"} onClick={e => e.stopPropagation()}>
      <button className="ic x" aria-label="Close" onClick={onClose}><X size={18} /></button>
      <Logo /><h2 className="h2" style={{ fontSize: 22 }}>{su ? "Create your free account" : "Welcome back"}</h2>
      <button className="btn full" onClick={onDone}>Continue with Google</button>
      <span className="muted" style={{ textAlign: "center" }}>or use email</span>
      {su && <input aria-label="Name" placeholder="Full name" />}<input aria-label="Email" placeholder="Email" type="email" /><input aria-label="Password" placeholder="Password" type="password" />
      <button className="btn pri lg full" onClick={onDone}>{su ? "Create free account" : "Log in"}</button>
      <p className="muted" style={{ textAlign: "center" }}>{su ? "Have an account?" : "New here?"} <button style={{ textDecoration: "underline", fontWeight: 600 }} onClick={() => setMode(su ? "login" : "signup")}>{su ? "Log in" : "Sign up"}</button></p>
      <p className="muted" style={{ textAlign: "center", fontSize: 12 }}>Prototype: any input signs you in.</p>
    </div></div>
  );
}

/* ───────────────────────── ROOT ───────────────────────── */
const PROFILE0 = {
  name: "Aarav Mehta", email: "aarav.mehta@example.com", city: "Pune", season: "Campus placements 2027", target: ["Consulting", "Product Management"], firms: "Strategy consulting firms, Associate Product Manager roles at consumer-tech companies",
  college: "Westbrook Institute of Management", degree: "MBA", spec: "Marketing and Analytics", batch: "2027", ug: "B.Tech, Mechanical Engineering", ugCollege: "Sample College of Engineering, Pune, 2023",
  exp: "2 years", industry: "Automotive manufacturing", company: "", role: "",
  work: [{ company: "Orbit Motors", role: "Graduate Engineer Trainee", period: "Jul 2023 to Jun 2025", note: "Reduced rework on an assembly line by redesigning the inspection checklist." }],
  interns: [{ company: "Skyline Advisory", role: "Summer Intern, Strategy", period: "Apr to Jun 2026", note: "Market-entry study for an FMCG client across three cities." }],
};
const SUB = { plan: "Pro", status: "Free trial", started: "18 Oct 2026", trialEnds: "1 Nov 2026", daysLeft: 12, price: "₹499 a month", nextCharge: "1 Nov 2026", sessions: 8, cases: 14, history: [["18 Oct 2026", "Pro free trial started", "₹0", "Paid"]] };

export default function PrepLeet() {
  const [authed, setAuthed] = useState(false);
  const [pub, setPub] = useState("home");
  const [login, setLogin] = useState(null);
  const [panel, setPanel] = useState("main");
  const [pc, setPc] = useState({ type: "Guesstimate", track: "consulting", from: "main" });
  const [view, setView] = useState({ k: "dash" });
  const [stat, setStat] = useState(INIT_STAT);
  const [marks, setMarks] = useState({ c4: true, c15: true });
  const [reads, setReads] = useState({ "g-approach": true });
  const [prof, setProf] = useState(PROFILE0);
  const [sess, setSess] = useState(null);
  const [msg, setMsg] = useState("");
  const tRef = useRef(null);
  const toast = m => { if (!m) return; setMsg(m); clearTimeout(tRef.current); tRef.current = setTimeout(() => setMsg(""), 2000); };
  const go = (p, v, c) => { setPanel(p); setView(v); if (c) setPc(c); };
  const ctx = {
    authed, stat, marks, reads, prof, setProf, sub: SUB, user: prof.name.split(" ")[0], toast,
    toggleMark: id => authed ? setMarks(m => ({ ...m, [id]: !m[id] })) : setLogin("signup"),
    toggleRead: id => setReads(r => ({ ...r, [id]: !r[id] })),
    openCase: c => go(panel === "community" ? "main" : panel, { k: "case", id: c.id, back: view }),
    startSession: c => { setSess(c); setStat(s => s[c.id] === "done" ? s : { ...s, [c.id]: "prog" }); },
    signOut: () => { setAuthed(false); setPub("home"); setPanel("main"); setView({ k: "dash" }); },
  };
  return (
    <Ctx.Provider value={ctx}>
      <div className="pl"><style>{CSS}</style>
        {!authed ? <Public pub={pub} setPub={setPub} openLogin={m => setLogin(m || "signup")} /> : <AppShell panel={panel} view={view} go={go} pc={pc} />}
        {login && !authed && <LoginModal mode={login} setMode={setLogin} onClose={() => setLogin(null)} onDone={() => { setAuthed(true); setLogin(null); go("main", { k: "dash" }); }} />}
        {sess && <Session c={sess} onExit={d => { if (d) setStat(s => ({ ...s, [sess.id]: "done" })); setSess(null); }} />}
        {msg && <div className="toast" role="status">{msg}</div>}
      </div>
    </Ctx.Provider>
  );
}
