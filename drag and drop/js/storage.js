/**
 * Storage & State Manager
 * Powered by Google Firebase Realtime Database for permanent 24/7 cloud persistence.
 * RSVPs and party customizations stay saved forever across all phones, tablets, and computers.
 */

const PartyStorage = (function() {
  const STORAGE_KEYS = {
    PARTY: "party_portal_current_party",
    RSVPS: "party_portal_rsvps",
    MY_RSVP: "party_portal_my_rsvp_id",
    PIN: "party_portal_admin_pin"
  };

  const DEFAULT_PIN = "1920";
  const FIREBASE_URL = "https://kat-party-default-rtdb.firebaseio.com";

  let isServerAvailable = true;

  // Check connectivity to cloud database
  async function checkServer() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${FIREBASE_URL}/.json?shallow=true`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        isServerAvailable = true;
        return true;
      }
    } catch (e) {}
    return false;
  }

  // Get active party configuration (reads from Firebase Cloud)
  async function getParty() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${FIREBASE_URL}/party.json`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && data.id) {
          localStorage.setItem(STORAGE_KEYS.PARTY, JSON.stringify(data));
          return data;
        }
      }
    } catch (e) {}

    const local = localStorage.getItem(STORAGE_KEYS.PARTY);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return DEFAULT_PARTY;
  }

  // Save party configuration (saves to Firebase Cloud)
  async function saveParty(partyData) {
    localStorage.setItem(STORAGE_KEYS.PARTY, JSON.stringify(partyData));
    try {
      await fetch(`${FIREBASE_URL}/party.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partyData)
      });
    } catch (e) {}
    return partyData;
  }

  // Get all RSVPs (reads from Firebase Cloud database)
  async function getRSVPs() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(`${FIREBASE_URL}/rsvps.json`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        let list = [];
        if (Array.isArray(data)) {
          list = data.filter(Boolean);
        } else if (data && typeof data === 'object') {
          list = Object.values(data);
        }
        localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list));
        return list;
      }
    } catch (e) {}

    const local = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (local) {
      try { return JSON.parse(local); } catch (e) {}
    }
    return [];
  }

  // Save all RSVPs (saves permanently to Firebase Cloud database)
  async function saveRSVPs(rsvps) {
    const list = Array.isArray(rsvps) ? rsvps : [];
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(list));
    try {
      await fetch(`${FIREBASE_URL}/rsvps.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(list)
      });
    } catch (e) {}
    return list;
  }

  // Allocate next best available role
  function allocateRole(party, existingRsvps, guestName) {
    const roles = party.roles || DEFAULT_PARTY.roles;
    
    const claimedRoleIds = new Set(
      existingRsvps
        .filter(r => r.status === 'attending' && r.assignedRole)
        .map(r => r.assignedRole.id)
    );

    const available = roles
      .filter(r => !claimedRoleIds.has(r.id))
      .sort((a, b) => (a.priority || 99) - (b.priority || 99));

    if (available.length === 0) {
      return {
        id: "role_guest_" + Date.now(),
        name: "Lord / Lady of Mystery",
        archetype: "The Cryptic Guest",
        alignment: "Town (Civilian)",
        badgeClass: "badge-guest",
        symbol: "✦",
        bio: `An esteemed friend of the household. You arrived unannounced on the carriage from London.`,
        secretObjective: `Discreetly observe the other guests. Whisper to your dinner neighbor that you heard footsteps in the attic at 8:00 PM.`,
        clueCards: [
          { label: "Your Alibi (Where you were)", text: "At 8:45 PM, you were in the Conservatory watching the rain lash against the glass." },
          { label: "Witness Intel (What you saw)", text: "You saw a dark silhouette hurriedly slip past the study hallway just before the lights blinked." },
          { label: "Cleared Evidence (Rule this out!)", text: "The fireplace poker in the parlour was undisturbed—it was definitely not used." }
        ],
        costumeGuide: `Vintage formal attire, dark evening gloves or pocket square.`,
        doorPasscode: `WHISPER_AT_DOOR: 'The shadows lengthen.'`
      };
    }

    const topPriority = available[0].priority;
    const topTierRoles = available.filter(r => r.priority === topPriority);
    return topTierRoles[Math.floor(Math.random() * topTierRoles.length)];
  }

  // Submit or update RSVP (saves directly to Firebase Cloud)
  async function submitRSVP(formData) {
    const rsvps = await getRSVPs();
    const party = await getParty();

    const existingIndex = rsvps.findIndex(r => 
      (formData.id && r.id === formData.id) ||
      (r.name.trim().toLowerCase() === formData.name.trim().toLowerCase())
    );

    let assignedRole = null;
    if (formData.status === 'attending') {
      if (existingIndex >= 0 && rsvps[existingIndex].assignedRole && rsvps[existingIndex].status === 'attending') {
        assignedRole = rsvps[existingIndex].assignedRole;
      } else {
        assignedRole = allocateRole(party, rsvps, formData.name);
      }
    }

    const rsvpRecord = {
      id: (existingIndex >= 0 ? rsvps[existingIndex].id : "rsvp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5)),
      name: formData.name.trim(),
      status: formData.status,
      dietary: formData.dietary ? formData.dietary.trim() : "None",
      drinkPreference: formData.drinkPreference ? formData.drinkPreference.trim() : "Surprise me",
      plusOne: !!formData.plusOne,
      plusOneName: formData.plusOneName ? formData.plusOneName.trim() : "",
      assignedRole: assignedRole,
      timestamp: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      rsvps[existingIndex] = rsvpRecord;
    } else {
      rsvps.push(rsvpRecord);
    }

    await saveRSVPs(rsvps);
    localStorage.setItem(STORAGE_KEYS.MY_RSVP, rsvpRecord.id);
    return rsvpRecord;
  }

  async function getMyRSVP() {
    const myId = localStorage.getItem(STORAGE_KEYS.MY_RSVP);
    if (!myId) return null;
    const rsvps = await getRSVPs();
    return rsvps.find(r => r.id === myId) || null;
  }

  function clearMyRSVP() {
    localStorage.removeItem(STORAGE_KEYS.MY_RSVP);
  }

  function verifyPin(enteredPin) {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
    return enteredPin === savedPin;
  }

  function setPin(newPin) {
    localStorage.setItem(STORAGE_KEYS.PIN, newPin);
    return true;
  }

  async function seedDemoData() {
    const party = await getParty();
    const demoRsvps = [
      {
        id: "demo_1",
        name: "Arthur Pendelton",
        status: "attending",
        dietary: "Vegetarian",
        drinkPreference: "Bringing a Bottle of Wine",
        plusOne: false,
        assignedRole: party.roles[0],
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString()
      },
      {
        id: "demo_2",
        name: "Clarice Sterling",
        status: "attending",
        dietary: "Gluten-Free",
        drinkPreference: "Themed Specialty Cocktail",
        plusOne: true,
        plusOneName: "Lord Sterling",
        assignedRole: party.roles[1],
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString()
      },
      {
        id: "demo_3",
        name: "Dr. Thomas Evans",
        status: "attending",
        dietary: "None",
        drinkPreference: "BYOB (Bringing personal spirits/ale)",
        plusOne: false,
        assignedRole: party.roles[2],
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: "demo_4",
        name: "Evelyn Reed",
        status: "attending",
        dietary: "Nut allergy",
        drinkPreference: "Themed Specialty Cocktail",
        plusOne: false,
        assignedRole: party.roles[3],
        timestamp: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    await saveRSVPs(demoRsvps);
    return demoRsvps;
  }

  // Clear all RSVPs from Firebase Cloud database permanently
  async function clearAllRSVPs() {
    await saveRSVPs([]);
    localStorage.removeItem(STORAGE_KEYS.MY_RSVP);
  }

  return {
    checkServer,
    getParty,
    saveParty,
    getRSVPs,
    saveRSVPs,
    submitRSVP,
    getMyRSVP,
    clearMyRSVP,
    verifyPin,
    setPin,
    seedDemoData,
    clearAllRSVPs
  };
})();
