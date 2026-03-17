// templates.js — All content templates, hooks, CTAs, and boilerplate
import THEME from './theme.js';

const HOOKS = {
  "puppy-yoga": [
    "Downward dog just got a whole lot cuter 🐶",
    "Stretch, snuggle, repeat. Puppy Yoga is BACK!",
    "Your mat. A pile of puppies. Need we say more?",
    "Namaste with a side of puppy kisses 🧘",
    "The only yoga class where drool is encouraged.",
  ],
  "vendor-market": [
    "Shop local, pet dogs. Best Saturday ever? 🐕",
    "The HomeDog Collective is back with your favorite local vendors!",
    "Good vibes, good vendors, good boys.",
    "Local finds + four-legged friends = perfect day 🛍️",
  ],
  "adoption": [
    "Your new best friend might be waiting for you 🐾",
    "Come for the coffee, stay for the puppy kisses.",
    "Every dog deserves a home. Meet your match at HomeDog.",
    "Adopt, don't shop — and grab a latte while you're at it ❤️",
  ],
  "private-party": [
    "Your next event just got a serious upgrade 🎉",
    "Dog-friendly. Art-forward. Unforgettable.",
    "Private parties at HomeDog = the venue your guests won't stop talking about.",
    "Book the coolest venue on South Broadway.",
  ],
  "coworking-promo": [
    "Work from home... but make it HomeDog 💻",
    "Your dog called. They want you to try HomeDog coworking.",
    "WiFi. Espresso. Your dog under the desk. No corporate vibes.",
    "The office your pup actually wants you to go to.",
  ],
  "run-club": [
    "Lace up, leash up. Run club is on!",
    "Miles are better with your pack 🐕",
    "Who needs a running buddy when you have a running pup?",
  ],
  "record-club": [
    "Crates, coffee, and canines. Vinyl night at HomeDog 🎶",
    "Spin records, pet dogs. The perfect evening.",
    "Good tunes. Good company. Good boys.",
  ],
  "singles-night": [
    "Dog people, meet dog people 🐾",
    "The icebreaker is built in — just pet the dog.",
    "Find your person. Or at least pet some dogs trying.",
  ],
  "concert": [
    "Live music hits different with a dog at your feet 🎶",
    "Grab a drink, grab a seat, bring your pup.",
    "Dog-friendly live music on South Broadway.",
  ],
  "general": [
    "Another day at Denver's favorite dog-friendly hangout 🐕",
    "This is what COmmunity looks like.",
    "Pups, people, and good vibes on South Broadway.",
    "Just another perfect day at HomeDog.",
  ],
  "daily": [
    "This is the vibe today at HomeDog 🐾",
    "Just a regular day in paradise.",
    "Scenes from your favorite second home.",
    "If you know, you know.",
  ],
};

const BODIES = {
  "puppy-yoga": "Join us {date} at {time} for Puppy Yoga at HomeDog! {partner_line}Roll out your mat surrounded by adorable rescue pups looking for their forever homes. {price_line}Spots fill up fast!",
  "vendor-market": "Join us {date} from {time} for {event_name}! {partner_line}Browse local vendors, grab a drink from our bar, and bring your pup along for the fun. {price_line}",
  "adoption": "We're teaming up with {partner_name} for an adoption event at HomeDog! {date} from {time}. Meet adoptable dogs, enjoy our cafe and bar, and maybe — just maybe — bring home a new family member. {price_line}",
  "private-party": "Looking for a one-of-a-kind venue? HomeDog's indoor/outdoor space with local art, a full bar, and dog-friendly vibes makes every event unforgettable. DM us or email {email} for booking details!",
  "coworking-promo": "Memberships start at $95/month and include unlimited coworking, daycare credits, and drink discounts. Or grab a $25 day pass and see what the hype is about.",
  "run-club": "Join the pack {date} at {time} for run club at HomeDog! {partner_line}All paces welcome — bring your pup and your best running shoes. {price_line}",
  "record-club": "Vinyl lovers, this one's for you. {event_name} at HomeDog — {date} at {time}. {partner_line}Bring your favorite records, grab a drink, and enjoy the vibes. {price_line}",
  "singles-night": "Dog people, meet your people. {event_name} at HomeDog — {date} at {time}. {partner_line}Mingle, sip, and let the pups be your wingmen. {price_line}",
  "concert": "Live music at HomeDog! {event_name} — {date} at {time}. {partner_line}Grab a local draft, bring your pup, and enjoy the show. {price_line}",
  "general": "{event_name} is happening at HomeDog! {date} {time_line}. {description} {partner_line}{price_line}",
  "daily": "{description}",
};

const CTAS = {
  instagram: [
    "Link in bio for details!",
    "Tag a friend who needs this 🐾",
    "Drop a 🐾 if you're coming!",
    "Save this post for later!",
    "See you there!",
    "Swing by — you (and your pup) are always welcome.",
  ],
  facebook: [
    "Tag a friend and make it a date!",
    "Share this with your dog-loving crew!",
    "RSVP and we'll see you there.",
    "More details at thehomedog.co",
    "Swing by — everyone's welcome.",
  ],
  tiktok: [
    "Link in bio!",
    "Who's coming? 🐾",
    "POV: your dog's new favorite hangout",
    "Tell a friend, bring a pup.",
  ],
  story: [
    "Swipe up!",
    "Tap for details",
    "See you there!",
    "Link in bio",
    "Don't miss this!",
  ],
};

const EVENTBRITE_BOILERPLATE = THEME.boilerplate;

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function fillTemplate(template, data) {
  let result = template;
  const replacements = {
    "{date}": data.date || "[date TBD]",
    "{time}": data.time || "[time TBD]",
    "{time_line}": data.time ? `at ${data.time}` : "",
    "{event_name}": data.eventName || "Our next event",
    "{partner_name}": data.partner || "",
    "{partner_line}": data.partner ? `In partnership with ${data.partner}. ` : "",
    "{price_line}": formatPrice(data.price),
    "{description}": data.description || "",
    "{email}": THEME.email,
    "{cta}": "",
    "{day_of_week}": data.dayOfWeek || "",
  };

  for (const [key, val] of Object.entries(replacements)) {
    result = result.replaceAll(key, val);
  }
  // Clean up double spaces and trailing spaces
  result = result.replace(/  +/g, " ").trim();
  return result;
}

function formatPrice(price) {
  if (!price || price.toLowerCase() === "free") return "Free to attend! ";
  if (price.toLowerCase().includes("free")) return `${price}. `;
  return `${price}. `;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    const options = { weekday: "long", month: "long", day: "numeric" };
    return d.toLocaleDateString("en-US", options);
  } catch {
    return dateStr;
  }
}

function getDayOfWeek(dateStr) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long" });
  } catch {
    return "";
  }
}

export { HOOKS, BODIES, CTAS, EVENTBRITE_BOILERPLATE, getRandomItem, fillTemplate, formatDateDisplay, getDayOfWeek };
