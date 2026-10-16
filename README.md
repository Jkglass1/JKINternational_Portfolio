# JK Glasses International Website

Official static website for **JK Glasses International** — manufacturer and supplier of toughened glass, architectural glass, safety glass, and glass facades in Jalandhar, Punjab, India.

---

## 📁 Repository Structure

```text
jkglasses.com/
├── .github/
│   └── workflows/
│       └── deploy.yml       # Automatic GitHub Pages deployment
├── src/                     # All website source code
│   ├── assets/              # All static assets
│   │   ├── css/             # Stylesheets (Bootstrap, Slick, AOS, division-styles)
│   │   ├── js/              # JavaScript files (jQuery, Bootstrap, Lightbox, etc.)
│   │   ├── images/          # Site images, logos, banners, and icons
│   │   └── fonts/           # Web font assets
│   ├── index.html           # Main homepage (3 Divisions Showcase)
│   ├── glass-solutions.html # Glass Division Hub (Thermal, PVB, DGU, etc.)
│   ├── aluminium-systems.html # Aluminium Systems (Sliding, Casement, Partitions)
│   ├── upvc-systems.html    # uPVC Systems (Sliding, Tilt & Turn, Multi-Chamber)
│   ├── about.html           # About Us page
│   ├── contact.html         # Contact page with Division Selector & Zoho CRM
│   ├── infrastructure.html  # Manufacturing / Factory Units (Kandrori & Jalandhar)
│   ├── projects.html        # Projects / Gallery page
│   ├── whatwedo.html        # Capabilities overview
│   ├── *-glass.html         # 11 Preserved individual glass category pages
│   └── sitemap.xml          # Search engine sitemap
├── package.json             # NPM runner scripts (npm start / npm run dev)
├── .gitignore               # Git ignored files (.vs, OS files, etc.)
├── .gitattributes          # Cross-platform line endings
└── README.md                # Project documentation
```

---

## 🚀 How to Run Locally

### Option 1: Using NPM (Recommended)
```bash
npm start
# or
npm run dev
```
*(Runs `npx serve src` and serves the site directly at [http://localhost:3000](http://localhost:3000))*

### Option 2: Using VS Code Live Server
1. Open this folder in **VS Code**.
2. Right-click `src/index.html` and click **"Open with Live Server"** (or click **"Go Live"** in the status bar).

### Option 3: Using Python Built-in Server
```bash
python3 -m http.server 8000 --directory src
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🌐 Deploying to GitHub Pages

An automated GitHub Actions workflow is included in `.github/workflows/deploy.yml`.

1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. Every push to `main` will automatically build and deploy `src/` to your GitHub Pages site!