// hashtags.js — Hashtag sets and assembly logic

const HASHTAGS = {
  core: ["#HomeDog", "#HomeDogsOfDenver", "#DogFriendlyDenver"],

  location: [
    "#SoBoDenver", "#PlattPark", "#SouthBroadwayDenver",
    "#DenverDogLife", "#DenverDogs", "#DenverDogCommunity",
    "#DogFriendlyCoworking", "#DenverCoworking", "#DenverLocal"
  ],

  service: [
    "#DogDaycareDenver", "#DogBoardingDenver", "#CoworkWithYourDog",
    "#DogFriendlyCafe", "#DogFriendlyBar", "#DogFriendlyEvents"
  ],

  engagement: [
    "#DogsOfInstagram", "#DogLife", "#DogMom", "#DogDad",
    "#DogCommunity", "#GoodBoy", "#GoodGirl", "#WhoRescuedWho"
  ],

  eventSpecific: {
    "puppy-yoga": ["#PuppyYoga", "#PawsAndFlow", "#DogYoga"],
    "vendor-market": ["#DenverPopUp", "#LocalVendors", "#DogMarket"],
    "adoption": ["#AdoptDontShop", "#RescueDog", "#DenverRescue"],
    "private-party": ["#DenverEventVenue", "#DogFriendlyVenue", "#PrivateEvents"],
    "coworking-promo": ["#CoworkWithYourDog", "#DogFriendlyCoworking", "#DenverCoworking"],
    "run-club": ["#RunClub", "#DogRunClub", "#DenverRunClub"],
    "record-club": ["#VinylNight", "#RecordClub", "#DenverMusic"],
    "singles-night": ["#DogPeopleMeetDogPeople", "#SinglesNight", "#DenverSingles"],
    "concert": ["#LiveMusicDenver", "#DogFriendlyConcert"],
    "general": []
  }
};

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function assembleHashtags(platform, eventType, customHashtags = "") {
  let tags = [...HASHTAGS.core];
  const eventTags = HASHTAGS.eventSpecific[eventType] || [];
  tags.push(...eventTags);

  const limits = {
    instagram: { location: 4, service: 2, engagement: 3, total: 15 },
    facebook: { location: 1, service: 1, engagement: 1, total: 5 },
    tiktok: { location: 2, service: 1, engagement: 2, total: 8 },
    eventbrite: { location: 1, service: 1, engagement: 0, total: 5 },
  };

  const lim = limits[platform] || limits.instagram;
  tags.push(...shuffleArray(HASHTAGS.location).slice(0, lim.location));
  tags.push(...shuffleArray(HASHTAGS.service).slice(0, lim.service));
  tags.push(...shuffleArray(HASHTAGS.engagement).slice(0, lim.engagement));

  if (customHashtags.trim()) {
    const custom = customHashtags.split(/[\s,]+/).map(t => t.startsWith("#") ? t : `#${t}`);
    tags.push(...custom);
  }

  // Deduplicate and limit
  const unique = [...new Set(tags)];
  return unique.slice(0, lim.total);
}

export { HASHTAGS, assembleHashtags };
