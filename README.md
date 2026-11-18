# CircuitCare — Customer Website (Jaipur Launch)

A fast, mobile-first, customer-only website built from scratch for **CircuitCare’s Jaipur launch**.

Built following an **MVC architectural pattern** on the backend with a high-performance **React + Tailwind CSS** frontend, exact visual matching to CircuitCare’s black & neon-green brand identity, real persistent authentication, 188 services across 16 categories imported directly from the official Excel catalogue, and an admission-style Quick Service Enquiry flow opening directly into WhatsApp.

---

## 🚀 Customer Journey

```
Browse Services / Categories 
   → Select Service 
   → Secure Customer Login / Signup (selection preserved) 
   → Complete Quick Service Enquiry 
   → Direct WhatsApp Launch with Pre-filled Payload (+91 9829139943)
```

---

## 🎨 Brand Design Tokens

Matched directly from CircuitCare's previous design tokens and homepage visual:

- **Neon Lime Accent**: `#BBFA47` (Vibrant electric neon lime)
- **Brand Pitch Black**: `#0D0F0D` (Primary dark background)
- **Brand Charcoal Surface**: `#252B26` (Hero cards, badges, elevated surfaces)
- **Brand Off-White**: `#FEFAF7` (Light section surface)
- **Muted Text**: `#A4ADA5`
- **Typography**: Inter / sans-serif with accessible contrast and min `16px` mobile touch targets.

---

## 📂 Project Architecture (MVC Pattern)

```
CIRC/
├── package.json                   # Root orchestrator & backend dependencies
├── .env.example                   # Environment configuration template
├── .env                           # Local environment config
├── CircuitCare_Services(1).xlsx   # Official service catalogue Excel
├── test-suite.js                  # Automated 18-step integration test suite
│
├── backend/                       # Node.js Express MVC Backend
│   ├── config/
│   │   ├── brand.config.js        # Business phone, WhatsApp number (+91 9829139943), city tokens
│   │   └── app.config.js          # Port, JWT secret, session duration
│   ├── models/
│   │   ├── User.model.js          # Persistent customer store with bcrypt password hashing
│   │   ├── Catalog.model.js       # In-memory cached catalogue with search & category filtering
│   │   └── Enquiry.model.js       # Field validation, WhatsApp message & URL builder
│   ├── controllers/
│   │   ├── auth.controller.js     # Signup, Login, Profile (getMe), Logout
│   │   ├── catalog.controller.js  # Services query, Categories list, Popular services
│   │   └── enquiry.controller.js  # Server validation & WhatsApp URL generator
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT token verification (Bearer header or cookie)
│   │   └── error.middleware.js    # Global error handler
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth/*
│   │   ├── catalog.routes.js      # /api/services/*
│   │   └── enquiry.routes.js      # /api/enquiry/*
│   ├── scripts/
│   │   ├── importCatalogue.py     # Standalone Python Excel importer (zero pip dependencies)
│   │   └── importCatalogue.js     # Node.js wrapper for catalogue import
│   ├── data/
│   │   ├── services.json          # 188 imported services
│   │   ├── categories.json        # 16 imported device categories with icons & images
│   │   ├── users.json             # Persistent customer database
│   │   └── enquiries.json         # Audit logs of submitted customer enquiries
│   └── server.js                  # Express entry point, static SPA server & API mounting
│
└── frontend/                      # Mobile-First React + Vite + Tailwind SPA
    ├── index.html                 # App shell with CircuitCare favicons & Inter font
    ├── vite.config.js             # Vite configuration with /api and /assets proxy
    ├── tailwind.config.js         # CircuitCare theme extensions
    ├── package.json               # Frontend dependencies (React, Lucide, Tailwind)
    └── src/
        ├── components/
        │   ├── Header.jsx         # CircuitCare logo, Jaipur location pill, search, auth buttons, mobile drawer
        │   ├── HeroSection.jsx    # Screenshot-matched hero: badge, search, CTA, brand showcase card, 4 pills
        │   ├── ServiceCard.jsx    # ID, name, scope, parts note, price or "Contact for price", WhatsApp CTA
        │   ├── CategoryCard.jsx   # 4:3 image, category icon, service count, quick navigate
        │   ├── CategoryIcon.jsx   # Dynamic Lucide icon mapper for all 16 categories
        │   ├── TrustBadges.jsx    # "Built around clear pricing and customer control"
        │   ├── HowItWorks.jsx     # "From glitching to fixed in three clear steps"
        │   ├── BusinessBanner.jsx # Jaipur business & commercial quote banner
        │   ├── FAQAccordion.jsx   # Good to know before you enquire
        │   └── Footer.jsx         # Full CircuitCare footer with Jaipur areas & WhatsApp button
        ├── pages/
        │   ├── HomePage.jsx       # Complete homepage matching previous layout & section order
        │   ├── ServicesPage.jsx   # Live search, 16 category pills, pricing basis filters, 188 cards
        │   ├── ServiceDetailPage.jsx # Full service specification breakdown & WhatsApp CTA
        │   ├── EnquiryPage.jsx    # Quick Service Enquiry Form (adapted from admission layout)
        │   ├── LoginPage.jsx      # Customer login returning directly to selected service
        │   ├── SignupPage.jsx     # Customer signup with full name, phone, email, password
        │   ├── ProfilePage.jsx    # Customer profile with saved phone, email, and logout
        │   └── ContactPage.jsx    # Jaipur launch office, helpline, and direct WhatsApp chat
        ├── context/
        │   └── AuthContext.jsx    # Authentication provider & enquiry selection draft preservation
        ├── lib/
        │   ├── api.js             # API client with automatic token header & fallback dataset
        │   └── brand.js           # WhatsApp URL builder & formatted message generator
        ├── data/                  # Synced copies of services.json & categories.json
        └── styles/
            └── globals.css        # Tailwind directives, .btn-lime, .btn-dark, .btn-outline
```

