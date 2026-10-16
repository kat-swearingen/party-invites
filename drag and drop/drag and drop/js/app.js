/**
 * Main Application Logic for Party Portal
 * Features:
 * 1. 12-Month Calendar view with 3D Flipping Navy Blue Envelope (hover to flip, click to open)
 * 2. Unsealing transition into the Victorian Summons Letter
 * 3. Passed savouries, specialty cocktails, and BYOB/wine notes
 * 4. Automatic secret role allocation & classified parlour dossier reveal
 * 5. 100% emoji-free Victorian aesthetic
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Check if API server is available
  await PartyStorage.checkServer();

  // Load active party
  const party = await PartyStorage.getParty();
  populatePartyInfo(party);

  // Setup sound controls
  setupAudioControls();

  // Setup 12-Month Calendar Grid with 3D Flip Envelope
  setupCalendarGrid(party);

  // Setup Wax Seal
  setupWaxSeal();

  // Setup Dietary Chips
  setupDietaryChips();

  // Setup RSVP Form
  setupRSVPForm(party);

  // Setup Guest Identity Lookup (Check My Role)
  setupGuestLookup(party);

  // Check if guest has an existing RSVP
  await checkExistingRSVP(party);
});

/**
 * Render the 12-Month Calendar Envelopes
 * Active envelope is a 3D flip card that flips on hover revealing details on the back!
 */
function setupCalendarGrid(party) {
  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  const calendarItems = (typeof ANNUAL_CALENDAR !== 'undefined') ? ANNUAL_CALENDAR : [];

  calendarItems.forEach(item => {
    const isActive = item.status === 'active';

    if (isActive) {
      const card = document.createElement('div');
      card.className = 'month-envelope active-navy-envelope';
      card.id = 'active-month-card';
      card.title = 'Click to break the seal and view invitation';
      
      card.innerHTML = `
        <div class="envelope-body">
          <h2 class="envelope-title">Murder Mystery</h2>
          <div class="envelope-date-text">October 23, 2026</div>
          <div class="fancy-wax-seal">
            <div class="seal-crest">⚜</div>
            <div class="seal-monogram">KS</div>
          </div>
          <div class="envelope-break-seal">break seal to open</div>
        </div>
      `;

      // Clicking unseals the letter and enters the parlour
      card.addEventListener('click', () => {
        SoundEngine.playSealBreak();
        openInvitationView();
      });

      grid.appendChild(card);
    } else {
      const card = document.createElement('div');
      card.className = 'month-envelope grayed-locked';
      card.title = `${item.monthName}: ${item.releaseDate || 'Classified'}`;
      card.innerHTML = `
        <div class="envelope-month-tag">
          <span>${item.monthName.toUpperCase()} ${item.year}</span>
          <span>SEALED</span>
        </div>
        <div class="envelope-body">
          <h3 class="envelope-title">${item.eventTitle}</h3>
          <div class="envelope-subtitle">${item.subtitle}</div>
          <div class="envelope-seal">${item.sealText || 'S'}</div>
        </div>
        <div style="font-size: 0.75rem; text-align: center; color: #71695f; margin-top: 0.5rem; font-style: italic;">
          ${item.releaseDate || 'Unlocks Next Month'}
        </div>
      `;

      card.addEventListener('click', () => {
        SoundEngine.playStamp();
        alert(`This summons for ${item.monthName} is sealed in the archives! It will unlock next month.`);
      });

      grid.appendChild(card);
    }
  });

  // Nav back to calendar button
  const backBtn = document.getElementById('btn-nav-calendar');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      SoundEngine.playTypewriter();
      showCalendarView();
    });
  }
}

/**
 * Open the Invitation View
 */
