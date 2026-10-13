/**
 * Host Command Center Logic
 * Master roster, role assignment balancing, theme switching, dietary summaries, and game master soundboard.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Check API server availability
  await PartyStorage.checkServer();

  // Setup PIN verification
  setupPinAuth();

  // Setup Sound controls
  setupAdminAudio();

  // Setup Soundboard
  setupSoundboard();

  // Setup Intel Inspector Modal handlers
  setupIntelModalHandlers();
});

/**
 * PIN Gate Authentication
 */
function setupPinAuth() {
  const pinModal = document.getElementById('pin-modal');
  const adminMain = document.getElementById('admin-main');
  const pinForm = document.getElementById('pin-form');
  const pinInput = document.getElementById('pin-input');

  // Check if session already authenticated
  if (sessionStorage.getItem('party_admin_auth') === '1') {
    pinModal.style.display = 'none';
    adminMain.style.display = 'block';
    loadAdminDashboard();
    return;
  }

  pinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const pin = pinInput.value.trim();

    if (PartyStorage.verifyPin(pin)) {
      SoundEngine.playSealBreak();
      sessionStorage.setItem('party_admin_auth', '1');
      pinModal.style.display = 'none';
      adminMain.style.display = 'block';
      loadAdminDashboard();
    } else {
      SoundEngine.playStamp();
      alert('Incorrect Host PIN. Default is 1920.');
      pinInput.value = '';
      pinInput.focus();
    }
  });
}

/**
 * Load complete dashboard data
 */
async function loadAdminDashboard() {
  const party = await PartyStorage.getParty();
  const rsvps = await PartyStorage.getRSVPs();

  setupThemeSelector(party);
  renderStats(party, rsvps);
  renderRosterTable(party, rsvps);
  renderRoleMatrix(party, rsvps);
  renderCateringSummary(rsvps);
  renderHouseClues(party);
  setupRosterActions(party);
}

/**
 * Setup Monthly Party Theme Presets Switcher
 */
function setupThemeSelector(currentParty) {
  const selector = document.getElementById('theme-selector');
  selector.innerHTML = '';

  THEME_PRESETS.forEach(preset => {
    const opt = document.createElement('option');
    opt.value = preset.id;
    opt.textContent = `${preset.name} (${preset.genre})`;
    if (currentParty.id === preset.id) {
      opt.selected = true;
    }
    selector.appendChild(opt);
  });

  selector.addEventListener('change', async (e) => {
    const selectedId = e.target.value;
    const preset = THEME_PRESETS.find(p => p.id === selectedId);
    if (preset) {
      if (confirm(`Switch active party theme to "${preset.name}"?`)) {
        SoundEngine.playSealBreak();
        // If switching theme, preserve character roles structure or use preset
        const newParty = preset.partyData.roles ? preset.partyData : { ...DEFAULT_PARTY, ...preset.partyData };
        await PartyStorage.saveParty(newParty);
        loadAdminDashboard();
      } else {
        selector.value = currentParty.id;
      }
    }
  });

  // Edit party button
  document.getElementById('btn-edit-party').addEventListener('click', () => {
    const newTitle = prompt('Party Title:', currentParty.title);
    if (newTitle && newTitle.trim()) currentParty.title = newTitle.trim();

    const newDate = prompt('Party Date (YYYY-MM-DD):', currentParty.date || '2026-10-23');
    if (newDate) currentParty.date = newDate.trim();

    const newTime = prompt('Party Time:', currentParty.time || '8:00 PM');
    if (newTime) currentParty.time = newTime.trim();

    const newVenue = prompt('Venue / House Name:', currentParty.locationName || 'Private Residence');
    if (newVenue) currentParty.locationName = newVenue.trim();

    const newAddress = prompt('Street Address (revealed to guests on RSVP):', currentParty.address || 'Address will be provided upon RSVP');
    if (newAddress) currentParty.address = newAddress.trim();

    PartyStorage.saveParty(currentParty).then(() => {
      SoundEngine.playSealBreak();
      loadAdminDashboard();
    });
  });
}

/**
 * Render Key Metric Stats
 */
