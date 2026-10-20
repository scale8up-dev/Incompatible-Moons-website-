# Incompatible Moons 🌕🌖

> **Where opposing orbits spark luminous realities.**  
> A bespoke landing page and contact transmission portal for **Incompatible Moons**, a boutique creative studio and digital atelier.

---

## 🌟 Overview & Highlights

- **Aesthetic Dual-Orbit Design**: Dark cosmic theme with violet/cyan contrast representing the union of poetic vision and precision engineering.
- **Interactive Ambient Canvas (`canvas.js`)**: Real-time 60fps simulation of dual orbiting celestial bodies in eccentric ellipses, animated twinkling starfield, and interactive gravitational wave ripples.
- **Interactive Contact Portal**:
  - Full client-side input validation with instant visual feedback and shake animations.
  - Interactive mission scope dropdown and investment range selectors.
  - Live message character counter.
  - Loading spinner & transmission confirmation badge with unique Signal IDs.
  - **Dual-mode Resilience**: Submits to the Express backend (`/api/contact`), and automatically falls back to browser `localStorage` if run standalone without a server.
- **Backend API & File Storage (`server.js`)**:
  - Express.js server serving static assets.
  - `POST /api/contact` endpoint with data sanitization, server-side validation, and persistence to `data/messages.json`.
  - `GET /api/health` system monitoring endpoint.
- **Fully Responsive**: Flawlessly optimized across mobile devices, tablets, and ultra-wide desktop monitors.
- **Zero Heavy Build Step Needed**: Runs immediately without bundlers or transpilation.

---

## 📁 Project Structure

```
incompatible-moons/
├── data/
│   └── messages.json         # Stores incoming contact transmissions
├── public/
│   ├── css/
│   │   └── style.css         # Cosmic design system, typography & responsive rules
│   ├── js/
│   │   ├── canvas.js         # Interactive background starfield & dual moons
│   │   └── main.js           # Form validation, navigation & API integration
│   └── index.html            # Semantic HTML5 landing page
├── package.json              # Project scripts & dependencies
├── server.js                 # Express server & contact API
└── README.md                 # Project documentation
```

---

## 🚀 Quick Start

### Option 1: Run with Node.js Server (Recommended)

1. Navigate to the project directory:
   ```bash
   cd /Users/hf/.gemini/antigravity/scratch/incompatible-moons
   ```

2. Start the server:
   ```bash
   npm start
   ```
   *(Or for auto-reload during development: `npm run dev`)*

3. Open your browser and navigate to:
   ```
   http://localhost:3456
   ```

---

### Option 2: Host via GitHub Pages (Free Worldwide Hosting)

The repository is configured for immediate deployment via GitHub Pages:

1. Go to your repository on GitHub:
   `https://github.com/scale8up-dev/Incompatible-Moons-website-/settings/pages`
2. Under **Build and deployment > Source**:
   - Choose **GitHub Actions** (it will automatically use the included `.github/workflows/deploy.yml` workflow), OR
   - Choose **Deploy from a branch** > branch: `master` > folder: `/ (root)` > Click **Save**.
3. Your site will be published at:
   ```
   https://scale8up-dev.github.io/Incompatible-Moons-website-/
   ```

> 💡 **Form Submissions on GitHub Pages**:  
> To receive emails from the contact form when hosted on GitHub Pages, get a free endpoint from [Formspree](https://formspree.io) or [Web3Forms](https://web3forms.com) and paste it into `STATIC_FORM_ENDPOINT` at the top of `js/main.js`. If left unconfigured, transmissions are securely captured in the user's browser `localStorage`.

---

### Option 3: Open Directly (Zero Server Mode)

You can also double-click or open `public/index.html` directly in any web browser (`file:///...`). The contact form will automatically detect offline mode and store transmissions safely in your browser's `localStorage`.

---

## 📡 API Endpoints

### `POST /api/contact`
Accepts a JSON payload with transmission details:

```json
{
  "name": "Elena Rostova",
  "email": "elena@constellation.io",
  "subject": "New Flagship Website",
  "budget": "$15k - $30k",
  "message": "We are seeking a partner to build a next-generation celestial experience."
}
```

**Responses:**
- `201 Created`: Returns confirmation and a generated `transmissionId`.
- `400 Bad Request`: Returns validation errors if required fields are missing or invalid.

### `GET /api/health`
Returns the operational status of the server core.

---

## 🪐 License
© 2026 Incompatible Moons. Crafted with precision and vision.