function openInvitationView() {
  const calView = document.getElementById('calendar-view');
  const invView = document.getElementById('invitation-view');
  const backBtn = document.getElementById('btn-nav-calendar');

  calView.style.display = 'none';
  invView.style.display = 'block';
  if (backBtn) backBtn.style.display = 'inline-flex';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Return to the Calendar View
 */
function showCalendarView() {
  const calView = document.getElementById('calendar-view');
  const invView = document.getElementById('invitation-view');
  const backBtn = document.getElementById('btn-nav-calendar');

  invView.style.display = 'none';
  calView.style.display = 'block';
  if (backBtn) backBtn.style.display = 'none';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Populate Party Information into the page
 */
function populatePartyInfo(party) {
  document.getElementById('party-title').textContent = party.title || "Murder Mystery Dinner";
  document.getElementById('party-tagline').textContent = party.subtitle || party.tagline || "A Parlour Gathering of Deceit, Secrets, and Sudden Demise";
  document.getElementById('theme-pill-text').textContent = party.title || "Murder Mystery Dinner";

  if (party.foodAndDrinkNote) {
    document.getElementById('food-drink-note').textContent = party.foodAndDrinkNote;
  }

  // Format date & time
  if (party.date) {
    try {
      const d = new Date(party.date + 'T12:00:00');
      const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      document.getElementById('party-datetime').textContent = `${dateStr} • ${party.time || '8:00 PM'}`;
    } catch (e) {
      document.getElementById('party-datetime').textContent = `${party.date} • ${party.time}`;
    }
  }

  document.getElementById('party-venue').textContent = party.locationName || 'Private Residence';
  
  const myRsvpId = localStorage.getItem('party_portal_my_rsvp_id');
  if (party.revealAddressOnRsvp && !myRsvpId) {
    document.getElementById('party-address').innerHTML = `<span style="opacity: 0.8; font-style: italic;">Address revealed upon RSVP</span>`;
  } else {
    document.getElementById('party-address').textContent = party.address || 'Address provided upon RSVP';
  }

  document.getElementById('party-dresscode').textContent = party.dressCode || "Murder Mystery Upscale & Fun — Try to dress in theme with your character!";
  document.getElementById('party-story').innerHTML = `<span class="victorian-dropcap">Y</span>ou are most cordially summoned to an intimate parlour gathering at the estate. With the storm raging across the moors and the carriage bridge washed out, an unsolved demise has cast a shadow across our halls. The conspirator is undeniably among our parlour companions. You have been summoned. Keep your friends close, your drink in hand, and your secrets closer.`;
  document.getElementById('host-name').textContent = party.hostName || 'Your Enigmatic Host';
  document.getElementById('host-note').textContent = `"${party.hostNote}"`;

  // Render Schedule
  const scheduleContainer = document.getElementById('party-schedule');
  scheduleContainer.innerHTML = '';
  if (party.schedule && party.schedule.length > 0) {
    party.schedule.forEach(item => {
      const div = document.createElement('div');
      div.className = 'timeline-item';
      div.innerHTML = `
        <div class="timeline-time">${item.time}</div>
        <div class="timeline-content">
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      `;
      scheduleContainer.appendChild(div);
    });
  }
}

/**
 * Audio Control Toggle
 */
function setupAudioControls() {
  const btn = document.getElementById('sound-toggle-btn');
  const label = document.getElementById('sound-label');

  function updateDisplay() {
    const muted = SoundEngine.isMuted();
    label.textContent = muted ? 'Audio: Off' : 'Audio: On';
  }

  btn.addEventListener('click', () => {
    SoundEngine.toggleMute();
    updateDisplay();
    if (!SoundEngine.isMuted()) {
      SoundEngine.playTypewriter();
    }
  });

  updateDisplay();
}

/**
 * Wax Seal Click & Break
 */
function setupWaxSeal() {
  const sealBtn = document.getElementById('wax-seal-btn');
  const seal = document.getElementById('wax-seal');
  const prompt = document.getElementById('seal-prompt');

  sealBtn.addEventListener('click', () => {
    SoundEngine.playSealBreak();
    seal.classList.add('broken');
    prompt.textContent = '✦ Summons Unsealed ✦';

    setTimeout(() => {
      const rsvp = document.getElementById('rsvp-section');
      rsvp.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 450);
  });
}

/**
 * Dietary Chips Quick-Select
 */
function setupDietaryChips() {
  const chips = document.querySelectorAll('.diet-chip');
  const input = document.getElementById('guest-dietary');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      SoundEngine.playTypewriter();
      const diet = chip.getAttribute('data-diet');

      if (diet === 'None') {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        input.value = 'None';
        return;
      }

      document.querySelector('.diet-chip[data-diet="None"]').classList.remove('active');
      chip.classList.toggle('active');

      const activeChips = Array.from(document.querySelectorAll('.diet-chip.active'))
        .map(c => c.getAttribute('data-diet'));

      input.value = activeChips.join(', ');
    });
  });
}