function renderStats(party, rsvps) {
  const attending = rsvps.filter(r => r.status === 'attending');
  const declined = rsvps.filter(r => r.status === 'declined');

  const maxCap = party.maxGuests || 16;
  document.getElementById('stat-attending').textContent = `${attending.length} / ${maxCap}`;
  document.getElementById('stat-capacity').textContent = `Capacity: ${maxCap} guests (${Math.max(0, maxCap - attending.length)} seats open)`;

  // Core roles check (Detective, Murderer, Doctor, Accomplice)
  const coreIds = ['role_detective', 'role_murderer', 'role_doctor', 'role_accomplice'];
  const claimedCore = attending.filter(r => r.assignedRole && coreIds.includes(r.assignedRole.id)).length;
  document.getElementById('stat-roles-assigned').textContent = `${claimedCore} / ${coreIds.length}`;

  document.getElementById('stat-declined').textContent = declined.length;

  // Dietary count
  const withDiet = attending.filter(r => r.dietary && r.dietary.toLowerCase() !== 'none' && r.dietary.trim() !== '');
  document.getElementById('stat-dietary-count').textContent = withDiet.length;
  
  if (withDiet.length > 0) {
    const dietTypes = [...new Set(withDiet.map(r => r.dietary))].slice(0, 3).join(', ');
    document.getElementById('stat-dietary-types').textContent = dietTypes;
  } else {
    document.getElementById('stat-dietary-types').textContent = 'No restrictions flagged';
  }
}

/**
 * Render Guest Roster Table
 */
function renderRosterTable(party, rsvps) {
  const tbody = document.getElementById('roster-tbody');
  tbody.innerHTML = '';

  if (rsvps.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No invitations claimed yet. Share your portal link or click "Seed Sample Guests" to preview!
        </td>
      </tr>
    `;
    return;
  }

  rsvps.forEach(guest => {
    const tr = document.createElement('tr');
    const role = guest.assignedRole;

    const roleName = role ? (role.roleTitle || role.name) : '—';
    const roleArchetype = role ? role.archetype : 'Unassigned';
    const roleAlignment = role ? role.alignment : '—';
    const badgeClass = role ? role.badgeClass : 'badge-guest';
    const roleSymbol = role ? role.symbol : '✦';

    tr.innerHTML = `
      <td>
        <strong>${guest.name}</strong>
        ${guest.plusOne ? `<div style="font-size: 0.8rem; color: var(--gold-glow);">+1: ${guest.plusOneName || 'Guest'}</div>` : ''}
      </td>
      <td>
        <span style="font-family: var(--font-title); font-size: 0.85rem; color: ${guest.status === 'attending' ? '#86efac' : '#fca5a5'};">
          ${guest.status === 'attending' ? '✓ Attending' : '✗ Declined'}
        </span>
      </td>
      <td>
        <div class="role-badge-cell">
          <span style="font-weight: 600; color: #fff;">${roleSymbol} ${roleName}</span>
          <span style="font-size: 0.8rem; color: var(--gold-glow);">${roleArchetype}</span>
        </div>
      </td>
      <td>
        ${role ? `<span class="alignment-badge ${badgeClass}">${roleAlignment}</span>` : '—'}
      </td>
      <td>
        <div style="margin-bottom: 0.2rem;">
          ${guest.dietary && guest.dietary !== 'None' ? `<span class="diet-badge">❧ ${guest.dietary}</span>` : '<span style="color: var(--text-muted); font-size: 0.85rem;">Standard</span>'}
        </div>
        <div style="font-size: 0.8rem; color: var(--text-muted);">
          ✦ ${guest.drinkPreference || 'Surprise Me'}
        </div>
      </td>
      <td>
        <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
          ${guest.assignedRole ? `<button class="action-btn btn-view-intel" data-id="${guest.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-color: var(--gold-accent); color: var(--gold-glow);" title="Inspect 3 Clue Cards & Secret Persona"><span>✦</span> Clues</button>` : ''}
          ${guest.status === 'attending' ? `<button class="action-btn btn-swap-role" data-id="${guest.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem;" title="Swap or reassign role">Reassign</button>` : ''}
          <button class="action-btn btn-delete-guest" data-id="${guest.id}" style="padding: 0.35rem 0.65rem; font-size: 0.75rem; border-color: #ef4444; color: #fca5a5;" title="Remove guest">Remove</button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });

  // Attach row event listeners
  document.querySelectorAll('.btn-view-intel').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const allRsvps = await PartyStorage.getRSVPs();
      const guest = allRsvps.find(r => r.id === id);
      if (guest && guest.assignedRole) {
        SoundEngine.playTypewriter();
        openIntelModal(guest.assignedRole, guest);
      }
    });
  });

  document.querySelectorAll('.btn-delete-guest').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      if (confirm('Are you sure you want to remove this RSVP? Their assigned role will be released back to the pool.')) {
        SoundEngine.playStamp();
        const updated = (await PartyStorage.getRSVPs()).filter(r => r.id !== id);
        await PartyStorage.saveRSVPs(updated);
        loadAdminDashboard();
      }
    });
  });

  document.querySelectorAll('.btn-swap-role').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.currentTarget.getAttribute('data-id');
      const allRsvps = await PartyStorage.getRSVPs();
      const guest = allRsvps.find(r => r.id === id);
      if (!guest) return;

      const roles = (party.roles || DEFAULT_PARTY.roles);
      const roleNames = roles.map((r, i) => `${i + 1}. ${r.roleTitle || r.name} (${r.archetype})`).join('\n');
      const choice = prompt(`Select a new role number for ${guest.name}:\n\n${roleNames}`);

      if (choice && !isNaN(choice)) {
        const idx = parseInt(choice, 10) - 1;
        if (roles[idx]) {
          guest.assignedRole = roles[idx];
          await PartyStorage.saveRSVPs(allRsvps);
          SoundEngine.playSealBreak();
          loadAdminDashboard();
        }
      }
    });
  });
}