---

## 🛠️ Setup & Run Instructions

### Prerequisites
- Node.js v18 or higher (tested on Node v22.19.0)
- Python 3.8+ (for Excel catalogue import script, using built-in standard library)

### 1. Installation

Install backend and frontend dependencies:

```bash
# In CIRC root directory:
npm install

# In frontend directory:
npm --prefix frontend install
```

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
copy .env.example .env
```

Review default settings in `.env`:
- `PORT=5000`
- `JWT_SECRET=your_secret_key`
- `BUSINESS_PHONE=+91 9829139943`
- `WHATSAPP_NUMBER=919829139943`

### 3. Build & Run

#### Option A: Production Build & Unified Server (Recommended)
Builds the frontend and serves both API and website from the single Node.js Express server:

```bash
# 1. Build the frontend production bundle
npm run build

# 2. Start the unified server
npm start
```
Visit: `http://localhost:5000`

#### Option B: Development Mode (Hot Reload)
Run backend and frontend independently for active development:

```bash
# Terminal 1: Start backend server
node backend/server.js

# Terminal 2: Start frontend Vite dev server
npm run client
```
Visit: `http://localhost:5173` (Vite proxies all `/api` requests to port 5000)

---

## 📊 Updating the Service Catalogue from Excel

When you update `CircuitCare_Services(1).xlsx`:

1. Replace the file at the project root: `CircuitCare_Services(1).xlsx`
2. Run the import script:
   ```bash
   npm run import-catalogue
   ```
   *Alternatively:*
   ```bash
   python backend/scripts/importCatalogue.py
   ```
3. Re-run `npm run build` if generating a static/production bundle.

The script will automatically:
- Parse rows starting at row 8 with row 7 headers.
- Extract: Service ID (`CC-xxx`), Device Category, Service Name, Website Price, Pricing Basis, Charging Unit, Scope / Inclusions, and Parts & Consumables.
- Validate that blank prices remain `null` and are **never** displayed as ₹0 or Free.
- Strip internal competitor links, labour-only columns, and readiness review notes.
- Sync the updated data into `backend/data/` and `frontend/src/data/`.

---

## 🧪 Automated Test Suite

A comprehensive 18-step test suite is included in `test-suite.js`. Run:

```bash
node test-suite.js
```

Verifies:
1. Brand Config integrity (`+91 9829139943`).
2. Exact 188 services and 16 categories loaded.
3. Integrity of prices: zero blank prices marked as Free or 0.
4. Server health endpoint (`GET /api/health`).
5. Category filtering & keyword search.
6. Real account signup, password hashing, and JWT generation.
7. Profile retrieval (`GET /api/auth/me`).
8. Valid and invalid login authentication.
9. Form validation rules (10-digit Indian phone, 6-digit PIN code, past dates prevented).
10. Line-by-line formatted WhatsApp message template matching specifications.

---

## 🚢 Deployment Instructions

### Option 1: VPS / Cloud Server (Ubuntu, Debian, Windows Server, AWS EC2, DigitalOcean)
1. Install Node.js v20+.
2. Clone or copy project files.
3. Run `npm install && npm --prefix frontend install`.
4. Run `npm run build`.
5. Run server under PM2:
   ```bash
   npm install -g pm2
   pm2 start backend/server.js --name circuitcare
   ```
6. Set up Nginx reverse proxy with SSL pointing to `http://localhost:5000`.

### Option 2: Platform-as-a-Service (Render, Railway, Fly.io)
1. Build Command: `npm install && npm --prefix frontend install && npm run build`
2. Start Command: `node backend/server.js`
3. Environment variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or injected by platform)
   - `JWT_SECRET=secure_random_hex_string`
   - `BUSINESS_PHONE=+91 9829139943`
   - `WHATSAPP_NUMBER=919829139943`
   - `CITY=Jaipur`

---

## 📋 Required Configuration Checklist for Production

- [x] WhatsApp Business Number configured to `+91 9829139943` in `backend/config/brand.config.js` and `frontend/src/lib/brand.js`.
- [x] All 188 services and 16 categories mapped and verified.
- [x] Zero mock / fake testimonials, discounts, or unauthorized warranty promises.
- [x] Real persistent SQLite / JSON authentication with bcrypt hashing.
- [x] Mobile viewport checked: no horizontal overflow, inputs >= 16px to prevent iOS auto-zoom.
- [ ] In production, update `JWT_SECRET` in `.env` to a cryptographically strong 64-character secret.
- [ ] Connect custom domain `circuitcare.in` to your hosting provider.