/**
 * RSVP Form Handler
 */
function setupRSVPForm(party) {
  const form = document.getElementById('rsvp-form');
  const btnYes = document.getElementById('btn-status-yes');
  const btnNo = document.getElementById('btn-status-no');
  const statusInput = document.getElementById('input-status');
  const submitBtn = document.getElementById('submit-btn');
  const dietaryGroup = document.getElementById('group-dietary');
  const drinksGroup = document.getElementById('group-drinks');

  btnYes.addEventListener('click', () => {
    SoundEngine.playTypewriter();
    btnYes.classList.add('selected-yes');
    btnNo.classList.remove('selected-no');
    statusInput.value = 'attending';
    submitBtn.innerHTML = `<span>Accept Summons & Reveal Secret Role</span>`;
    dietaryGroup.style.display = 'block';
    drinksGroup.style.display = 'block';
  });

  btnNo.addEventListener('click', () => {
    SoundEngine.playTypewriter();
    btnNo.classList.add('selected-no');
    btnYes.classList.remove('selected-yes');
    statusInput.value = 'declined';
    submitBtn.innerHTML = `<span>Submit Regrets</span>`;
    dietaryGroup.style.display = 'none';
    drinksGroup.style.display = 'none';
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('guest-name').value;
    const status = statusInput.value;
    const dietary = document.getElementById('guest-dietary').value;
    const drink = document.getElementById('guest-drink').value;

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    SoundEngine.playStamp();
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    try {
      const rsvp = await PartyStorage.submitRSVP({
        name,
        status,
        dietary: dietary || 'None',
        drinkPreference: drink
      });

      if (status === 'attending' && rsvp.assignedRole) {
        setTimeout(() => SoundEngine.playMysteryChime(), 350);
        renderDossier(rsvp, party);
      } else {
        alert(`Thank you, ${name}. Your regrets have been recorded with sorrow. We hope you can join us for next month's gathering.`);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your RSVP. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
    }
  });

  // Secret Objective Privacy Shield
  const secretBox = document.getElementById('secret-objective-box');
  const secretOverlay = document.getElementById('secret-reveal-overlay');
  if (secretOverlay) {
    secretOverlay.addEventListener('click', () => {
      SoundEngine.playSealBreak();
      secretBox.classList.toggle('blurred');
      if (secretBox.classList.contains('blurred')) {
        secretOverlay.style.display = 'flex';
      } else {
        secretOverlay.style.display = 'none';
      }
    });

    secretBox.addEventListener('click', (e) => {
      if (!secretBox.classList.contains('blurred') && e.target !== secretOverlay) {
        secretBox.classList.add('blurred');
        secretOverlay.style.display = 'flex';
        SoundEngine.playTypewriter();
      }
    });
  }

  setupDossierActions(party);
}

/**
 * Setup Guest Lookup (Check My Role)
 * Guests enter the exact name they signed up with to reveal their role, intel, and submission details
 */
function setupGuestLookup(party) {
  const lookupBtns = [
    document.getElementById('btn-lookup-role'),
    document.getElementById('btn-lookup-role-cal')
  ].filter(Boolean);
  const lookupModal = document.getElementById('lookup-modal');
  const lookupClose = document.getElementById('btn-close-lookup');
  const lookupForm = document.getElementById('lookup-form');
  const lookupInput = document.getElementById('lookup-name-input');
  const lookupError = document.getElementById('lookup-error-msg');

  if (lookupBtns.length === 0 || !lookupModal) return;

  function openLookup() {
    SoundEngine.playTypewriter();
    lookupModal.style.display = 'flex';
    if (lookupError) {
      lookupError.style.display = 'none';
      lookupError.textContent = '';
    }
    if (lookupInput) {
      lookupInput.value = '';
      setTimeout(() => lookupInput.focus(), 80);
    }
  }

  function closeLookup() {
    SoundEngine.playTypewriter();
    lookupModal.style.display = 'none';
  }

  lookupBtns.forEach(btn => btn.addEventListener('click', openLookup));
  if (lookupClose) lookupClose.addEventListener('click', closeLookup);

  lookupModal.addEventListener('click', (e) => {
    if (e.target === lookupModal) {
      closeLookup();
    }
  });

  if (lookupForm) {
    lookupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const query = lookupInput ? lookupInput.value.trim() : '';
      if (!query) return;

      const submitBtn = document.getElementById('btn-submit-lookup');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
      }

      try {
        const guest = await PartyStorage.getRSVPByName(query);

        if (!guest) {
          SoundEngine.playStamp();
          if (lookupError) {
            lookupError.textContent = `No invitation on file found under "${query}". Please verify the exact spelling, or submit your RSVP in the form above!`;
            lookupError.style.display = 'block';
          }
          return;
        }

        if (guest.status === 'declined') {
          SoundEngine.playStamp();
          if (lookupError) {
            lookupError.textContent = `Your RSVP on file was recorded as "Declined (Regrets)". If your plans have changed, please submit an attending RSVP above to claim a secret role!`;
            lookupError.style.display = 'block';
          }
          return;
        }

        if (guest.status === 'attending' && guest.assignedRole) {
          // Success! Unlock dossier and ensure invitation view is visible
          closeLookup();
          openInvitationView();
          localStorage.setItem('parlour_my_rsvp', guest.id);
          const seal = document.getElementById('wax-seal');
          if (seal) seal.classList.add('broken');
          const prompt = document.getElementById('seal-prompt');
          if (prompt) prompt.textContent = '✦ Welcome Back ✦';
          SoundEngine.playMysteryChime();
          renderDossier(guest, party, true);
        } else {
          SoundEngine.playStamp();
          if (lookupError) {
            lookupError.textContent = `An RSVP for "${guest.name}" was found, but no character role has been assigned yet. Please submit your RSVP above to receive your role!`;
            lookupError.style.display = 'block';
          }
        }
      } catch (err) {
        console.error(err);
        if (lookupError) {
          lookupError.textContent = 'A connection error occurred while querying the parlour archives. Please try again.';
          lookupError.style.display = 'block';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }
    });
  }
}