/**
 * Render Role Matrix (All 16 available character slots with their 3 Secret Clues & Alibis)
 */
function renderRoleMatrix(party, rsvps) {
  const container = document.getElementById('role-matrix-grid');
  container.innerHTML = '';

  const roles = party.roles || DEFAULT_PARTY.roles;
  const attending = rsvps.filter(r => r.status === 'attending' && r.assignedRole);

  roles.forEach(role => {
    const claimRecord = attending.find(r => r.assignedRole && r.assignedRole.id === role.id);
    const card = document.createElement('div');
    card.className = `role-matrix-card ${claimRecord ? 'claimed' : 'unclaimed'}`;

    const clues = role.clueCards || [];

    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.8rem; border-bottom: 1px solid rgba(201,158,50,0.25); padding-bottom: 0.6rem;">
        <div style="display: flex; align-items: center; gap: 0.7rem;">
          <span style="font-size: 1.8rem; color: var(--gold-glow);">${role.symbol || '✦'}</span>
          <div>
            <div style="font-family: var(--font-title); font-size: 1.05rem; font-weight: 700; color: #fff;">${role.roleTitle || role.name}</div>
            <div style="font-size: 0.8rem; color: var(--gold-glow);">${role.archetype}</div>
          </div>
        </div>
        <span class="alignment-badge ${role.badgeClass || 'badge-guest'}" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">${role.alignment}</span>
      </div>

      <div style="font-size: 0.85rem; padding: 0.2rem 0;">
        ${claimRecord ? 
          `<span style="color: #86efac; font-weight: 600;">✓ Assigned: ${claimRecord.name}</span>` : 
          `<span style="color: var(--text-muted); font-style: italic;">✦ Available in pool</span>`
        }
      </div>

      <!-- 3 Identity / Clue Cards Summary -->
      <div style="background: rgba(0,0,0,0.4); border-radius: 4px; padding: 0.75rem; border: 1px solid rgba(201,158,50,0.15); display: flex; flex-direction: column; gap: 0.5rem; flex-grow: 1;">
        <div style="font-family: var(--font-title); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-glow);">
          ✦ 3 Pre-Party Clue Cards:
        </div>
        ${clues.map((c, idx) => `
          <div style="font-size: 0.82rem; line-height: 1.4;">
            <span style="color: var(--crimson-wax); font-family: var(--font-title); font-size: 0.75rem; font-weight: 700;">#${idx + 1} ${c.label}:</span>
            <div style="color: #ded6c9; font-family: var(--font-letter); font-size: 0.95rem; margin-top: 0.1rem;">${c.text}</div>
          </div>
        `).join('')}
      </div>

      <button type="button" class="action-btn btn-inspect-role" data-role-id="${role.id}" style="margin-top: 0.4rem; padding: 0.5rem 0.8rem; font-size: 0.78rem; border-color: var(--gold-dark); color: var(--gold-glow); width: 100%;">
        <span>✦</span> Inspect Full Dossier & Objectives
      </button>
    `;

    container.appendChild(card);
  });

  // Attach inspect role click handlers
  document.querySelectorAll('.btn-inspect-role').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const roleId = e.currentTarget.getAttribute('data-role-id');
      const role = roles.find(r => r.id === roleId);
      if (role) {
        const claimRecord = attending.find(r => r.assignedRole && r.assignedRole.id === role.id);
        SoundEngine.playTypewriter();
        openIntelModal(role, claimRecord);
      }
    });
  });
}

/**
 * Render Catering & Chef's Notes
 */
function renderCateringSummary(rsvps) {
  const container = document.getElementById('catering-summary');
  const attending = rsvps.filter(r => r.status === 'attending');

  if (attending.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted);">No attending guests yet.</p>';
    return;
  }

  // Count dietary restrictions
  const dietCounts = {};
  const cocktailCounts = {};

  attending.forEach(guest => {
    // Diet
    const diets = (guest.dietary || 'Standard').split(',').map(s => s.trim());
    diets.forEach(d => {
      if (d && d !== 'None') {
        dietCounts[d] = (dietCounts[d] || 0) + 1;
      }
    });

    // Drink
    const drink = guest.drinkPreference || "Surprise Me";
    cocktailCounts[drink] = (cocktailCounts[drink] || 0) + 1;
  });

  let dietHtml = Object.keys(dietCounts).length > 0 
    ? Object.entries(dietCounts).map(([diet, count]) => `<li><strong>${diet}:</strong> ${count} guest(s)</li>`).join('')
    : '<li>All attending guests have standard dietary requirements.</li>';

  let drinkHtml = Object.entries(cocktailCounts)
    .map(([drink, count]) => `<li><strong>${drink}:</strong> ${count}</li>`).join('');

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
      <div>
        <h4 style="font-family: var(--font-title); color: var(--gold-glow); margin-bottom: 0.5rem;">
          ❧ Dietary Restrictions & Allergies
        </h4>
        <ul style="padding-left: 1.2rem; line-height: 1.8;">
          ${dietHtml}
        </ul>
      </div>

      <div>
        <h4 style="font-family: var(--font-title); color: var(--gold-glow); margin-bottom: 0.5rem;">
          ✦ Cocktail & Beverage Requests
        </h4>
        <ul style="padding-left: 1.2rem; line-height: 1.8;">
          ${drinkHtml}
        </ul>
      </div>
    </div>
  `;
}

/**
 * Render 3 House Clue Cards for Host
 */
function renderHouseClues(party) {
  const container = document.getElementById('admin-house-clues');
  if (!container) return;

  const clues = party.houseClues || [];
  container.innerHTML = clues.map(c => `
    <div class="house-clue-card">
      <div class="house-clue-header">
        <span class="house-clue-exhibit">${c.exhibit}</span>
        <span class="house-clue-loc">Suggested: ${c.location}</span>
      </div>
      <h4 class="house-clue-title">${c.title}</h4>
      <p class="house-clue-detail">"${c.detail}"</p>
    </div>
  `).join('');

  const printBtn = document.getElementById('btn-print-house-clues');
  if (printBtn && !printBtn.dataset.bound) {
    printBtn.dataset.bound = 'true';
    printBtn.addEventListener('click', () => {
      SoundEngine.playTypewriter();
      window.print();
    });
  }
}

/**
 * Setup Soundboard Buttons
 */
function setupSoundboard() {
  document.getElementById('cue-clock').addEventListener('click', () => {
    SoundEngine.playClockChime();
  });

  document.getElementById('cue-seal').addEventListener('click', () => {
    SoundEngine.playSealBreak();
  });

  document.getElementById('cue-stamp').addEventListener('click', () => {
    SoundEngine.playStamp();
  });

  document.getElementById('cue-chime').addEventListener('click', () => {
    SoundEngine.playMysteryChime();
  });
}

/**
 * Setup Admin Sound Toggle
 */
function setupAdminAudio() {
  const btn = document.getElementById('admin-sound-toggle');
  const icon = document.getElementById('admin-sound-icon');

  function update() {
    icon.textContent = SoundEngine.isMuted() ? 'Audio Off' : '♪ Audio On';
  }

  btn.addEventListener('click', () => {
    SoundEngine.toggleMute();
    update();
    if (!SoundEngine.isMuted()) SoundEngine.playTypewriter();
  });

  update();
}

/**
 * Setup Seed Demo, Clear, and CSV Export actions
 */
function setupRosterActions(party) {
  // Seed Demo
  document.getElementById('btn-seed-demo').addEventListener('click', async () => {
    if (confirm('Load 4 sample RSVP guests (Detective, Murderer, Doctor, Accomplice) to preview the table?')) {
      SoundEngine.playSealBreak();
      await PartyStorage.seedDemoData();
      loadAdminDashboard();
    }
  });

  // Clear RSVPs
  document.getElementById('btn-clear-rsvps').addEventListener('click', async () => {
    if (confirm('Clear all RSVPs and reset character roles to unassigned?')) {
      SoundEngine.playStamp();
      await PartyStorage.clearAllRSVPs();
      loadAdminDashboard();
    }
  });

  // Export CSV
  document.getElementById('btn-export-csv').addEventListener('click', async () => {
    SoundEngine.playTypewriter();
    const rsvps = await PartyStorage.getRSVPs();

    if (rsvps.length === 0) {
      alert('No RSVPs to export.');
      return;
    }

    const headers = ["Guest Name", "Status", "Assigned Character", "Archetype", "Alignment", "Secret Passphrase", "Dietary", "Cocktail Preference"];
    const rows = rsvps.map(r => [
      `"${r.name}"`,
      `"${r.status}"`,
      `"${r.assignedRole ? r.assignedRole.name : ''}"`,
      `"${r.assignedRole ? r.assignedRole.archetype : ''}"`,
      `"${r.assignedRole ? r.assignedRole.alignment : ''}"`,
      `"${r.assignedRole ? r.assignedRole.doorPasscode : ''}"`,
      `"${r.dietary || 'None'}"`,
      `"${r.drinkPreference || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `murder-mystery-guest-roster.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

/**
 * Open Host Intel Inspector Modal (Shows full identity card, alibi, what was witnessed, cleared evidence / murder weapon, motive, accomplice)
 */
function openIntelModal(role, guest = null) {
  const modal = document.getElementById('intel-modal');
  const body = document.getElementById('intel-modal-body');
  if (!modal || !body) return;

  const roleName = role.roleTitle || role.name;
  const badgeClass = role.badgeClass || 'badge-guest';
  const clues = role.clueCards || [];

  body.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.2rem; flex-wrap: wrap; gap: 0.8rem; border-bottom: 1px solid rgba(201,158,50,0.25); padding-bottom: 1rem;">
      <div style="display: flex; align-items: center; gap: 0.8rem;">
        <span style="font-size: 2.2rem; color: var(--gold-glow);">${role.symbol || '✦'}</span>
        <div>
          <h2 style="font-family: var(--font-title); font-size: 1.5rem; color: #fff; margin: 0;">${roleName}</h2>
          <div style="font-size: 0.85rem; color: var(--gold-glow);">${role.archetype}</div>
          ${guest ? `
            <div style="margin-top: 0.35rem; font-size: 0.95rem; color: #86efac; font-weight: 600;">
              ✓ Assigned Guest: ${guest.name} ${guest.plusOne ? `(+1: ${guest.plusOneName || 'Guest'})` : ''}
            </div>
          ` : `
            <div style="margin-top: 0.35rem; font-size: 0.85rem; color: var(--text-muted); font-style: italic;">
              ✦ Unassigned (Available in Pool)
            </div>
          `}
        </div>
      </div>
      <div>
        <span class="alignment-badge ${badgeClass}" style="font-size: 0.85rem; padding: 0.35rem 0.8rem;">${role.alignment}</span>
      </div>
    </div>

    <!-- Passcode & Guest Preference Strip -->
    <div class="passcode-strip" style="margin-bottom: 1.2rem;">
      <div>
        <div style="font-family: var(--font-title); font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-glow);">Secret Door Passcode</div>
        <div class="passcode-text" style="font-size: 1.1rem; font-weight: 600; color: #fff;">"${role.doorPasscode || 'No Passcode'}"</div>
      </div>
      ${guest && guest.drinkPreference ? `
        <div style="text-align: right;">
          <div style="font-family: var(--font-title); font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--gold-glow);">Drink Order</div>
          <div style="font-size: 0.95rem; color: #fff;">✦ ${guest.drinkPreference}</div>
        </div>
      ` : ''}
    </div>

    <!-- Character Background & Secret Objective -->
    <div style="background: rgba(0,0,0,0.3); border: 1px solid rgba(201,158,50,0.3); border-radius: 4px; padding: 1.1rem; margin-bottom: 1.5rem;">
      <div style="margin-bottom: 1rem;">
        <h4 style="font-family: var(--font-title); font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-glow); margin-bottom: 0.3rem;">
          <span>✦</span> Character Background
        </h4>
        <p style="font-family: var(--font-letter); font-size: 1.05rem; color: #e5ded4; line-height: 1.5; margin: 0;">${role.bio}</p>
      </div>

      <div style="margin-bottom: 1rem; background: rgba(185, 28, 28, 0.15); border-left: 3px solid var(--crimson-wax); padding: 0.8rem 1rem; border-radius: 2px;">
        <h4 style="font-family: var(--font-title); font-size: 0.85rem; letter-spacing: 0.12em; text-transform: uppercase; color: #fca5a5; margin-bottom: 0.3rem;">
          <span>§</span> Confidential Objective
        </h4>
        <p style="font-family: var(--font-letter); font-size: 1.05rem; color: #fff; font-style: italic; line-height: 1.5; margin: 0;">${role.secretObjective}</p>
      </div>

      ${role.costumeGuide ? `
        <div>
          <h4 style="font-family: var(--font-title); font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-glow); margin-bottom: 0.2rem;">
            <span>❧</span> Suggested Costume Attire
          </h4>
          <p style="font-size: 0.95rem; color: #c9bea9; line-height: 1.4; margin: 0;">${role.costumeGuide}</p>
        </div>
      ` : ''}
    </div>

    <!-- 3 Confidential Pre-Party Clue Cards -->
    <div>
      <h3 style="font-family: var(--font-title); font-size: 1.15rem; color: var(--gold-glow); margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.5rem;">
        <span>✦</span> Assigned 3 Pre-Party Clue Cards
      </h3>
      <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem; font-style: italic;">
        Revealed to this guest upon RSVP. These include their verified alibi, what they witnessed, and cleared evidence (or murder weapon, motive, and accomplice):
      </p>

      <div style="display: flex; flex-direction: column; gap: 0.8rem;">
        ${clues.map((card, idx) => `
          <div class="intel-card" style="border-left: 3px solid var(--crimson-wax); background: #181410;">
            <div class="intel-card-badge">CLUE #${idx + 1} • CONFIDENTIAL INTEL</div>
            <div class="intel-card-label">${card.label}</div>
            <div class="intel-card-text">${card.text}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  modal.style.display = 'flex';
}

/**
 * Setup Intel Modal Listeners
 */
function setupIntelModalHandlers() {
  const modal = document.getElementById('intel-modal');
  const closeBtn = document.getElementById('btn-close-intel-modal');
  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}
