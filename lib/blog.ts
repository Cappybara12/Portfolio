export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "img"; src: string; alt: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  readingTime: string;
  tags: string[];
  coverImage: string;
  sections: { heading: string; blocks: BlogBlock[] }[];
};

const IMG_DIR = "/blog/i-gave-a-local-ai-a-memory-of-my-codebase";
const IMG_DIR_2 = "/blog/prediction-market-bot-scam-explained";
const IMG_DIR_3 = "/blog/virality-is-the-product";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "i-gave-a-local-ai-a-memory-of-my-codebase",
    title: "I gave a local AI a memory of my codebase — here's what actually happened",
    description:
      "I ran codebase-memory-mcp against my own project for a weekend, comparing a blind AI agent to one grounded in a real code graph — and caught it lying about dead code too.",
    date: "2026-06-28",
    readingTime: "9 min read",
    tags: ["ai", "developer-tools", "mcp", "local-llm"],
    coverImage: `${IMG_DIR}/cover.gif`,
    sections: [
      {
        heading: "how I stumbled onto this",
        blocks: [
          {
            type: "p",
            text: "I came across an open-source project called codebase-memory-mcp while scrolling through GitHub one evening, and I found it quite interesting to build something out over a weekend.",
          },
          {
            type: "p",
            text: "The idea behind it is almost stupidly simple: take your entire codebase and turn it into a graph — every function, every file, every connection between them — so that an AI working on your code can actually look things up instead of quietly guessing and hoping it's right.",
          },
          {
            type: "p",
            text: "I'd hit that exact problem days earlier on a real project of mine. I was about to rename a function and had that small, familiar pause every developer knows: wait, what else in this codebase actually calls this thing?",
          },
          {
            type: "p",
            text: "So rather than just trusting whatever an AI tool told me, I spent a weekend testing it properly. Not a thought experiment, not a \"this could work\" post — I actually ran it against my own code, watched what it got right, and watched it get one thing flat-out wrong too. This is that story.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/graph-overview.webp`,
            alt: "codebase-memory-mcp graph view of a real project, 254 nodes and 469 edges",
            caption: "the actual codebase graph, before any AI touched it",
          },
        ],
      },
      {
        heading: "what codebase-memory-mcp actually does",
        blocks: [
          {
            type: "p",
            text: "This is what my actual codebase looks like once it's been turned into a graph. Every dot here is a real function, file, or component from my project.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/graph-zoom-tooltip.webp`,
            alt: "zoomed graph view with a module tooltip over components/context/JsonTree.tsx",
          },
          {
            type: "p",
            text: "The tool doing this, codebase-memory-mcp, doesn't have any AI inside it at all — and that's honestly the part I found most interesting once I understood it.",
          },
          {
            type: "p",
            text: "It parses your code the same way real editors do under the hood, using tree-sitter, and builds a structural map of your project: pure analysis, zero guessing, zero API key required.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/graph-zoomed-files.webp`,
            alt: "zoomed graph view showing individual files and their connections in my project",
          },
          {
            type: "p",
            text: "The AI only enters the picture once you connect an agent to query that map. In my case, that agent was a small but all-hail open source model called Qwen2.5, running entirely on my own laptop through Ollama, with no internet connection involved.",
          },
        ],
      },
      {
        heading: "the blind vs. grounded test",
        blocks: [
          {
            type: "p",
            text: "So here's what I actually wanted to know going in: does handing an AI real facts about a codebase actually change its answers, or is that just a nice story people tell?",
          },
          {
            type: "p",
            text: "I set up a fair test to find out — the same model, given the same task, run twice. The first time, blind: it only sees the one file where a function is defined, nothing else. The second time, grounded: it's handed the real list of callers straight from the graph before it answers.",
          },
          {
            type: "p",
            text: "The function I picked was a real callback in my code called onStateChange, which genuinely gets called from four different places in one file, lib/ws-machine.ts. I'd already confirmed that with the graph itself before running the test, so I knew exactly what the correct answer looked like.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/blind-vs-grounded-terminal.webp`,
            alt: "terminal output comparing the blind agent's answer to the grounded agent's answer for onStateChange",
          },
          {
            type: "p",
            text: "The blind agent's answer was short and, frankly, wrong in the way I expected: it pointed only at the file where the function is defined and stopped there, completely missing the file with all four real usages — which makes sense, because it had no way of knowing that file existed.",
          },
          {
            type: "p",
            text: "The grounded agent, given the real caller list first, named all four functions correctly and even pointed out that the definition file itself needed a small update too. Same brain, same weights, same everything — the only thing that changed between those two runs was whether it had real facts in front of it before answering. That gap is, as far as I'm concerned, the entire reason this is worth writing about.",
          },
        ],
      },
      {
        heading: "letting the model decide for itself",
        blocks: [
          {
            type: "p",
            text: "That comparison was useful, but it still involved me handing the model its facts on a plate. What I actually wanted to see was whether it would go looking for those facts on its own, without being told to.",
          },
          {
            type: "p",
            text: "So I built a second version of the test where the model gets a task and exactly one tool it's allowed to use, if it decides it needs to — a function that queries the real graph for the callers of whatever it's asked about. I gave it this instruction: change the signature of a function called highlightTarget, but find out exactly who calls it first, don't guess. And then I just let it run.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/agent-tool-call-live.webp`,
            alt: "terminal output of the agent deciding on its own to call get_callers before answering",
          },
          {
            type: "p",
            text: "What you're looking at there is the model deciding, entirely on its own, to call that tool before answering anything. Nobody forced it — it read \"don't guess\" and acted on it. The query that follows isn't the AI talking, that's the script genuinely hitting the real knowledge graph of my project and getting back two real results. And the final answer it gives is built only from what it just checked, not from a confident-sounding guess.",
          },
        ],
      },
      {
        heading: "verifying with a plain grep",
        blocks: [
          {
            type: "p",
            text: "I didn't want to just take the AI's word for any of this, so right after that run I did the most boring possible verification step: a plain grep, with no AI anywhere near it. Same two files, same call sites, found the old-fashioned way.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/grep-verification.webp`,
            alt: "terminal output of a plain grep confirming the same two call sites, with no AI involved",
          },
        ],
      },
      {
        heading: "where it broke: dead code detection",
        blocks: [
          {
            type: "p",
            text: "Once I'd seen it get things right, I got curious about where it would get things wrong, so I pushed it further and asked the graph to find dead code — functions sitting in the project that nothing calls anymore.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/dead-code-query.webp`,
            alt: "terminal output of the dead-code graph query returning several false positives",
          },
          {
            type: "p",
            text: "And this is the part of the weekend I think is actually more valuable than the success stories. Almost everything on that list is wrong. Components like ToolCallCard are rendered constantly as JSX elements, and functions like handleClick are wired up as event handlers passed through props — the graph's idea of \"called\" is a direct function-to-function call, and it simply doesn't understand JSX rendering or prop-passing as usage.",
          },
          {
            type: "p",
            text: "So it confidently reported a bunch of actively-used code as dead. That's a real limitation, not a knock against the tool, just something worth knowing before you trust any single output from it without checking — which, again, is the whole theme of this experiment.",
          },
        ],
      },
      {
        heading: "the one-command architecture summary",
        blocks: [
          {
            type: "p",
            text: "On a lighter note, one of the more genuinely useful things I tried was just asking for a full summary of my codebase's architecture in a single call, instead of clicking through dozens of files myself to understand how everything's laid out.",
          },
          {
            type: "img",
            src: `${IMG_DIR}/architecture-summary.webp`,
            alt: "terminal output of get_architecture summarizing 254 nodes and 469 edges across the codebase",
          },
          {
            type: "p",
            text: "Two hundred and fifty-four nodes, four hundred and sixty-nine edges, a clean breakdown of every language and structure in the project, all from one command. Small thing, but it's the kind of small thing that actually saves real time.",
          },
        ],
      },
      {
        heading: "so, was the ai even necessary?",
        blocks: [
          {
            type: "p",
            text: "Stepping back — was having an AI model in the loop at all actually worth it, or could I have just used the graph tool by itself and skipped the AI entirely?",
          },
          {
            type: "p",
            text: "I think the honest answer is yes, it was worth it, but for a narrower reason than I expected going in. The graph by itself is genuinely dumb infrastructure — to get anything useful out of it, you need to already know its exact query syntax and parameter names. Without an AI translating for you, you're the one converting a plain-English question like \"who calls this function\" into a structured query by hand, every single time.",
          },
          {
            type: "p",
            text: "What the model actually added wasn't intelligence about my code specifically — it was acting as a natural-language front end to real, ground-truth data, and crucially, knowing on its own when it didn't know something and needed to go check.",
          },
          {
            type: "p",
            text: "The mistakes I ran into weren't really the model's fault either — they were the underlying tool's blind spots around JSX and React patterns, which I still had to catch myself by actually reading the output instead of trusting it outright.",
          },
        ],
      },
      {
        heading: "the takeaway",
        blocks: [
          {
            type: "p",
            text: "If there's one thing I'd want someone to take from this, it's that an AI which checks before it speaks is a fundamentally different, more trustworthy kind of tool than one that just sounds confident — and that difference is something you can actually build and test yourself, on your own laptop, with nothing more than an open-source graph tool and a small local model.",
          },
          {
            type: "p",
            text: "That's a modest claim compared to a lot of what gets posted about AI coding tools these days, but it's one I can fully stand behind, because I watched it happen, end to end, on my own real code.",
          },
          {
            type: "p",
            text: "The tool I used throughout this is codebase-memory-mcp, built by DeusData, open source. The model was Qwen2.5, running locally through Ollama. So while it did break at some places, seeing the graph itself was beautiful — do experiment with it, you can definitely find a lot of interesting use cases.",
          },
        ],
      },
    ],
  },
  {
    slug: "prediction-market-bot-scam-explained",
    title: "$30 → Half a Million Overnight? The Prediction Market Bot Scam Explained",
    description:
      "Polymarket bots turning $30 into half a million overnight, autonomous agents printing money while you sleep — a technical breakdown of why these posts are a scam pattern, not a breakthrough.",
    date: "2026-07-05",
    readingTime: "10 min read",
    tags: ["ai", "claude", "scam-awareness", "prediction-markets"],
    coverImage: `${IMG_DIR_2}/cover.png`,
    sections: [
      {
        heading: "the pattern isn't even subtle anymore",
        blocks: [
          {
            type: "p",
            text: "You must have seen your feed flooded with these prediction market posts by now, right? Polymarket bots turning $30 into half a million overnight, \"autonomous agents\" printing money while you sleep, and the same kind of insane claims repeated again and again. Well, I'm honestly fed up with it, and you're probably starting to feel the same. So I tried to actually break this down, look past the hype, and understand what's really going on. And yeah, here's the reality of how this works and how these guys are actually operating.",
          },
          {
            type: "img",
            src: `${IMG_DIR_2}/actually-operating.gif`,
            alt: "screen recording of a prediction market bot scam post making outrageous profit claims",
          },
          {
            type: "p",
            text: "Winning rate is unbelievable! Same wallet. Same referral link. Same scam pattern.",
          },
          {
            type: "p",
            text: "Well, at this point the pattern is not even subtle anymore.",
          },
          {
            type: "p",
            text: "The article keeps changing its costume, but the machine underneath never changes. One day it is \"I lost my job.\" Another day it is \"I stayed up all night analyzing the bot.\" Before that, it was a step-by-step guide.",
          },
          {
            type: "p",
            text: "The emotional wrapper changes every time, but the core structure stays the same: a dramatic story, a huge money claim, a Telegram funnel, and a referral link designed to push people deeper into the same conversion loop.",
          },
          {
            type: "p",
            text: "That is not how genuine technical writing behaves. That is how bait content behaves.",
          },
          {
            type: "p",
            text: "And the biggest giveaway is that the article cannot even keep its own numbers straight. In one place it claims a 98% win rate. In another, it says 100.0%. It also talks about 33,950 trades as if that level of consistency were just normal. It is not.",
          },
          {
            type: "p",
            text: "When a post cannot reconcile its own headline with its body, the whole thing starts to look less like analysis and more like marketing with a technical costume on.",
          },
        ],
      },
      {
        heading: "the math is already suspicious",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_2}/math-already-suspicious.png`,
            alt: "tweet pointing out the article contradicts itself between a 100% win rate over 33,951 trades and a 98% win rate over 26,738 trades",
          },
          {
            type: "p",
            text: "A 100% win rate across 33,950 trades is not just \"impressive.\" It is the kind of claim that should make any serious reader stop immediately.",
          },
          {
            type: "p",
            text: "On binary contracts, every trade has a defined outcome. Markets move, spreads exist, execution slips happen, and liquidity changes. Even excellent systems lose sometimes. That is part of reality. So when a post presents near-perfect or perfect performance over tens of thousands of trades, the burden of proof becomes extremely high. The more extreme the claim, the more evidence it needs.",
          },
          {
            type: "p",
            text: "When the text itself then contradicts the claim by also saying 98%, you are not looking at robust proof. You are looking at a promotional narrative that is trying to sound precise without actually being precise. That is exactly the kind of story that gets recycled because it looks technical to casual readers while collapsing under any serious scrutiny.",
          },
        ],
      },
      {
        heading: "the referral funnel gives the game away",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_2}/referral-funnel-game-away.png`,
            alt: "tweet noting the wallet profile shown doesn't match the wallet address cited, and that the referral link means the author earns money if you sign up",
          },
          {
            type: "p",
            text: "The referral structure is another huge red flag.",
          },
          {
            type: "p",
            text: "You pointed out that the same network keeps rotating through ref-lunar, ref-start, ref-discov, and ref-join, while the long article also includes a separate ares.pro referral link. That means the article is not just trying to tell a story. It is trying to monetize attention in multiple layers at once. One funnel pulls people into Telegram. Another funnel monetizes the article itself. Same audience, same pitch, same destination, different code.",
          },
          {
            type: "p",
            text: "That is why these posts feel so polished and so repetitive at the same time. They are not meant to educate. They are meant to route trust into clicks.",
          },
        ],
      },
      {
        heading: "what claude can actually do",
        blocks: [
          {
            type: "p",
            text: "This is where the technical reality matters.",
          },
          {
            type: "p",
            text: "Claude is not an autonomous trader. Claude is a language model. That means it takes input, processes it, and generates output. It does not wake up by itself, it does not run continuously in the background, and it does not independently maintain a live market strategy unless a separate system is built around it.",
          },
          {
            type: "p",
            text: "In practical terms, Claude can: read text and summarize it, help generate code, reason about a strategy when you give it the data, assist a human in writing an automation script, explain trade logic, risk management, or system design.",
          },
          {
            type: "p",
            text: "That is useful. But it is not the same as having an always-on trading agent.",
          },
          {
            type: "p",
            text: "The article's claims go far beyond what the model itself can do. It says Claude ingested 10,000 wallets, cross-referenced win rates, built an autonomous agent, deployed it to trade real money, executed 94 trades overnight without human input, and turned $25 into $4,237 while the user slept. That sounds impressive until you separate the model from the actual software stack required to make any of that happen.",
          },
          {
            type: "p",
            text: "Claude can help write code for a bot. It cannot be the bot by itself.",
          },
        ],
      },
      {
        heading: "claude is stateless, and that matters",
        blocks: [
          {
            type: "p",
            text: "One of the most important technical facts here is that Claude is stateless between sessions.",
          },
          {
            type: "p",
            text: "That means the model does not automatically remember your conversation forever in the way a person does. Each call is a fresh inference event unless an external application is storing context and feeding it back in. In other words, Claude does not carry an internal little process in the background that keeps running after the chat window is closed.",
          },
          {
            type: "p",
            text: "This matters because the article frames Claude like a persistent operator: something that can observe wallets, monitor markets, make decisions, execute trades, and keep doing that while you sleep. But a language model does not do persistence on its own. Persistence comes from the surrounding system. You need a scheduler, an application server, stored state, API credentials, monitoring, logging, and execution logic. Without those, Claude is just generating text in response to prompts.",
          },
          {
            type: "p",
            text: "So when people say \"Claude did it,\" the technically honest version is usually: a human built a separate system, used Claude to help write or reason about parts of it, and then let that external system do the actual work.",
          },
          {
            type: "p",
            text: "That is a very different claim.",
          },
        ],
      },
      {
        heading: "why \"when you close the laptop, claude stops existing\" is basically the point",
        blocks: [
          {
            type: "p",
            text: "The article's framing is trying to make it sound like Claude is a persistent background trader. It is not.",
          },
          {
            type: "p",
            text: "If the setup is a local workflow on your laptop, then yes, once the laptop is closed or the process is terminated, the local runtime stops. No scheduler, no script, no open process, no execution. If Claude was only being used through an interactive chat session, then there is no autonomous market action happening at all. The session ends, and so does the activity.",
          },
          {
            type: "p",
            text: "Even in a cloud setup, the important distinction is still the same: Claude itself is not the always-on system. The always-on part would be your own code, hosted somewhere, repeatedly calling the model or using outputs from the model inside a separate orchestration loop. The model is one component. It is not the operating layer.",
          },
          {
            type: "p",
            text: "That is why these posts are so misleading. They collapse the entire stack into one magical word: Claude. But the real system, if it exists at all, would need a lot more than a chatbot.",
          },
        ],
      },
      {
        heading: "what a real autonomous trading stack would actually require",
        blocks: [
          {
            type: "p",
            text: "If someone genuinely wanted a system that trades without human intervention, they would need a full architecture, not a prompt.",
          },
          {
            type: "p",
            text: "At minimum, that means: a data ingestion layer to monitor prices, order books, event feeds, or wallet activity; a decision layer to evaluate signals and decide whether a trade is worth taking; an execution layer to place orders reliably through an API; a state store to remember positions, balances, and prior actions; a risk engine to enforce limits, stop-losses, exposure caps, and kill switches; a monitoring layer to alert on failures, stale data, rejected orders, and unexpected behavior; a secure secrets layer to protect private keys and API credentials; a scheduler or worker system to keep the process alive.",
          },
          {
            type: "p",
            text: "That is real automation. That is engineering.",
          },
          {
            type: "p",
            text: "A language model might help generate pieces of that system, but it is not the system. And if a post pretends the model alone performed every step end-to-end, that is a major credibility problem.",
          },
        ],
      },
      {
        heading: "why the \"i slept and made money\" angle is so effective",
        blocks: [
          {
            type: "p",
            text: "This kind of story works because it hits a psychological nerve.",
          },
          {
            type: "p",
            text: "People want to believe there is a shortcut. They want to believe that a clever prompt can replace all the hard work of building infrastructure, testing edge cases, and managing risk. So the article packages the fantasy in a friendly, conversational tone and sprinkles in enough technical language to sound plausible. That is exactly why the emotional wrapper matters so much.",
          },
          {
            type: "p",
            text: "The \"I lost my job\" version creates urgency. The \"I spent a sleepless night\" version creates obsession. The \"step-by-step guide\" version creates authority. But all of them are just different skins on the same funnel. The point is to keep the reader engaged long enough to click the link, trust the wallet story, and stop asking hard questions.",
          },
        ],
      },
      {
        heading: "the technical sleight of hand",
        blocks: [
          {
            type: "p",
            text: "The article also leans on terms that sound advanced without proving anything.",
          },
          {
            type: "p",
            text: "It talks about wallets, win rates, agents, deployment, overnight execution, and cross-referencing. Those are all real concepts. The issue is how they are stitched together. Real system design has clear boundaries: what is observed, what is computed, what is stored, what is executed, and what is automated. Promotional posts blur all those lines so the reader imagines a single magical workflow.",
          },
          {
            type: "p",
            text: "That is how technical-sounding hype works. It takes real vocabulary and uses it to hide missing implementation details.",
          },
          {
            type: "p",
            text: "If a bot allegedly traded overnight, then where is the orchestrator? Where is the execution log? Where is the error handling? Where are the failed requests, retries, or slippage reports? Where is the architecture? Where is the evidence that the claimed performance was not just a selectively framed result or a manipulated wallet pattern? The article does not answer those questions. It skips them because the answer would weaken the pitch.",
          },
        ],
      },
      {
        heading: "the wallet story is not proof by itself",
        blocks: [
          {
            type: "p",
            text: "A wallet can show activity. That does not automatically prove the story behind the activity.",
          },
          {
            type: "p",
            text: "A wallet can be controlled by one entity or many. It can be funded, cycled, split, or used in ways that create the appearance of performance without representing a clean trading edge. If someone claims a perfect or near-perfect win rate, the first question is not \"how do I copy this?\" The first question is \"what exactly is being measured, and what mechanism produced those numbers?\"",
          },
          {
            type: "p",
            text: "That is especially true when the article is also using the result to sell access through referral links. Once money-making content is tied to monetized links, the incentives are no longer neutral. The article is no longer just reporting a result. It is trying to extract value from the belief in that result.",
          },
        ],
      },
      {
        heading: "the real claude claim is much smaller",
        blocks: [
          {
            type: "p",
            text: "The believable version is simple.",
          },
          {
            type: "p",
            text: "Claude can help a person write a bot. Claude can help a person reason through trade logic. Claude can help generate code that fetches data, checks conditions, and places orders through external APIs. Claude can help debug failures and explain what went wrong.",
          },
          {
            type: "p",
            text: "That is real. That is useful. That is also a long way from \"Claude autonomously made thousands of dollars while you slept.\"",
          },
          {
            type: "p",
            text: "The article tries to erase the human and infrastructure work in the middle and replace it with a story about the model itself. That is the trick. It makes the output sound like a miracle so the reader forgets to ask who actually built, ran, monitored, funded, and controlled the system.",
          },
        ],
      },
      {
        heading: "why the whole thing should be treated as a scam pattern",
        blocks: [
          {
            type: "p",
            text: "Once you step back, the pattern is obvious.",
          },
          {
            type: "p",
            text: "The story changes, but the wallet stays the same. The angle changes, but the referral link stays the same. The numbers change, but the performance claim stays extreme. The technical language changes, but the missing proof stays missing.",
          },
          {
            type: "p",
            text: "That is why the right response is not fascination. It is skepticism.",
          },
          {
            type: "p",
            text: "A serious article would show architecture, logs, verification, and methodology. It would separate the model from the orchestration. It would explain where Claude ends and the external software begins. It would admit limits. It would not keep recycling the same funnel under different emotional headlines.",
          },
        ],
      },
      {
        heading: "bottom line",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_2}/bottom-line.png`,
            alt: "reddit post reacting skeptically to viral claims of Claude agents printing money on prediction markets",
          },
          {
            type: "p",
            text: "Scam, scam, scam! This is not a breakthrough story.",
          },
          {
            type: "p",
            text: "It is a monetized narrative built around exaggerated claims, inconsistent numbers, and a thin layer of technical language designed to make the pitch feel legitimate. The article's own contradictions already weaken it. The referral structure weakens it further. And the claims about Claude collapse once you look at the actual mechanics of how language models work.",
          },
          {
            type: "p",
            text: "Claude is a tool. Not a background trader. Not a self-running wallet monitor. Not a sleep-time money machine.",
          },
          {
            type: "p",
            text: "When the session ends, the model is not secretly watching markets on your behalf. When the laptop closes, there is no magical agent left behind. If something keeps trading, that is because a separate system was built, deployed, and maintained by a human.",
          },
          {
            type: "p",
            text: "So no, this is not some genius automation story.",
          },
          {
            type: "p",
            text: "It is the same old scam pattern, dressed up in AI language.",
          },
        ],
      },
    ],
  },
  {
    slug: "virality-is-the-product",
    title: "Virality Is the Product",
    description:
      "Why this decade rewards builders who can market as hard as they build — Cluely, Wispr Flow vs. Handy, and what happens after you actually go viral.",
    date: "2026-07-12",
    readingTime: "9 min read",
    tags: ["startups", "marketing", "gen-z", "growth"],
    coverImage: `${IMG_DIR_3}/cover.png`,
    sections: [
      {
        heading: "virality is the product",
        blocks: [
          {
            type: "p",
            text: "-roy lee, founder cluely- said every gen z founder ever.",
          },
          {
            type: "p",
            text: "And yes, I'd agree with that. Not all of Gen Z would, but I would. Here's why: everything you come across today is from the content people consume. In the previous age, the dot-com era, the height of the mobile decade, most products created value first, and customers followed. You built something, it worked, and people checked it out of curiosity or need.",
          },
          {
            type: "p",
            text: "Now the shift is different. I don't need three products. I need the one that solves something that didn't even exist as a problem yet. What if I attach it to my own existing infrastructure? What if I bring in my technical folks? What if I just build it myself, overnight, with a few friends in SF, and market it while I'm still building it?",
          },
          {
            type: "p",
            text: "I'll admit my bias here — one of the big reasons I believe this is because I'm part of Gen Z myself, and I've watched this shift happen in real time alongside the growth of AI.",
          },
        ],
      },
      {
        heading: "this decade is for builders. it's also for the ones who can market.",
        blocks: [
          {
            type: "p",
            text: "This decade is more fabricated for builders than any before it - but it doesn't only reward the people who can build. It rewards the ones who can build and the ones who can market well. You might have had a great idea. But could you market it? If not, that idea quietly dies while someone else gets a few friends together, builds it overnight, and talks about it the entire time — behind-the-scenes clips, research-stage conversations, the whole arc — so that by the time it's live, people already feel like they know it.",
          },
          {
            type: "p",
            text: "You already have consumers before you've even posted to the internet.",
          },
          {
            type: "p",
            text: "Your distribution? X, Insta and YouTube.",
          },
          {
            type: "img",
            src: `${IMG_DIR_3}/distribution-x-insta-youtube.png`,
            alt: "photo captioned '26 y/o founder' on a rooftop with friends, San Francisco startup culture",
          },
          {
            type: "p",
            text: "That's where the growth team comes in. With a team of growth people standing next to your engineers, you get people who understand the tech but also understand how to make it trend. They're not pure tech nerds. They understand what the current age of marketing actually looks like.",
          },
          {
            type: "p",
            text: "Here's the part most people miss: previously, if you were B2C, you had to be better at something. You needed people who could talk about it well. Now you just need one smart person on your team who looks good, talks well on camera, and lives on socials twenty-four seven. Because everyone out there believes they can build it - \"I can build it, I can build it over a weekend.\" So the real question becomes: what did you do differently?",
          },
          {
            type: "p",
            text: "You find people, get your friends talking about you, get impressions on Twitter, get it discussed on Reddit - by someone who genuinely came across the post on Twitter for the first time, not even aware you're the one behind it.",
          },
          {
            type: "p",
            text: "Then you make a video about that: how you posted on Twitter, got ten thousand impressions, and the loop continues. It's a CIRCLE.",
          },
        ],
      },
      {
        heading: "founder's face value = brand's face value",
        blocks: [
          {
            type: "p",
            text: "the growth of a founder's personal brand is directly proportional to the growth of their startup. If a founder becomes the face of the product, people learn about the company through that person, and that's the advantage. You're no longer \"a startup that appeared overnight.\" You have a personality attached to it.",
          },
          {
            type: "p",
            text: "If you're steadily posting in a niche on LinkedIn or elsewhere, you grow - impressions, followers, all of that. But the moment you show up as a service, as someone people can turn to, that's when people turn toward you and your product. That's the requirement of this era: get people to turn their heads, get reposts, get comments, while your actual product is quietly being checked out in the background. People might even criticize you early - but criticism is still promotion. And somewhere in the noise, a VC notices that this person knows how to market.",
          },
        ],
      },
      {
        heading: "okay, you went viral. now what?",
        blocks: [
          {
            type: "p",
            text: "Here's the trap: most people who land on a viral post get taken to a page that has nothing for them to actually see. So before any of this works, your product has to be standing somewhere real - documentation, a blog, maybe a post tied to a trending technology you're already experimenting with your product (something like OpenClaw, the open-source agent framework that's been moving fast), and enough ways for someone to actually connect with you.",
          },
          {
            type: "p",
            text: "The point is to vary the hooks — give people more than one reason to lean in. Maybe it's social proof: great companies already using your product. Maybe it's the trending tech you've built on top of. Maybe it's something else entirely. It doesn't matter what — it matters that there's more than one doorway in. And your growth and content team should already know which blog post or thread is performing well, so they can turn around and build a video off it the same day.",
          },
        ],
      },
      {
        heading: "case study: cluely",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_3}/case-study-cluely.png`,
            alt: "TechCrunch article about Cluely founder Roy Lee's Y Combinator rejection party invitation video",
          },
          {
            type: "p",
            text: "For Gen Z, one of the cleanest examples of this is Chungin \"Roy\" Lee, founder of Cluely.",
          },
          {
            type: "p",
            text: "He was suspended from Columbia after building an early tool - then called Interview Coder - that let people \"cheat\" through technical interviews undetected. That's what got him noticed.",
          },
          {
            type: "p",
            text: "He knew how to market the controversy, the growth, the whole arc, and that's exactly what pulled marketers and investors in. You never know when you'll end up with users who were already looking for your product before you even officially launched it.",
          },
          {
            type: "p",
            text: "From a thrown-out student who marketed it right. Got money, which half of the Columbia University folks won't see — and most importantly, has the face.",
          },
          {
            type: "p",
            text: "You might think Cluely's already dead as a startup. It's not. It got funded small at first, $5.3M in seed - and has been built quietly with the team ever since, after they'd already earned trust with their audience. A Series A followed, $15M, led by a16z. Whenever they ship a version two, the eyes are already there, waiting. That's the entire asset in this era: attention that's already pointed at you.",
          },
        ],
      },
      {
        heading: "founder talk vs. founder silence",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_3}/founder-talk-vs-silence.png`,
            alt: "founder on camera making a product announcement video",
          },
          {
            type: "p",
            text: "Tanay Kothari, founder Wispr AI — try this comparison: WisprFlow.ai, founded by Tanay Kothari. It's an AI dictation tool — I've used one myself, in fact, for drafting parts of this exact piece. Not only that — I was even able to build one for myself (yes, over a weekend, and I had something close to 70 percent as good). Kothari talked about it constantly. Went on podcasts, posted his journey, made the founder story part of the product story. Wispr Flow has raised over a whopping $50 million.",
          },
          {
            type: "p",
            text: "Now compare that to Handy — a free, open-source dictation app built by a developer named CJ Pais, who started building it after an injury made typing painful for him. It works almost exactly the same as Wispr Flow, save for a few minor, negligible latency differences.",
          },
          {
            type: "p",
            text: "Handy - best tool open source has given me",
          },
          {
            type: "img",
            src: `${IMG_DIR_3}/handy-open-source-tool.png`,
            alt: "Handy, the free and open-source speak-into-any-text-field app",
          },
          {
            type: "p",
            text: "It has real traction — tens of thousands of GitHub stars, a strong Product Hunt rating — but almost no one outside developer circles knows who built it, because nobody was out there talking about it the way Kothari was about Wispr Flow.",
          },
          {
            type: "p",
            text: "Same category. Same core function. Wildly different visibility. That's the whole argument in one comparison: you can build something just as good, and still lose the attention war entirely.",
          },
          {
            type: "p",
            text: "(Side example worth a mention here: someone like mixwithmandy - content creator and ZEPTO CSO, built around mixing cocktails and getting the best beers on a ₹5,000 budget - works the same playbook on a completely different niche. The niche-and-budget framing is what makes the content sticky regardless. He works as zepto CSO (a very big fast-commerce solution in india), talks about beers but never mentions zepto, but shows himself — that this guy knows how to sell and be in front of the camera.)",
          },
          {
            type: "p",
            text: "So make sure you're grabbing a pen and paper here. Two things matter: a founder who can actually talk, and a growth team that knows what's worth talking about.",
          },
        ],
      },
      {
        heading: "you can overengineer. you can't overmarket.",
        blocks: [
          {
            type: "p",
            text: "Here's what I've taken from this entire age of AI: you can build fast, but you can never overmarket a product. You can overengineer a product — that's a real failure mode - but you can't overmarket one.",
          },
          {
            type: "p",
            text: "I've worked in developer relations at two companies that crossed $3M+ in ARR, alongside time at Silicon Valley startups, and one thing has always been clear: if you're B2B with a niche idea, you know exactly who to target, and you can follow a fairly contained playbook.",
          },
          {
            type: "p",
            text: "But B2C is a different beast entirely. You need more surface area — more variety, more trend-awareness, more of your team functioning as an extension of the product itself.",
          },
        ],
      },
      {
        heading: "stay edible; don't burn socials out.. or maybe?",
        blocks: [
          {
            type: "img",
            src: `${IMG_DIR_3}/linkedin-lunatics-katie-chen.png`,
            alt: "r/LinkedInLunatics reddit post about Katie Chen going viral, reposted by Katie Chen herself",
          },
          {
            type: "p",
            text: "Last section. Don't overdo it.",
          },
          {
            type: "p",
            text: "There's a real category of people on LinkedIn and elsewhere trying very hard to go viral, even while holding down full-time jobs. I call them LinkedIn lunatics. And honestly, even for them, it's fine. It's a spectrum.",
          },
          {
            type: "p",
            text: "I'd still take a chat with some of them at a tech conference, even the more \"out there\" ones. There's an engineer I follow whose tone is a bit informal, a bit much for some, but I'd genuinely want to sit down with her and ask what she's working on, what she's testing. She's built more reach than I have, in less time than I've put in. There's something to learn there, even from the over-the-top version of this.",
          },
          {
            type: "p",
            text: "Katie Chen went viral on X for hosting an \"ABG/ABB maxxing\" event in San Francisco, a makeup meetup, nothing to do with tech at all — and pulled over a million views on that single post (144 comments, 164 reposts, 317 likes at last count). That's the other half of this lesson: virality doesn't always come from staying in your lane. Sometimes the lane you didn't expect is the one that gets the eyes — and the eyes are the only thing a product ever actually wants.",
          },
          {
            type: "p",
            text: "ALL LUNATICS KNOW VIRALITY .. they know how to think unhinged and find themselves among gen z needs of \"oh, this would be a good addition to my auto-pay of the month\"",
          },
          {
            type: "p",
            text: "You can cook. Just don't burn it.",
          },
          {
            type: "p",
            text: "I can keep talking, but next up is how this isn't just an individual-founder phenomenon anymore; how entire organisations are now running the same playbook.",
          },
          {
            type: "p",
            text: "Follow :)",
          },
        ],
      },
    ],
  },
];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