/**
 * Check if the guest already has a recorded RSVP
 */
async function checkExistingRSVP(party) {
  const existing = await PartyStorage.getMyRSVP();
  if (existing && existing.status === 'attending' && existing.assignedRole) {
    document.getElementById('wax-seal').classList.add('broken');
    document.getElementById('seal-prompt').textContent = '✦ Welcome Back ✦';
    renderDossier(existing, party, false);
  }
}

/**
 * Render Classified Dossier on screen
 */
function renderDossier(rsvp, party, scrollIntoView = true) {
  const role = rsvp.assignedRole;
  if (!role) return;

  const dossierSection = document.getElementById('dossier-section');
  dossierSection.style.display = 'block';

  document.getElementById('dossier-ref-code').textContent = `PARLOUR FILE: #${role.id.toUpperCase()}`;
  document.getElementById('dossier-symbol').textContent = role.symbol || '✦';
  document.getElementById('dossier-archetype').textContent = role.archetype || 'Special Guest';
  document.getElementById('dossier-character-name').textContent = role.roleTitle || role.name;
  document.getElementById('dossier-guest-name').textContent = rsvp.name;

  const badge = document.getElementById('dossier-badge');
  badge.textContent = role.alignment || 'Town';
  badge.className = `alignment-badge ${role.badgeClass || 'badge-guest'}`;

  document.getElementById('dossier-bio').textContent = role.bio;
  document.getElementById('dossier-objective').textContent = role.secretObjective;
  document.getElementById('dossier-costume').textContent = role.costumeGuide;
  document.getElementById('dossier-passcode').textContent = role.doorPasscode || "WHISPER AT DOOR: 'The shadows lengthen.'";

  // Populate What I Submitted Summary Box
  const summaryName = document.getElementById('summary-guest-name');
  const summaryDietary = document.getElementById('summary-guest-dietary');
  const summaryDrink = document.getElementById('summary-guest-drink');
  if (summaryName) summaryName.textContent = rsvp.name;
  if (summaryDietary) summaryDietary.textContent = rsvp.dietary || 'None';
  if (summaryDrink) summaryDrink.textContent = rsvp.drinkPreference || 'Surprise Me';

  // Wire up Edit Preferences button in summary box
  const editPrefBtn = document.getElementById('btn-edit-preferences');
  if (editPrefBtn) {
    editPrefBtn.onclick = () => {
      populateRSVPFormForEdit(rsvp);
    };
  }

  // Role Changed Warning Notice
  const alertBox = document.getElementById('dossier-role-changed-alert');
  const ackBtn = document.getElementById('btn-ack-role-change');
  if (alertBox) {
    if (rsvp.roleChanged) {
      alertBox.style.display = 'block';
      if (ackBtn) {
        ackBtn.onclick = async () => {
          SoundEngine.playStamp();
          await PartyStorage.acknowledgeRoleChange(rsvp.id);
          rsvp.roleChanged = false;
          alertBox.style.display = 'none';
        };
      }
    } else {
      alertBox.style.display = 'none';
    }
  }

  // Populate 3 Confidential Intel Clues
  const intelGrid = document.getElementById('dossier-intel-grid');
  if (intelGrid && role.clueCards && role.clueCards.length > 0) {
    intelGrid.innerHTML = role.clueCards.map((card, idx) => `
      <div class="intel-card">
        <div class="intel-card-badge">CLUE #${idx + 1}</div>
        <div class="intel-card-label">${card.label}</div>
        <div class="intel-card-text">${card.text}</div>
      </div>
    `).join('');
  }

  if (party && party.address) {
    document.getElementById('party-address').textContent = party.address;
  }

  const secretBox = document.getElementById('secret-objective-box');
  const secretOverlay = document.getElementById('secret-reveal-overlay');
  secretBox.classList.add('blurred');
  secretOverlay.style.display = 'flex';

  if (scrollIntoView) {
    setTimeout(() => {
      dossierSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }
}

/**
 * Pre-fill RSVP Form for editing preferences
 */
function populateRSVPFormForEdit(existing) {
  if (!existing) return;
  SoundEngine.playTypewriter();

  const nameInput = document.getElementById('guest-name');
  const dietaryInput = document.getElementById('guest-dietary');
  const drinkInput = document.getElementById('guest-drink');
  const btnYes = document.getElementById('btn-status-yes');

  if (nameInput) nameInput.value = existing.name || '';
  if (dietaryInput) dietaryInput.value = (existing.dietary && existing.dietary !== 'None') ? existing.dietary : '';
  if (drinkInput) drinkInput.value = existing.drinkPreference || 'Themed Specialty Cocktail';

  // Highlight dietary chips matching saved dietary
  if (existing.dietary) {
    const chips = document.querySelectorAll('.diet-chip');
    chips.forEach(c => {
      const diet = c.getAttribute('data-diet');
      if (diet && existing.dietary.includes(diet)) {
        c.classList.add('active');
      } else {
        c.classList.remove('active');
      }
    });
  }

  if (btnYes) btnYes.click();

  const rsvpSection = document.getElementById('rsvp-section');
  if (rsvpSection) {
    rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Setup Calendar, Print, and Edit actions
 */
function setupDossierActions(party) {
  const calBtn = document.getElementById('btn-add-calendar');
  calBtn.addEventListener('click', () => {
    SoundEngine.playTypewriter();
    generateIcsFile(party);
  });

  const printBtn = document.getElementById('btn-print-dossier');
  printBtn.addEventListener('click', () => {
    SoundEngine.playTypewriter();
    window.print();
  });

  const editBtn = document.getElementById('btn-edit-rsvp');
  editBtn.addEventListener('click', async () => {
    const existing = await PartyStorage.getMyRSVP();
    if (existing) {
      populateRSVPFormForEdit(existing);
    }
  });
}

/**
 * Generate iCalendar .ics file
 */
function generateIcsFile(party) {
  const title = party.title || "Murder Mystery Dinner";
  const desc = `${party.subtitle || party.tagline}\\n\\nFare: Passed Savouries & Themed Cocktails Provided (BYOB/Wine Welcome)\\n\\nDress Code: ${party.dressCode}\\n\\nStory: ${party.storyTeaser}`;
  const loc = `${party.locationName || 'Private Residence'}, ${party.address || ''}`;

  let startStr = "20261023T200000";
  let endStr = "20261023T233000";

  if (party.date) {
    const cleanDate = party.date.replace(/-/g, '');
    startStr = `${cleanDate}T200000`;
    endStr = `${cleanDate}T233000`;
  }

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Midnight Manor Party Portal//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:${title}`,
    `DESCRIPTION:${desc}`,
    `LOCATION:${loc}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `murder-mystery-invite.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
