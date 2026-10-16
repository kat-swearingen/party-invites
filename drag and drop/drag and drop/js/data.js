/**
 * Party Data, 12-Month Calendar, & Character Roles
 * Victorian Parlour Gathering format with passed savouries provided.
 * Archetype-based roles (no emojis, pure Victorian typography).
 */

const ANNUAL_CALENDAR = [
  {
    monthIndex: 0,
    monthName: "October",
    year: "2026",
    status: "active",
    themeId: "midnight-manor",
    eventTitle: "Murder Mystery Dinner",
    subtitle: "Click to see more",
    format: "Cocktail Party & Passed Savouries",
    envelopeStyle: "navy-active",
    sealText: "KS",
    releaseDate: "Invitations Open Now"
  },
  {
    monthIndex: 1,
    monthName: "November",
    year: "2026",
    status: "locked",
    themeId: "november-gathering",
    eventTitle: "Autumn Dinner & Cocktails",
    subtitle: "Classified • Gathering No. 2",
    format: "Dinner & Libations",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Nov 1"
  },
  {
    monthIndex: 2,
    monthName: "December",
    year: "2026",
    status: "locked",
    themeId: "december-gathering",
    eventTitle: "Holiday Dinner & Cocktails",
    subtitle: "Classified • Gathering No. 3",
    format: "Holiday Dinner & Festive Spirits",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Dec 1"
  },
  {
    monthIndex: 3,
    monthName: "January",
    year: "2027",
    status: "locked",
    themeId: "january-gathering",
    eventTitle: "Winter Dinner Gathering",
    subtitle: "Classified • Gathering No. 4",
    format: "Candlelight Dinner & Warm Spirits",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Jan 1"
  },
  {
    monthIndex: 4,
    monthName: "February",
    year: "2027",
    status: "locked",
    themeId: "february-gathering",
    eventTitle: "Late Winter Cocktail Soirée",
    subtitle: "Classified • Gathering No. 5",
    format: "Cocktails & Passed Savouries",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Feb 1"
  },
  {
    monthIndex: 5,
    monthName: "March",
    year: "2027",
    status: "locked",
    themeId: "march-gathering",
    eventTitle: "Spring Dinner Gathering",
    subtitle: "Classified • Gathering No. 6",
    format: "Seasonal Dinner & Wine",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Mar 1"
  },
  {
    monthIndex: 6,
    monthName: "April",
    year: "2027",
    status: "locked",
    themeId: "april-gathering",
    eventTitle: "Spring Cocktail Soirée",
    subtitle: "Classified • Gathering No. 7",
    format: "Cocktails & Canapés",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Apr 1"
  },
  {
    monthIndex: 7,
    monthName: "May",
    year: "2027",
    status: "locked",
    themeId: "may-gathering",
    eventTitle: "Early Summer Dinner",
    subtitle: "Classified • Gathering No. 8",
    format: "Dinner & Libations",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks May 1"
  },
  {
    monthIndex: 8,
    monthName: "June",
    year: "2027",
    status: "locked",
    themeId: "june-gathering",
    eventTitle: "Summer Solstice Cocktail Gathering",
    subtitle: "Classified • Gathering No. 9",
    format: "Garden Cocktails & Savouries",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Jun 1"
  },
  {
    monthIndex: 9,
    monthName: "July",
    year: "2027",
    status: "locked",
    themeId: "july-gathering",
    eventTitle: "Midsummer Dinner Gathering",
    subtitle: "Classified • Gathering No. 10",
    format: "Summer Dinner & Wine",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Jul 1"
  },
  {
    monthIndex: 10,
    monthName: "August",
    year: "2027",
    status: "locked",
    themeId: "august-gathering",
    eventTitle: "Late Summer Cocktail Gathering",
    subtitle: "Classified • Gathering No. 11",
    format: "Cocktails & Small Plates",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Aug 1"
  },
  {
    monthIndex: 11,
    monthName: "September",
    year: "2027",
    status: "locked",
    themeId: "september-gathering",
    eventTitle: "Autumn Dinner Gathering",
    subtitle: "Classified • Gathering No. 12",
    format: "Autumn Dinner & Cellar Wines",
    envelopeStyle: "grayed-locked",
    sealText: "S",
    releaseDate: "Summons Unlocks Sep 1"
  }
];

