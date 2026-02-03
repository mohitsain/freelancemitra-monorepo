# FreelanceMitra Chrome Extension

Chrome side panel extension that helps you:

1. **Onboard to Upwork** – Auto-fill your Upwork profile from your FreelanceMitra onboarding data.
2. **Create proposal from job** – Generate a proposal from an Upwork job description and auto-fill the proposal box.

## Requirements

- You must be **logged in** on FreelanceMitra (in the same browser).
- You must have **completed onboarding** on FreelanceMitra.

The extension uses your session cookies to call the FreelanceMitra backend. If you’re not logged in or not onboarded, the panel will show a message and a link to the website.

## Setup

1. **Configure base URL**  
   Edit `config.js` and set `BASE_URL` to the **exact URL where you open FreelanceMitra** in the browser, e.g.:
   - Local (dev server): `http://localhost:3000`
   - Local (Docker on port 80): `http://localhost`
   - Production: `https://your-domain.com`  
   The extension will try both `localhost:3000` and `localhost` for session cookies when using localhost, so either port usually works.

2. **Load the extension in Chrome**
   - Open `chrome://extensions`
   - Enable “Developer mode”
   - Click “Load unpacked”
   - Select the `ext-freelancemitra` folder

3. **Pin the extension** (optional)  
   Click the puzzle icon, pin “FreelanceMitra”, then click the extension icon to open the side panel.

## Extension not detecting login

- Ensure you’re logged in on FreelanceMitra in the **same Chrome profile** and that the site is open in a tab (or was opened recently).
- Set `BASE_URL` in `config.js` to the **exact address** you use (e.g. `http://localhost` if you use port 80, not `http://localhost:3000`).
- After changing `config.js`, reload the extension at `chrome://extensions` (click the reload icon on FreelanceMitra).

## Usage

- **Side panel**  
  Click the extension icon to open the side panel on the right. Resize the panel as needed (~20% width is typical).

- **Onboard to Upwork**  
  1. Open an Upwork profile or signup page.  
  2. In the side panel, click “Onboard to Upwork”.  
  3. The extension fills title, overview, and skills from your FreelanceMitra profile.  
  *(Upwork’s DOM may change; if fields aren’t filled, we may need to update selectors.)*

- **Create proposal from job**  
  1. Open an Upwork job posting.  
  2. In the side panel, click “Create proposal from job”.  
  3. Click “Use current page” to pull the job description, or paste it manually.  
  4. Click “Generate proposal”.  
  5. Copy the text or click “Fill on Upwork” to fill the proposal textarea on the apply page.

## Icons (optional)

To set extension icons, add PNG files:

- `icons/icon16.png` (16×16)
- `icons/icon48.png` (48×48)
- `icons/icon128.png` (128×128)

Then add to `manifest.json`:

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

You can copy/resize from `fe-freelancemitra/public/FreelanceMitraIcon.png`.

## Host permissions

The extension needs:

- **Your FreelanceMitra origin** – to read session cookies and call the API.
- **Upwork** – so the content script can read job description and fill profile/proposal fields.

## Troubleshooting

- **“Not logged in”** – Log in on FreelanceMitra in the same browser, then reopen the side panel.
- **“Complete onboarding”** – Finish onboarding on FreelanceMitra, then try again.
- **“Reload the Upwork page”** – Install or update the extension, then reload the Upwork tab so the content script loads.
- **Fields not filling on Upwork** – Upwork’s HTML may have changed; selectors in `content-upwork.js` may need to be updated.
