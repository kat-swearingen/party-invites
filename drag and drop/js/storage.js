/**
 * Storage & State Manager
 * Handles syncing with the local Ruby server / REST API when running,
 * or gracefully falling back to browser LocalStorage for static / standalone hosting.
 */

const PartyStorage = (function() {
  const STORAGE_KEYS = {
    PARTY: "party_portal_current_party",
    RSVPS: "party_portal_rsvps",
    MY_RSVP: "party_portal_my_rsvp_id",
    PIN: "party_portal_admin_pin"
  };

  const DEFAULT_PIN = "1920"; // 1920s theme pin!

  let isServerAvailable = false;

  // Check if API server is answering
  async function checkServer() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch('/api/health', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        isServerAvailable = true;
        return true;
      }
    } catch (e) {
      isServerAvailable = false;
    }
    return false;
  }

  // Get active party configuration
  async function getParty() {
    if (isServerAvailable) {
      try {
        const res = await fetch('/api/party');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Failed to fetch from server, using local', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.PARTY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return DEFAULT_PARTY;
  }

  // Save party configuration
  async function saveParty(partyData) {
    localStorage.setItem(STORAGE_KEYS.PARTY, JSON.stringify(partyData));
    if (isServerAvailable) {
      try {
        await fetch('/api/party', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partyData)
        });
      } catch (e) {
        console.warn('Failed to save to server', e);
      }
    }
    return partyData;
  }

  // Get all RSVPs
  async function getRSVPs() {
    if (isServerAvailable) {
      try {
        const res = await fetch('/api/rsvps');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Failed to fetch RSVPs from server, using local', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.RSVPS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    return [];
  }

  // Save all RSVPs
  async function saveRSVPs(rsvps) {
    localStorage.setItem(STORAGE_KEYS.RSVPS, JSON.stringify(rsvps));
    if (isServerAvailable) {
      try {
        await fetch('/api/rsvps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rsvps)
        });
      } catch (e) {
        console.warn('Failed to sync RSVPs to server', e);
      }
    }
    return rsvps;
  }

  // Allocate next best available role
  function allocateRole(party, existingRsvps, guestName) {
    const roles = party.roles || DEFAULT_PARTY.roles;
    
    // Find all role IDs already claimed by attending guests
    const claimedRoleIds = new Set(
      existingRsvps
        .filter(r => r.status === 'attending' && r.assignedRole)
        .map(r => r.assignedRole.id)
    );

    // Filter available roles sorted by priority (1 is most essential: Detective, Murderer, Doctor, Accomplice...)
    const available = roles
      .filter(r => !claimedRoleIds.has(r.id))
      .sort((a, b) => (a.priority || 99) - (b.priority || 99));

    if (available.length === 0) {
      // If all 16 roles are filled, assign an honorary Mystery Guest role
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

    // Pick from the top priority tier available, with slight randomized shuffle within the same priority tier
    const topPriority = available[0].priority;
    const topTierRoles = available.filter(r => r.priority === topPriority);
    const chosenRole = topTierRoles[Math.floor(Math.random() * topTierRoles.length)];

    return chosenRole;
  }

  // Submit or update RSVP
  async function submitRSVP(formData) {
    const rsvps = await getRSVPs();
    const party = await getParty();

    // Check if this guest already exists (by name or existing id)
    const existingIndex = rsvps.findIndex(r => 
      (formData.id && r.id === formData.id) ||
      (r.name.trim().toLowerCase() === formData.name.trim().toLowerCase())
    );

    let assignedRole = null;

    if (formData.status === 'attending') {
      if (existingIndex >= 0 && rsvps[existingIndex].assignedRole && rsvps[existingIndex].status === 'attending') {
        // Keep existing role if already assigned
        assignedRole = rsvps[existingIndex].assignedRole;
      } else {
        // Assign new role
        assignedRole = allocateRole(party, rsvps, formData.name);
      }
    }

    const rsvpRecord = {
      id: (existingIndex >= 0 ? rsvps[existingIndex].id : "rsvp_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5)),
      name: formData.name.trim(),
      email: formData.email ? formData.email.trim() : "",
      phone: formData.phone ? formData.phone.trim() : "",
      status: formData.status, // 'attending' | 'declined'
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

    // Save current guest session ID
    localStorage.setItem(STORAGE_KEYS.MY_RSVP, rsvpRecord.id);

    return rsvpRecord;
  }

  // Get current user's RSVP if any
  async function getMyRSVP() {
    const myId = localStorage.getItem(STORAGE_KEYS.MY_RSVP);
    if (!myId) return null;
    const rsvps = await getRSVPs();
    return rsvps.find(r => r.id === myId) || null;
  }

  // Clear my stored RSVP (e.g. to RSVP as someone else or test)
  function clearMyRSVP() {
    localStorage.removeItem(STORAGE_KEYS.MY_RSVP);
  }

  // Verify Host PIN
  function verifyPin(enteredPin) {
    const savedPin = localStorage.getItem(STORAGE_KEYS.PIN) || DEFAULT_PIN;
    return enteredPin === savedPin;
  }

  // Set new Host PIN
  function setPin(newPin) {
    localStorage.setItem(STORAGE_KEYS.PIN, newPin);
    return true;
  }

  // Reset to default sample RSVPs for demonstration
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
        assignedRole: party.roles[0], // Inspector Vance
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
        assignedRole: party.roles[1], // Countess Blackwood (The Murderer!)
        timestamp: new Date(Date.now() - 86400000 * 1.5).toISOString()
      },
      {
        id: "demo_3",
        name: "Dr. Thomas Evans",
        status: "attending",
        dietary: "None",
        drinkPreference: "BYOB (Bringing personal spirits/ale)",
        plusOne: false,
        assignedRole: party.roles[2], // Dr. Finch (The Doctor)
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString()
      },
      {
        id: "demo_4",
        name: "Evelyn Reed",
        status: "attending",
        dietary: "Nut allergy",
        drinkPreference: "Themed Specialty Cocktail",
        plusOne: false,
        assignedRole: party.roles[3], // Julian Cross (Accomplice)
        timestamp: new Date(Date.now() - 43200000).toISOString()
      }
    ];
    await saveRSVPs(demoRsvps);
    return demoRsvps;
  }

  // Clear all RSVPs
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