const DEFAULT_PARTY = {
  id: "midnight-manor",
  title: "Murder Mystery Dinner",
  subtitle: "A Parlour Gathering of Deceit, Secrets, and Sudden Demise",
  partyType: "Parlour Gathering & Passed Savouries",
  foodAndDrinkNote: "Passed hot and cold savouries and themed specialty cocktails will be provided. Guests are also warmly welcome to BYOB or bring a favorite bottle of wine!",
  date: "2026-10-23",
  time: "8:00 PM",
  locationName: "Private Residence",
  address: "Address will be provided upon RSVP",
  revealAddressOnRsvp: true,
  dressCode: "Murder Mystery Upscale & Fun — You don't have to wear formal cocktail attire, but try to dress in theme with the character role you receive!",
  hostName: "Your Enigmatic Host",
  hostNote: "Passed savouries and themed cocktails begin promptly at eight. If you wish to bring a favorite bottle of wine or BYOB, please feel most welcome! Mingle, observe your companions, and keep your guard up—for promptly at nine, the lights shall go out and one among us shall perish.",
  storyTeaser: "An unsolved demise has cast a shadow across our halls! The eccentric Woman of the Manor has doted upon her prized possession—her pampered companion 'Birdie'—threatening to leave the entire estate trust to Birdie while questioning who truly belongs in this household. Tonight, bitter tensions over Birdie's inheritance boil over into sudden demise. Keep your friends close, your drink in hand, and your secrets closer.",
  schedule: [
    { time: "8:00 PM", title: "Parlour Gathering & Passed Savouries", desc: "Arrive in style. Enjoy specialty cocktails, hors d'oeuvres (or your BYOB/wine) while making covert inquiries." },
    { time: "8:35 PM", title: "The Host's Toast & Setting the Scene", desc: "The host raises a glass. An unsettling announcement sets our parlour mystery into motion." },
    { time: "9:00 PM", title: "Lights Out — The Murder Strikes!", desc: "A blackout strikes promptly at nine! The murder occurs and the Inspector takes command as fresh clues circulate." },
    { time: "9:45 PM", title: "Accusations & Final Verdict", desc: "Interrogate companions and cast your secret ballot for the conspirator before dessert cocktails." }
  ],
  houseClues: [
    {
      exhibit: "Exhibit A",
      location: "The Parlour / Living Room (near the fireplace or mantle)",
      title: "The Torn Will Fragment",
      detail: "A burnt scrap of parchment reading: 'October 23 — I hereby leave the manor, the family jewels, and the estate trust solely to my darling companion Birdie. The others argue endlessly over who truly belongs in this household, but Birdie alone has my heart.' — The Woman of the Manor"
    },
    {
      exhibit: "Exhibit B",
      location: "The Bar / Refreshment Table (by the bottles)",
      title: "Birdie's Empty Treat Canister",
      detail: "The hand-painted silver canister labeled 'Birdie's Gourmet Savoury Treats' was found pried open and completely empty behind the bar curtain at 8:45 PM. Someone deliberately used Birdie's favourite delicacies to lure the prized companion away!"
    },
    {
      exhibit: "Exhibit C",
      location: "The Hallway / Study Entrance",
      title: "Transcript of the Corridor Quarrel",
      detail: "A hasty note jotted on a calling card: '8:40 PM: Violent argument overheard through closed study doors. A voice hissed: That creature receives the bedroom suite while you question where a true member of this household belongs?!' Followed by muffled footsteps."
    }
  ],
  maxGuests: 16,
  roles: [
    {
      id: "role_detective",
      roleTitle: "The Detective",
      archetype: "The Uninvited Sleuth",
      alignment: "Town (Investigator)",
      badgeClass: "badge-investigator",
      symbol: "✦",
      priority: 1,
      bio: "You are the investigator clutching a battered notebook and a piercing glare. You observe everyone's body language and piece together hidden clues.",
      secretObjective: "Unmask the killer before dessert cocktails! During cocktail hour, pull two people aside and whisper: 'I know what you did in Vienna.' Gauge their reaction.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were in the Foyer questioning the Butler about who arrived without an invitation." },
        { label: "Witness Intel (What you saw)", text: "You noticed a pair of dark evening gloves resting on the study side table that vanished right before 9:00 PM." },
        { label: "Cleared Evidence (Rule this out!)", text: "You inspected the fireplace poker in the Parlour—it is coated in thick undisturbed soot and was NOT used." }
      ],
      costumeGuide: "Trench coat, tweed blazer, vintage fedora, pocket notepad, magnifying glass or spectacles.",
      doorPasscode: "WHISPER AT DOOR: 'The game is afoot.'"
    },
    {
      id: "role_murderer",
      roleTitle: "The Murderer",
      archetype: "The Mastermind",
      alignment: "Mafia (The Killer)",
      badgeClass: "badge-killer",
      symbol: "§",
      priority: 1,
      bio: "You are the glamorous guest with an iron will and a deadly secret. You smile warmly at everyone, sip your cocktail, and deflect all suspicion.",
      secretObjective: "You did it—or you are orchestrating it tonight! Your goal is to deflect suspicion onto the Doctor or the Butler. Claim you were getting a savoury when the lights went out.",
      clueCards: [
        { label: "The Murder Weapon", text: "The Antique Silver Letter Opener (swiped from the study desk right after luring Birdie away with the stolen treats)." },
        { label: "The Motive / The Reason", text: "Furious resentment that the Woman of the Manor chose her prized companion Birdie over her own family, telling you that you don't truly belong in this household!" },
        { label: "Your Accomplice", text: "The Accomplice (The Loyal Shadow) swiped Birdie's treats to lure the companion away and will vouch for your false alibi." }
      ],
      costumeGuide: "Dramatic black or crimson attire, velvet or lace, gloves, confident smile.",
      doorPasscode: "WHISPER AT DOOR: 'A spider spins at midnight.'"
    },
    {
      id: "role_doctor",
      roleTitle: "The Doctor",
      archetype: "The Morbid Physician",
      alignment: "Town (Protector)",
      badgeClass: "badge-protector",
      symbol: "⚜",
      priority: 1,
      bio: "The physician who knows dark medical secrets. You carry an eye for detail, rare botanicals, and unusual antidotes.",
      secretObjective: "Protect innocence. You carry an antidote. When the murder occurs, loudly examine the body/scene and cast doubt on exotic poisons.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were in the dining area pouring a drink and admiring the antique silver decanter." },
        { label: "Witness Intel (What you saw)", text: "You examined Birdie's empty dish in passing—there was no poison, only evidence that the treats had been hastily scooped out." },
        { label: "Cleared Evidence (Rule this out!)", text: "You tested the punch bowl with silver litmus—it is completely free of poison. The strike was physical." }
      ],
      costumeGuide: "Velvet dinner jacket or formal vest, vintage pocket watch, antique vial or leather notebook.",
      doorPasscode: "WHISPER AT DOOR: 'First, do no harm.'"
    },
    {
      id: "role_accomplice",
      roleTitle: "The Accomplice",
      archetype: "The Loyal Shadow",
      alignment: "Mafia (Accomplice)",
      badgeClass: "badge-shadow",
      symbol: "❧",
      priority: 2,
      bio: "The loyal confidant who manages correspondence, secret debts, and private alliances. You protect your partner at all costs.",
      secretObjective: "Protect The Murderer at all costs. Plant a false clue or drop a hint that implicates someone else during cocktails.",
      clueCards: [
        { label: "Your Mastermind", text: "The Murderer is your secret partner. You swiped Birdie's treats to lure the companion away from the study." },
        { label: "Your Fabricated Alibi", text: "Swear to everyone that you and the Murderer were in the Parlour discussing art when the argument through closed doors occurred." },
        { label: "Your Diversion Task", text: "Steer suspicion toward the Butler by whispering that he was furious about having to serve Birdie silver platters." }
      ],
      costumeGuide: "Sharp formal suit or elegant evening wear, pocket square, charming and discreet presence.",
      doorPasscode: "WHISPER AT DOOR: 'The ink never dries.'"
    },
    {
      id: "role_butler",
      roleTitle: "The Butler",
      archetype: "The Stoic Insider",
      alignment: "Town (The Witness)",
      badgeClass: "badge-witness",
      symbol: "✦",
      priority: 2,
      bio: "Longtime confidant of the estate. You know every hidden corner, every secret door, and you rarely miss a whisper.",
      secretObjective: "You saw someone slip away to the private study at 8:45 PM. Quietly whisper this clue to only one trusted guest over savouries.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were in the kitchen preparing the savoury tray and speaking with the Sommelier." },
        { label: "Witness Intel (Birdie's Treats Missing)", text: "At 8:45 PM, you discovered that Birdie's silver treat jar was missing from the pantry sideboard, and Birdie had vanished from the parlour!" },
        { label: "Cleared Evidence (Rule this out!)", text: "The cellar door remained padlocked all evening—no one entered or exited through the back gardens." }
      ],
      costumeGuide: "Tuxedo, waistcoat, bow tie, carrying a vintage key ring or cocktail napkin.",
      doorPasscode: "WHISPER AT DOOR: 'Service above all.'"
    },
    {
      id: "role_socialite",
      roleTitle: "The Socialite",
      archetype: "The Glamorous Gossip",
      alignment: "Town (The Informant)",
      badgeClass: "badge-guest",
      symbol: "⚜",
      priority: 2,
      bio: "High-society icon whose sharp wit is deadlier than any blade. You thrive on scandalous whispers and parlour secrets.",
      secretObjective: "Collect two juicy rumors from different guests before the murder occurs. Expose one loudly during the host's toast!",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were holding court in the center of the Parlour showing off your heirloom jewelry." },
        { label: "Witness Intel (The Argument Heard)", text: "At 8:40 PM, you heard a fierce argument through closed study doors over where a member of the household truly belongs!" },
        { label: "Cleared Evidence (Rule this out!)", text: "The heavy brass candlestick on the piano was never moved—you had your cocktail napkin resting on its base." }
      ],
      costumeGuide: "Velvet dress or evening attire, faux fur, sparkling heirloom jewelry, fan in hand.",
      doorPasscode: "WHISPER AT DOOR: 'Darling, you look divine.'"
    },
    {
      id: "role_medium",
      roleTitle: "The Clairvoyant Medium",
      archetype: "The Seer",
      alignment: "Wildcard (The Seer)",
      badgeClass: "badge-special",
      symbol: "✦",
      priority: 3,
      bio: "An eccentric spiritualist who reads omens and auras. You smell of sage and carry tarot cards everywhere.",
      secretObjective: "Hold an impromptu mini-reading over drinks. Predict that someone wearing gold or crimson is hiding dark secrets.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were giving a palm reading to a guest near the window alcove." },
        { label: "Witness Intel (What you saw)", text: "You felt a sudden chill and saw a shadowy silhouette pacing outside the study French doors." },
        { label: "Cleared Evidence (Rule this out!)", text: "The antique revolver in the display case remains unloaded and locked behind glass." }
      ],
      costumeGuide: "Flowing velvet, layered beadwork, tarot cards or spirit crystal prop.",
      doorPasscode: "WHISPER AT DOOR: 'The veil is thin tonight.'"
    },
    {
      id: "role_noble",
      roleTitle: "The Disgraced Noble",
      archetype: "The Indebted Aristocrat",
      alignment: "Wildcard (Debtor)",
      badgeClass: "badge-special",
      symbol: "§",
      priority: 3,
      bio: "An eccentric aristocrat plagued by secret debts and hidden family wills. You clutch an antique signet ring and pace nervously around the parlour.",
      secretObjective: "You desperately need a certain family document to vanish tonight. Whisper to two guests that the deceased changed the will just before the lights went out.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were in the library inspecting old family portraits and nursing a glass of bourbon." },
        { label: "Witness Intel (What you saw)", text: "You overheard someone muttering: 'Tonight, the will is settled once and for all.'" },
        { label: "Cleared Evidence (Rule this out!)", text: "The velvet rope cord from the gallery is intact—strangulation was definitely not the method." }
      ],
      costumeGuide: "Victorian tailcoat or waistcoat, cravat, pocket watch with gold chain, signet ring.",
      doorPasscode: "WHISPER AT DOOR: 'Bloodlines run deep.'"
    },
    {
      id: "role_toxicologist",
      roleTitle: "The Toxicologist",
      archetype: "The Antique Chemist",
      alignment: "Town (Scholar)",
      badgeClass: "badge-investigator",
      symbol: "⚜",
      priority: 3,
      bio: "A botanist and collector of rare poisons. You inspect every garnish and sniff every cocktail glass with curious suspicion.",
      secretObjective: "Inspect everyone's glasses. Announce to a group that one drink smelled faintly of bitter almonds (cyanide!).",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were tasting appetizers and chatting with the Doctor about rare botanical extracts." },
        { label: "Witness Intel (What you saw)", text: "You noticed someone smelling faintly of damp moors and burnt matches." },
        { label: "Cleared Evidence (Rule this out!)", text: "You chemically inspected every glass on the bar—all poisons in the house remain sealed and accounted for." }
      ],
      costumeGuide: "Tweed waistcoat or dark vest, round spectacles, vintage notebook, mysterious small vial.",
      doorPasscode: "WHISPER AT DOOR: 'In the poison lies the cure.'"
    },
    {
      id: "role_journalist",
      roleTitle: "The Journalist",
      archetype: "The Undercover Reporter",
      alignment: "Town (Exposer)",
      badgeClass: "badge-guest",
      symbol: "❧",
      priority: 3,
      bio: "An intrepid investigative reporter disguised as a party guest, chasing the scoop of the century.",
      secretObjective: "Jot down notes throughout the evening. Ask uncomfortable questions about everyone's motives and threaten to expose them.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were leaning against the bookshelf jotting down notes on everyone's outfits." },
        { label: "Witness Intel (What you saw)", text: "You saw two guests exchange a tense, knowing look right as the grandfather clock chimed." },
        { label: "Cleared Evidence (Rule this out!)", text: "The kitchen carving knife was in plain sight on the cutting board the entire hour." }
      ],
      costumeGuide: "Press pass card in pocket or hat, small leather notebook, pencil, sharp vintage style.",
      doorPasscode: "WHISPER AT DOOR: 'Stop the presses.'"
    },
    {
      id: "role_diva",
      roleTitle: "The Opera Diva",
      archetype: "The Star of the Show",
      alignment: "Town (Distraction)",
      badgeClass: "badge-guest",
      symbol: "✦",
      priority: 4,
      bio: "Prima donna who treats the parlour as her personal stage. You find ordinary conversation dreadfully boring.",
      secretObjective: "Stage a dramatic gasp or theatrical scene when the crime is announced. Demand smelling salts and an immediate cocktail refill.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were by the grand piano demanding a glass of champagne." },
        { label: "Witness Intel (What you saw)", text: "You saw someone hurriedly wiping their hands on a dark handkerchief near the hallway." },
        { label: "Cleared Evidence (Rule this out!)", text: "The heavy bronze bust in the foyer was untouched—blunt trauma from the statue is ruled out." }
      ],
      costumeGuide: "Dramatic cape or glamorous gown, feathered fan, opera glasses, bold styling.",
      doorPasscode: "WHISPER AT DOOR: 'Brava! Brava!'"
    },
    {
      id: "role_diplomat",
      roleTitle: "The Diplomat",
      archetype: "The Foreign Envoy",
      alignment: "Wildcard (Diplomat)",
      badgeClass: "badge-special",
      symbol: "⚜",
      priority: 4,
      bio: "An enigmatic foreign diplomat claiming diplomatic immunity from any petty accusations.",
      secretObjective: "Whenever anyone questions your whereabouts, present your credentials and refuse to answer without an ambassador present.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were on the covered terrace enjoying the cool air with your coat." },
        { label: "Witness Intel (What you saw)", text: "You saw someone conceal a slim metallic object inside their breast pocket before entering the parlour." },
        { label: "Cleared Evidence (Rule this out!)", text: "The garden gate was bolted from the inside—the culprit is unquestionably an inside guest." }
      ],
      costumeGuide: "Formal jacket with vintage sash or pin, monocle or spectacles, stern posture.",
      doorPasscode: "WHISPER AT DOOR: 'Diplomatic pouch.'"
    },
    {
      id: "role_poet",
      roleTitle: "The Morbid Poet",
      archetype: "The Cryptic Artist",
      alignment: "Town (Eccentric)",
      badgeClass: "badge-guest",
      symbol: "❧",
      priority: 4,
      bio: "A romantic artist who exclusively writes about crypts and lost loves. You speak in poetic metaphors.",
      secretObjective: "Recite a four-line morbid rhyme over drinks that cryptically hints at the murder weapon.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were staring pensively into the fireplace reciting lines to yourself." },
        { label: "Witness Intel (What you saw)", text: "You saw an envelope with a broken wax seal thrown into the wastebasket near the study." },
        { label: "Cleared Evidence (Rule this out!)", text: "The antique fencing sword on the wall was never unhooked from its brass mounts." }
      ],
      costumeGuide: "All-black velvet, dark cravat, fountain pen, weathered leather journal.",
      doorPasscode: "WHISPER AT DOOR: 'Nevermore.'"
    },
    {
      id: "role_bodyguard",
      roleTitle: "The Bodyguard",
      archetype: "The Silent Enforcer",
      alignment: "Town (The Muscle)",
      badgeClass: "badge-protector",
      symbol: "§",
      priority: 4,
      bio: "Personal security for the estate. You rarely say more than three words and keep an eye on everyone's hands.",
      secretObjective: "Guard the doorway to the back room. Intercept anyone who tries to slip away between 8:30 and 9:00 PM.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were posted near the main parlour entrance keeping your eyes on the crowd." },
        { label: "Witness Intel (What you saw)", text: "You saw the Accomplice deliberately block the view of the study hallway for two minutes." },
        { label: "Cleared Evidence (Rule this out!)", text: "No weapon was drawn from any holster or concealed jacket at the front door." }
      ],
      costumeGuide: "Dark double-breasted suit, flat cap or dark shades, stern stance.",
      doorPasscode: "WHISPER AT DOOR: 'Move along.'"
    },
    {
      id: "role_sommelier",
      roleTitle: "The Sommelier",
      archetype: "The Connoisseur",
      alignment: "Town (Connoisseur)",
      badgeClass: "badge-guest",
      symbol: "⚜",
      priority: 5,
      bio: "Master of vintage wines and spirits with an unmatched palate. You were overseeing the bar when the tragedy unfolded.",
      secretObjective: "Observe who refused to drink the host's toast. Discreetly warn one guest: 'Keep an eye on your glass tonight.'",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were uncorking wine bottles and pouring drinks for guests." },
        { label: "Witness Intel (What you saw)", text: "You noticed that one guest's glass was trembling violently when the toast was proposed." },
        { label: "Cleared Evidence (Rule this out!)", text: "Every wine bottle served tonight was uncorked fresh in front of guests—nothing was tampered with." }
      ],
      costumeGuide: "Apron over formal shirt, silver wine tastevin or corkscrew prop.",
      doorPasscode: "WHISPER AT DOOR: 'Vintage 1912.'"
    },
    {
      id: "role_heir",
      roleTitle: "The Estranged Heir",
      archetype: "The Disinherited Relative",
      alignment: "Town (Heir)",
      badgeClass: "badge-guest",
      symbol: "✦",
      priority: 5,
      bio: "Disinherited relative who arrived uninvited tonight to claim what is rightfully yours.",
      secretObjective: "Argue quietly with The Butler or another guest about where the updated will was stashed.",
      clueCards: [
        { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were pacing by the sideboard muttering about estate inheritance." },
        { label: "Witness Intel (What you saw)", text: "You saw someone rummaging through the study desk drawers just before the lights dimmed." },
        { label: "Cleared Evidence (Rule this out!)", text: "The silver letter opener usually on the desk was missing—meaning it was taken before 9:00 PM!" }
      ],
      costumeGuide: "Velvet blazer or heirloom dress, ornate locket, antique brooch.",
      doorPasscode: "WHISPER AT DOOR: 'Blood is thicker than wine.'"
    }
  ]
};

