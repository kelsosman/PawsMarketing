// generator.js — Content generation engine
import { HOOKS, BODIES, CTAS, EVENTBRITE_BOILERPLATE, getRandomItem, fillTemplate, formatDateDisplay, getDayOfWeek } from './templates.js';
import { assembleHashtags } from './hashtags.js';
import THEME from './theme.js';

function parseRawNotes(notes) {
  const parsed = { description: notes };
  if (!notes) return parsed;

  // Extract dates: "March 22", "3/22", "Mar 22", "2026-03-22"
  const datePatterns = [
    /(\d{4}-\d{2}-\d{2})/,
    /(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)/,
    /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{1,2}(?:,?\s*\d{4})?)/i,
  ];
  for (const pat of datePatterns) {
    const m = notes.match(pat);
    if (m) { parsed.dateRaw = m[1]; break; }
  }

  // Extract times: "10am", "6:00 PM", "10-2", "10am-2pm"
  const timeMatch = notes.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)(?:\s*-\s*\d{1,2}(?::\d{2})?\s*(?:am|pm))?)/i);
  if (timeMatch) parsed.time = timeMatch[1];

  // Extract prices: "$15", "free", "free for members / $15"
  const priceMatch = notes.match(/(\$\d+(?:\.\d{2})?(?:\s*[-\/]\s*\$?\d+(?:\.\d{2})?)?|free(?:\s+for\s+\w+)?(?:\s*[\/,]\s*\$\d+[^.\n]*)?)/i);
  if (priceMatch) parsed.price = priceMatch[1];

  // Extract partner: "with [Name]", "featuring [Name]", "collab with [Name]", "hosted by [Name]"
  const partnerMatch = notes.match(/(?:with|featuring|feat\.?|collab(?:oration)?\s+with|hosted\s+by|partnering\s+with|presented\s+by)\s+([A-Z][A-Za-z\s'&]+)/);
  if (partnerMatch) parsed.partner = partnerMatch[1].trim();

  // Event name: first line if it looks like a title (not a date/time/price)
  const firstLine = notes.split("\n")[0].trim();
  if (firstLine && firstLine.length < 80 && !/^\d|^\$|^free/i.test(firstLine)) {
    parsed.eventName = firstLine;
  }

  return parsed;
}

function generateContent(formData) {
  const {
    contentType, eventType, platforms, rawNotes,
    eventName, date, time, price, partner, audience,
    customHashtags, toneOverride, imageDescription,
    isPaid, campaignGoal
  } = formData;

  // Parse raw notes for any missing structured data
  const parsed = parseRawNotes(rawNotes);

  // Build unified data object (structured fields override parsed)
  const data = {
    eventName: eventName || parsed.eventName || "",
    date: date ? formatDateDisplay(date) : (parsed.dateRaw || ""),
    dayOfWeek: date ? getDayOfWeek(date) : "",
    time: time || parsed.time || "",
    price: price || parsed.price || "",
    partner: partner || parsed.partner || "",
    audience: audience || "",
    description: rawNotes || parsed.description || "",
  };

  // Determine template key
  let templateKey = eventType || "general";
  if (contentType === "daily") templateKey = "daily";
  if (contentType === "promo") templateKey = "coworking-promo";

  const results = {};

  for (const platform of platforms) {
    if (platform === "ad-copy") {
      results["ad-copy"] = generateAdCopy(data, campaignGoal, templateKey);
      continue;
    }

    const hookPool = HOOKS[templateKey] || HOOKS["general"];
    const hook = getRandomItem(hookPool);
    const bodyTemplate = BODIES[templateKey] || BODIES["general"];
    const body = fillTemplate(bodyTemplate, data);

    if (platform === "instagram") {
      const cta = getRandomItem(CTAS.instagram);
      const hashtags = assembleHashtags("instagram", templateKey, customHashtags);
      results.instagram = {
        text: `${hook}\n\n${body}\n\n${cta}`,
        hashtags: hashtags.join(" "),
        charCount: `${hook}\n\n${body}\n\n${cta}`.length,
      };
    }

    if (platform === "story") {
      const storyLine1 = hook.replace(/[🐶🧘🐕🛍️🐾❤️🎉💻🎶]/g, "").trim().substring(0, 40);
      const storyLine2 = data.date && data.time ? `${data.date} • ${data.time}` : (data.date || data.time || "");
      const storyLine3 = getRandomItem(CTAS.story);
      results.story = {
        line1: storyLine1,
        line2: storyLine2,
        line3: storyLine3,
      };
    }

    if (platform === "facebook") {
      const cta = getRandomItem(CTAS.facebook);
      const hashtags = assembleHashtags("facebook", templateKey, customHashtags);
      results.facebook = {
        text: `${hook}\n\n${body}\n\n${cta}`,
        hashtags: hashtags.join(" "),
      };
    }

    if (platform === "tiktok") {
      const cta = getRandomItem(CTAS.tiktok);
      const hashtags = assembleHashtags("tiktok", templateKey, customHashtags);
      const shortBody = body.split(".").slice(0, 2).join(".") + ".";
      const fullText = `${hook} ${shortBody} ${cta}`;
      results.tiktok = {
        text: fullText,
        hashtags: hashtags.join(" "),
        charCount: fullText.length,
      };
    }

    if (platform === "eventbrite") {
      const hashtags = assembleHashtags("eventbrite", templateKey, customHashtags);
      const title = data.eventName || `${templateKey.replace(/-/g, " ")} at HomeDog`;
      results.eventbrite = {
        title: title,
        shortDesc: body.split(".").slice(0, 2).join(".") + ".",
        fullDesc: `${body}\n\n📍 HomeDog — ${THEME.address}\n\n${EVENTBRITE_BOILERPLATE}`,
        tags: hashtags.map(t => t.replace("#", "")).join(", "),
      };
    }
  }

  return results;
}

function generateAdCopy(data, campaignGoal, templateKey) {
  const goalMessages = {
    awareness: { focus: "discover", action: "Learn More" },
    signups: { focus: "join", action: "Sign Up" },
    memberships: { focus: "become a member", action: "Get Started" },
    traffic: { focus: "visit", action: "Learn More" },
  };
  const goal = goalMessages[campaignGoal] || goalMessages.awareness;

  const hookPool = HOOKS[templateKey] || HOOKS["general"];

  // Meta Ads — 3 variants
  const meta = [];
  for (let i = 0; i < 3; i++) {
    const hook = getRandomItem(hookPool);
    meta.push({
      primaryText: `${hook} ${data.eventName ? data.eventName + " at HomeDog." : "Come see what HomeDog is all about."} ${data.date || ""}`.trim().substring(0, 250),
      headline: `${data.eventName || "HomeDog Denver"}`.substring(0, 40),
      description: "Dog-friendly social hub in Denver".substring(0, 30),
      cta: goal.action,
    });
  }

  // Google Ads
  const google = {
    headlines: [
      `${data.eventName || "HomeDog Denver"}`.substring(0, 30),
      "Dog-Friendly Coworking & Cafe".substring(0, 30),
      `${data.price ? data.price + " " : ""}${goal.action}`.substring(0, 30),
    ],
    descriptions: [
      `Denver's dog-friendly social hub. Coworking, daycare, cafe & bar, community events. ${goal.action} today!`.substring(0, 90),
      `Bring your pup to work, play, and hang. Memberships from $95/mo. ${THEME.address.split(",")[0]}.`.substring(0, 90),
    ],
    displayPath: "thehomedog.co/events",
  };

  // TikTok Ads — 3 variants
  const tiktok = [];
  for (let i = 0; i < 3; i++) {
    const hook = getRandomItem(hookPool);
    tiktok.push({
      text: `${hook} ${data.eventName ? data.eventName + "." : ""} ${data.date || ""}`.trim().substring(0, 100),
      cta: goal.action,
    });
  }

  return { meta, google, tiktok };
}

export { generateContent, parseRawNotes };
