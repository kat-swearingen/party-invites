# 🕯️ The Midnight Manor Murder — Party Invitation & Dossier Portal

A boutique, interactive party portal designed for **monthly dinner parties**, starting with an immersive **1920s Murder Mystery Dinner Party (8–16 players)** featuring secret role distribution, interactive wax-seal envelope reveals, game master controls, and dietary tracking.

---

## 🌟 Key Features

### 1. The Guest Experience (Fun & Immersive)
- **Break the Wax Seal**: Guests tap an interactive 3D wax seal with authentic snap, crackle, and paper rustle sounds (synthesized in pure Web Audio — no external mp3 files required!).
- **Secret Role Assignment**: When each guest RSVPs, they are automatically allocated a unique mystery persona (similar to Mafia/Werewolf: *The Sleuth, The Murderer, The Doctor, The Accomplice, The Butler, The Clairvoyant Medium*, etc.).
- **Top Secret Character Dossier**:
  - **Public Persona & Bio**: What they tell other guests over cocktails.
  - **Classified Mission & Objective**: A private mission during dinner with an **interactive Privacy Shield** ("Tap to Reveal / Hide") so dinner table neighbors cannot sneak a peek at their phone!
  - **Costume & Prop Ideas**: What vintage attire or props to bring.
  - **Door Passphrase**: Secret password to whisper upon arrival.
- **Add to Calendar**: One-click `.ics` export for Apple Calendar, Google Calendar, and Outlook.
- **Dietary & Cocktail Preferences**: Collects food allergies, vegan/vegetarian requirements, and cocktail preferences.

### 2. The Host Command Center (`admin.html`)
- **Protected by Host PIN** (Default: `1920` — easily changeable).
- **Master Guest & Role Matrix**: See who has claimed which character, who the secret killer is, and re-assign or swap roles with a single click.
- **Dietary & Catering Breakdown**: Instant tally of dietary restrictions (Vegetarian, Vegan, Gluten-Free, Allergies) and drink requests for easy meal prep.
- **Party Night Soundboard**: Play dramatic audio cues right from your phone or iPad during dinner:
  - *Grandfather Clock Chime* (7:00 PM Arrival)
  - *Wax Seal Snap* (Reading Secret Warrants)
  - *Confidential Stamp Thud*
  - *THE MURDER STING!* (8:30 PM Lights Out)
- **Monthly Party Switcher**: Switch themes for your next monthly party in 1 click! Pre-loaded with:
  1. *The Midnight Manor Murder* (1920s Gothic Whodunit)
  2. *The St. Valentine Speakeasy Heist* (1920s Chicago Mobsters & Jazz)
  3. *Masquerade of the Silver Phantom* (Venetian High Society)
  4. *Casino Royale: Betrayal in Monaco* (007 Spy Thriller)
- **Export CSV**: Download a complete spreadsheet of all RSVPs and secret roles.
- **Seed Demo Guests**: One-click button to load sample guests so you can preview what a full party looks like.

---

## 🚀 Quick Start Guide

### Option A: Using the Local Server (Recommended for home network sync)
Macs come with Ruby built-in, so no installations are needed:

1. Open Terminal and run:
   ```bash
   cd "/Users/katswearingen/Documents/anitgravity/party invitess"
   ./start.sh
   ```
2. Your browser will display:
   - **Guest Invitation**: `http://localhost:8000`
   - **Host Command Center**: `http://localhost:8000/admin.html` (PIN: `1920`)
   - **Phones on same WiFi**: `http://<YOUR-MAC-IP>:8000` (printed in the terminal output)

### Option B: Standalone / Direct Browser Launch
You can also open `index.html` directly in Safari or Chrome:
- Double-click `index.html` to open the guest portal.
- Double-click `admin.html` to open the Host Command Center.
- Everything runs seamlessly with automatic LocalStorage fallback!

### Option C: Share Online with Friends Anywhere
To share the link with friends outside your home network:
- **Free Cloudflare Tunnel**:
  ```bash
  npx cloudflared tunnel --url http://localhost:8000
  ```
  *(Gives you a secure public `https://...trycloudflare.com` link to text to friends)*
- **Or Deploy to Netlify / Vercel / GitHub Pages**:
  The project has zero build step! You can drag-and-drop this folder straight into Netlify Drop or Vercel.

---

## 🎭 The 16 Mystery Characters & Priority Balancing

When guests RSVP, the system guarantees a balanced game regardless of final headcount by prioritizing core roles first:

| Priority | Character Name | Archetype | Alignment | Role Purpose |
|:---|:---|:---|:---|:---|
| **Tier 1** | Inspector Reginald Vance | The Uninvited Sleuth | Town (Investigator) | Scotland Yard detective solving the murder |
| **Tier 1** | Countess Victoria Blackwood | The Mastermind | Mafia (The Killer) | The secret murderer deflecting suspicion |
| **Tier 1** | Dr. Alistair Finch | The Morbid Physician | Town (Protector) | The doctor examining poisons and bodies |
| **Tier 2** | Julian Cross | The Loyal Shadow | Mafia (Accomplice) | Planting false clues to protect the Countess |
| **Tier 2** | Arthur Higgins | The Stoic Butler | Town (The Witness) | Knows secret passages and saw someone slip away |
| **Tier 2** | Genevieve De La Tour | The Glamorous Gossip | Town (Informant) | Collecting scandalous secrets from guests |
| **Tier 3** | Madame Zara | The Clairvoyant Medium | Wildcard (The Seer) | Conducting an impromptu tarot card séance |
| **Tier 3** | Felix 'Lucky' Malone | The High-Roller | Wildcard (Debtor) | Gambler looking for the stolen will |
| **Tier 3** | Professor Silas Thorne | The Toxicologist | Town (Scholar) | Identifying exotic botanicals & poisons |
| **Tier 3** | Clarissa Hayes | The Undercover Reporter | Town (Exposer) | Press reporter threatening to publish headlines |
| **Tier 4** | Cordelia Fontanne | The Opera Diva | Town (Distraction) | Stages a dramatic scene during dinner |
| **Tier 4** | Baron Viktor Von Berg | The Foreign Envoy | Wildcard (Diplomat) | Haughtily claiming diplomatic immunity |
| **Tier 4** | Sebastian Graves | The Morbid Poet | Town (Eccentric) | Reciting cryptic verse with clues |
| **Tier 4** | Marcus 'The Wall' Stone | The Silent Enforcer | Town (Bodyguard) | Guarding the dining room doors |
| **Tier 5** | Margot Dubois | The Disdainful Sommelier| Town (Connoisseur) | Poured the poisoned vintage wine |
| **Tier 5** | Silvia Vance | The Estranged Sister | Town (Disinherited Heir)| Searching for the hidden family jewels |

---

## 📁 Project Structure

```
party invitess/
├── index.html            # Main guest invitation & secret dossier app
├── admin.html            # Host Command Center & Theme Manager
├── css/
│   └── styles.css        # Vintage noir styling, parchment, seals, responsive layout
├── js/
│   ├── audio.js          # Pure Web Audio synthesizer (no audio files needed!)
│   ├── data.js           # 16 characters, schedule, story, and monthly presets
│   ├── storage.js        # Data layer with automatic LocalStorage & API support
│   ├── app.js            # Guest RSVP, wax seal animation, dossier privacy toggle
│   └── admin.js          # Roster table, role matrix, catering notes, soundboard
├── server.rb             # Built-in Ruby WEBrick REST server
├── start.sh              # One-click startup shell script
└── README.md             # Complete documentation
```