const THEME_PRESETS = [
  {
    id: "midnight-manor",
    name: "Murder Mystery Dinner (October)",
    genre: "Victorian Parlour Gathering & Whodunit",
    description: "Passed savouries, specialty cocktails, and an intimate Victorian parlour murder mystery.",
    partyData: DEFAULT_PARTY
  },
  {
    id: "autumn-dinner",
    name: "Autumn Feast & Libations (November)",
    genre: "Seasonal Dinner & Cocktails",
    description: "Hearty seasonal dinner, spiced cocktails, and warm autumn fellowship.",
    partyData: {
      id: "autumn-dinner",
      title: "Autumn Dinner & Cocktails",
      subtitle: "A Seasonal Gathering of Warmth, Food, and Good Cheer",
      partyType: "Dinner Gathering & Passed Savouries",
      foodAndDrinkNote: "Roast fare, warm spiced cocktails, and cellar wines provided.",
      date: "2026-11-20",
      time: "8:00 PM",
      locationName: "Private Residence",
      address: "Address will be provided upon RSVP",
      revealAddressOnRsvp: true,
      dressCode: "Autumn Upscale / Warm Velvet & Tweed",
      hostName: "Your Host",
      hostNote: "Join us for our monthly dinner gathering.",
      schedule: [
        { time: "8:00 PM", title: "Arrivals & Cocktails", desc: "Welcome drinks and passed appetizers." },
        { time: "8:45 PM", title: "Dinner Served", desc: "Seasonal feast and wine pairings." }
      ],
      maxGuests: 16
    }
  },
  {
    id: "holiday-cocktails",
    name: "Holiday Dinner & Cocktails (December)",
    genre: "Festive Holiday Gathering",
    description: "Holiday celebration with festive cocktails, seasonal dinner, and parlor games.",
    partyData: {
      id: "holiday-cocktails",
      title: "Holiday Dinner & Cocktails",
      subtitle: "A Festive Evening of Good Cheer and Fine Libations",
      partyType: "Dinner Gathering & Passed Savouries",
      foodAndDrinkNote: "Champagne, winter punch, and an array of festive savouries.",
      date: "2026-12-18",
      time: "8:00 PM",
      locationName: "Private Residence",
      address: "Address will be provided upon RSVP",
      revealAddressOnRsvp: true,
      dressCode: "Holiday Festive / Velvet & Black Tie",
      hostName: "Your Host",
      hostNote: "Celebrate the season with our monthly society gathering.",
      schedule: [
        { time: "8:00 PM", title: "Holiday Toasts & Canapés", desc: "Festive cocktails and mingling." },
        { time: "8:45 PM", title: "Holiday Dinner", desc: "Dinner served by candlelight." }
      ],
      maxGuests: 16
    }
  }
];
