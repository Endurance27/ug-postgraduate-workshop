# UG Postgraduate Workshop 2026 — Registration Website

**Department of Computer Science, University of Ghana (CBAS)**
2nd Annual Postgraduate Students Workshop · 27–29 August 2026 · Hybrid

---

## Tech Stack
- **React 18** (Vite)
- **CSS** (custom, no UI library — lightweight & fast)
- **Paystack** (payment gateway — Ghana MoMo + card)

---

## Project Structure

```
ug-pg-workshop/
├── index.html                   # Entry point (includes Paystack script)
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                 # React root
    ├── App.jsx                  # Router / page state
    ├── index.css                # Global styles + design tokens
    ├── components/
    │   ├── Navbar.jsx           # Top navigation
    │   ├── Footer.jsx           # Footer (organizers, sponsors)
    │   └── Countdown.jsx        # Live countdown to workshop
    └── pages/
        ├── HomePage.jsx         # Landing page
        ├── RegisterPage.jsx     # 4-step registration + Paystack
        ├── SchedulePage.jsx     # 3-day schedule with parallel tracks
        ├── SubmitPage.jsx       # Paper/abstract submission
        ├── AwardsPage.jsx       # Awards criteria + past winners
        └── AdminPage.jsx        # Admin dashboard (participants, submissions)
```

---

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Paystack Setup (REQUIRED before going live)

1. Create a Paystack account at https://paystack.com
2. Get your **Public Key** from the Paystack dashboard
3. Replace the placeholder in `src/pages/RegisterPage.jsx`:

```js
// Line ~55 in RegisterPage.jsx
key: "pk_live_YOUR_PAYSTACK_PUBLIC_KEY",   // ← Replace this
```

Use `pk_test_...` for testing, `pk_live_...` for production.

The payment is set to **GHS 100** (= 10000 kobo/pesewas).

---

## Pages Summary

| Page | Route (state) | Description |
|------|---------------|-------------|
| Home | `home` | Hero, countdown, about, tracks, organizers, sponsors |
| Register | `register` | 4-step form: personal → academic → participation → payment |
| Schedule | `schedule` | 3-day agenda with parallel CS, DS, technical, poster tracks |
| Submit Paper | `submit` | PDF upload with category selection (requires registration) |
| Awards | `awards` | Judging criteria, prizes, past winners |
| Admin | `admin` | Login-gated dashboard: overview, participants, submissions |

---

## Eligible Participants (per SRS)

| Programme | Role |
|-----------|------|
| MSc Computer Science | Presenter (expected) |
| MPhil Computer Science | Presenter (expected) |
| MSc Data Science | Presenter (expected) |
| MPhil Data Science | Presenter (expected) |
| MSc IT for Business | Observer or Presenter |
| PhD Computer Science | Presenter (optional) |
| Other PG (UG) | Open registration |

---

## Deployment

```bash
npm run build       # Produces /dist folder
```

Upload `/dist` to any static host:
- **Netlify** (recommended — free, drag-and-drop deploy)
- **Vercel**
- **GitHub Pages**
- **UG hosting server**

---

## Backend / Database (Next Steps)

This frontend is currently stateless (no persistence). To complete the system:

1. **Backend API** — Connect to a Node.js/Express, Django, or PHP backend
2. **Database** — Store registrations, payments, submissions (PostgreSQL / MySQL)
3. **Email service** — SendGrid or Mailgun for confirmation emails
4. **Admin auth** — Replace demo login with JWT/session auth
5. **File storage** — AWS S3 or Cloudinary for paper PDF uploads

---

## Organizers

- Department of Computer Science, University of Ghana
- CBAS Faculty Committee
- Workshop Planning Committee

## Sponsors & Funders

- University of Ghana
- CBAS Faculty Support
- Industry Partners (TBD)

---

*Registration Fee: GHS 100 · Includes snacks, water & workshop materials*
*Accepted papers may be considered for publication in the CBAS Journal*
