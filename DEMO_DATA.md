# SkillForge Safe Demo Data & Two-Student Workflow

**Maintained by:** Dhruv (Full-Stack MERN Developer)  
**Project:** SkillForge Peer-to-Peer Skill Exchange

The demo seeder creates fictional student profiles using the existing `User` and `Skill` models and the skill catalogue. It does not create synthetic reviews, exchange requests, sessions, conversations, messages, ratings, or artificial activity metrics. Profiles without a valid completed-session review appear as new, with no rating.

The User schema has no year-of-study field, so the demo profiles do not invent one. Their profile photos use the app's existing initials fallback rather than external images. Demo email addresses use the reserved `.invalid` domain under `@profiles.skillforge.invalid`.

## Seed a development database

The seeder reads `MONGODB_URI` from the shell or `server/.env` and connects to the development database. It refuses `NODE_ENV=production`, requires an explicit mode and confirmation, skips any existing reserved demo email without changing it, and stores only a bcrypt password hash. By default, it accepts only a local MongoDB host.

In PowerShell, configure the private development environment and run:

```powershell
$env:NODE_ENV = 'development'
$env:DEMO_SEED_CONFIRM = 'CREATE_DEMO_DATA'
$securePassword = Read-Host 'Enter a private password for the demo accounts (8-72 UTF-8 bytes)' -AsSecureString
$env:DEMO_SEED_PASSWORD = [System.Net.NetworkCredential]::new('', $securePassword).Password
npm run seed:demo --workspace server -- --apply
```

For a remote MongoDB development cluster, first verify that `MONGODB_URI` points to a dedicated development database, then explicitly opt in:

```powershell
$env:DEMO_SEED_ALLOW_REMOTE = 'true'
```

Never set this opt-in for production or point the seeder at production. The command does not print the URI or password.

## Reset seeder-owned demo data

Reset removes only accounts carrying the private `demoSeedKey` marker created by this script, along with their linked requests, sessions, conversations, messages, and reviews. Existing accounts that merely share a reserved email are skipped during seeding and are not reset.

```powershell
$env:NODE_ENV = 'development'
$env:DEMO_SEED_CONFIRM = 'RESET_DEMO_DATA'
npm run seed:demo --workspace server -- --reset
```

Reset intentionally removes workflow data connected to seeded demo accounts, including requests initiated by another account to a demo profile. The skill catalogue and unrelated users and records are retained. The password is not required for reset.

To remove the seeder confirmations after use:

```powershell
Remove-Item Env:DEMO_SEED_CONFIRM -ErrorAction SilentlyContinue
Remove-Item Env:DEMO_SEED_PASSWORD -ErrorAction SilentlyContinue
Remove-Item Env:DEMO_SEED_ALLOW_REMOTE -ErrorAction SilentlyContinue
```

Also clear the local PowerShell variables when finished:

```powershell
$env:DEMO_SEED_PASSWORD = $null
Remove-Variable securePassword -ErrorAction SilentlyContinue
```

## Fictional Profiles & Skills

All proficiencies use the app's supported `BEGINNER`, `INTERMEDIATE`, `ADVANCED`, and `EXPERT` values. Matches and scores are calculated by the SkillForge matching service.

| Student | Can teach | Wants to learn | Availability |
|---|---|---|---|
| Aarav Mehta | React (Advanced), JavaScript (Advanced), Node.js (Intermediate) | UI/UX Design (Beginner), Data Science (Beginner) | Mon, Wed, Sat |
| Ananya Sharma | UI/UX Design (Advanced), Figma (Advanced), Graphic Design (Intermediate) | React (Beginner), Python (Beginner) | Tue, Thu, Sun |
| Jordan Taylor | Python (Advanced), Data Science (Advanced) | React (Intermediate), Node.js (Beginner) | Mon, Fri, Sat |
| Elena Rostova | Spanish (Advanced), French (Expert) | Python (Beginner), Photography (Beginner) | Wed, Thu, Sat |
| Liam Vance | HTML (Advanced), CSS (Advanced), TypeScript (Intermediate) | JavaScript (Intermediate), Piano (Beginner) | Tue, Wed, Fri |
| Sophia Patel | Photography (Advanced), Video Editing (Advanced) | Spanish (Intermediate), Figma (Beginner) | Mon, Thu, Sun |
| Dev Sharma | Guitar (Expert), Piano (Intermediate) | Video Editing (Beginner), Public Speaking (Beginner) | Tue, Sat, Sun |
| Aisha Okafor | Public Speaking (Advanced), Academic Writing (Advanced) | Spanish (Beginner), Guitar (Beginner) | Mon, Wed, Fri |
| Lucas Morales | JavaScript (Advanced), Node.js (Intermediate) | French (Beginner), CSS (Intermediate) | Wed, Fri, Sun |
| Chloe Bennett | Graphic Design (Advanced), Figma (Intermediate) | Photography (Beginner), UI/UX Design (Intermediate) | Thu, Fri, Sat |
| Marcus Sterling | Video Editing (Advanced), Photography (Intermediate) | JavaScript (Beginner), Piano (Beginner) | Mon, Tue, Thu |
| Priya Nair | Public Speaking (Advanced), Academic Writing (Intermediate) | React (Beginner), Figma (Beginner) | Tue, Wed, Sat |
| Tariq Mansoor | CSS (Advanced), HTML (Advanced) | Python (Intermediate), Guitar (Beginner) | Mon, Thu, Sat |
| Nina Kovacs | Piano (Advanced), French (Intermediate) | Python (Beginner), Academic Writing (Intermediate) | Wed, Fri, Sat |

## Demonstrate the real exchange workflow

Use two separate browser profiles (not two tabs or incognito windows sharing one cookie jar). Sign both in with the private demo password supplied to the seeder:

- Student A: `demo.aarav.mehta@profiles.skillforge.invalid`
- Student B: `demo.ananya.sharma@profiles.skillforge.invalid`

1. In Student A's browser, open Discover, find Ananya, inspect her profile and earned badges, and send an exchange request for UI/UX Design. Optionally offer React.
2. In Student B's browser, open Received requests and accept the request.
3. Either participant can propose a session from the accepted exchange. Choose a future time and a duration between 15 minutes and 4 hours.
4. Confirm the proposal in the other browser. Open Messages in both browsers and exchange messages; verify real-time Socket.IO chat and the unread indicator.
5. Wait until the scheduled end time, then complete the confirmed session. The API correctly refuses early completion.
6. Submit a review from Reviews after completion. Verify the newly unlocked badge and real rating on Student A's Discover card and profile.

The usual manual process includes waiting for the session's scheduled end because completion is intentionally restricted until then. Do not alter database status directly to speed up a product demonstration.

## Verification Checks

```powershell
npm test --workspace server
npm run lint
npm run build
```

The tests cover seed fixture repeatability, safety gates, matching score distribution, gamification logic, and verified minimum-rating filtering before pagination.
