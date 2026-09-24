# 🌌 Solar System Developer Portfolio & CMS

An interactive, cyberpunk-themed 2D solar system developer portfolio and project management system built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **HTML5 Canvas**. 

Projects are rendered as dynamic celestial bodies orbiting a central core node in real-time. Clicking or hovering over any planet triggers a cyberpunk Tech HUD modal equipped with paginated project documentation, image zoom capabilities, and live repository links. Built-in superuser controls enable full CRUD operations with automatic **GitHub REST API** synchronization and direct email forwarding via **Resend**.

---

## 🌟 Key Features

### 🛸 Interactive 2D Solar System Canvas
* **Real-time Canvas Rendering:** Custom high-performance HTML5 Canvas animation loop rendering dynamic planets, orbital paths, and glowing halos at 60 FPS.
* **Dynamic CSS Variable Integration:** Automatically reads `var(--primary-color)` from global styles via `getComputedStyle` to sync ambient core lighting across themes without hardcoded hex values.
* **Smart Dynamic Orbit Shrinking:** Automatically recalculates orbital radii based on array indices ($90\text{px} + \text{index} \times 50\text{px}$). Deleting a project smoothly contracts remaining outer planets inward to eliminate orphan orbits.
* **Hover & Selection Synchronization:** Two-way highlighting between the project list and canvas planets with precise geometric hit-testing ($d \le r + 8$).

### 📟 Cyberpunk HUD Modal Viewer & Contact Drawer
* **HUD Frame Aesthetics:** Styled with crisp corner brackets, dark backdrop blurs, and mono-spaced HUD navigation tabs (`01. OVERVIEW`, `02. WHY BUILT`, `03. TECH STACK`, `04. CHALLENGES`, `05. LINKS`).
* **Auto-PAGINATION Engine:** Long technical breakdowns are automatically split into page chunks (220 characters/page) with `← PREV` / `NEXT →` controls.
* **Floating Contact Drawer (`Messages.tsx`):** Expandable contact panel with character count validation, outside-click auto-close detection (`useRef`), and direct email dispatch via Next.js Server Actions.

### 🔐 Full Admin Control & GitHub API Sync
* **Dual-Layer Persistence:** Modifying or deleting projects updates the local file system (`data/projects.json`) while concurrently committing changes directly to your GitHub repository via the GitHub REST API (`Contents: Read and write`).
* **Admin Form (`/projects/new`):** Full-page project builder with custom inputs for title, planet color pickers, orbital speed controls, multi-section content, link managers, and image uploads.
* **Hybrid Image Picker:** Accepts both direct image URLs and local image file uploads (converting local images to base64 Data URLs).

### 📱 Responsive & Performant
* **Desktop & Mobile Optimized:** Fluid full-width desktop view with dedicated canvas area, shifting smoothly to stacked touch-friendly views on smaller screens without compromising desktop layout aesthetics.

---

## 🛠️ Tech Stack

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS, CSS Custom Properties
* **Canvas Engine:** HTML5 2D Context API / `requestAnimationFrame`
* **Email Service:** Resend API (via Next.js Server Actions)
* **Data & API Sync:** Node.js `fs/promises`, GitHub REST API (`PUT /repos/{owner}/{repo}/contents/{path}`)
* **Deployment Platform:** Vercel

---

## 📂 Project Structure

```text
.
├── app/
│   ├── actions/
│   │   ├── projects.ts          # Server actions for reading/writing projects.json & GitHub API sync
│   │   └── sendEmail.ts         # Server action for sending portfolio messages via Resend
│   ├── components/
│   │   ├── CyberpunkProjectModal.tsx  # Cyberpunk HUD modal viewer
│   │   ├── Messages.tsx               # Contact form with outside-click detection & Resend API integration
│   │   ├── SolarSystemCanvas.tsx     # 2D Canvas orbital system renderer
│   │   └── StarBackground.tsx         # Ambient background particle effect
│   ├── context/
│   │   └── AuthContext.tsx       # Superuser authentication state provider
│   ├── projects/
│   │   ├── new/
│   │   │   └── page.tsx          # Full-page project creation form & image picker
│   │   └── page.tsx              # Main portfolio & solar system view
│   ├── globals.css               # Global theme variables (--primary-color, custom scrollbars)
│   └── layout.tsx                # App wrapper with AuthProvider & global layout
├── data/
│   └── projects.json             # Source-of-truth project database
├── public/                       # Static assets & icons
├── .env.local                    # Environment variables (git-ignored)
├── package.json
└── tsconfig.json