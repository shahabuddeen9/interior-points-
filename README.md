<div align="center">

# Interior Points

**A full-stack interior design studio platform — portfolio, lead capture, and AI-powered client consultation, all in one system.**

[![Live Site](https://img.shields.io/badge/live-interior--points.vercel.app-black?style=for-the-badge)](https://interior-points.vercel.app)
[![React](https://img.shields.io/badge/React-19-149eca?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)

</div>

---

## Overview

**Interior Points** is the production website and content-management backend for a residential interior design studio. It combines a polished, conversion-focused marketing site with a lightweight admin console for managing the studio's real work: project portfolios, client testimonials, credibility metrics, and inbound consultation leads.

A Gemini-powered chat assistant handles first-line client questions on materials, layouts, and budgets, while every qualified lead is instantly formatted and handed off to the studio's WhatsApp line for a human follow-up — closing the loop between "browsing the site" and "talking to a designer."

## Features

- **Project Portfolio** — Full CRUD for showcase projects, filterable by BHK configuration (1/2/3 BHK) and room type, with cover images, galleries, scope of work, timelines, and budget ranges.
- **Client Testimonials** — Manage and surface ratings, quotes, and project references from past clients.
- **Credibility Stats** — Editable homepage metrics (projects delivered, years of experience, client ratings, etc.).
- **AI Consultation Chatbot** — Google Gemini–backed assistant that answers client questions about materials, 3D layouts, and ballpark estimates, with a graceful fallback response if the API is unavailable.
- **Lead Capture → WhatsApp Handoff** — Validated consultation form submissions are stored server-side and automatically formatted into a pre-filled WhatsApp message to the studio's consultation line.
- **Lead Pipeline** — Status tracking for every inquiry (`new` → `contacted` → `scheduled` → `closed`).
- **Admin Console** — Passcode-gated access for managing projects, testimonials, stats, and leads without touching the database directly.
- **Hardened by Default** — Baseline security headers (`X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, `Permissions-Policy`) applied on every response.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite 6, Tailwind CSS 4, Framer Motion, Lucide Icons |
| Backend | Express 4, Node.js, TypeScript |
| AI | Google Gemini API (`@google/genai`) |
| Tooling | tsx, esbuild, ESLint-free strict `tsc` typechecking |
| Deployment | Vercel |

## Architecture

The app runs as a single Node process: Express owns the API surface, and in development it mounts Vite's middleware for instant HMR on the React client; in production it serves the static Vite build and falls back to `index.html` for client-side routing.

```
Client (React + Vite)  ──HTTP──►  Express API  ──►  Data layer (server/db)
                                        │
                                        ├──► Gemini API (chat consultations)
                                        └──► WhatsApp deep link (lead handoff)
```

## Project Structure

```
interior-points/
├── data/              # Seed / persisted content (projects, testimonials, stats)
├── server/            # Express route logic, data access (db), Gemini integration
├── src/               # React application (components, pages, hooks)
├── index.html          # Vite entry point
├── server.ts           # Express app bootstrap + API routes
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Google Gemini API key](https://ai.google.dev/)

### Installation

```bash
git clone https://github.com/shahabuddeen9/interior-points-.git
cd interior-points-
npm install
```

### Environment Variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used by the consultation chatbot to call the Gemini API. |
| `APP_URL` | Public URL the app is hosted at (used for self-referential links). |
| `ADMIN_PASSCODE` | Passcode required to authenticate into the admin console. |

> **Security note:** the admin passcode should only ever be supplied via `ADMIN_PASSCODE` in your environment. Do not hardcode credentials in source — rotate any passcode that has previously been committed to the repository.

### Development

```bash
npm run dev
```

The app runs at `http://localhost:3000` with Vite HMR enabled.

### Production Build

```bash
npm run build
npm start
```

## API Reference

All endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health check |
| `GET` | `/projects` | List projects — filterable by `featured`, `bhk`, `room` |
| `GET` | `/projects/:slug` | Fetch a single project |
| `POST` | `/projects` | Create a project |
| `PUT` | `/projects/:id` | Update a project |
| `DELETE` | `/projects/:id` | Remove a project |
| `GET` | `/testimonials` | List testimonials |
| `POST` | `/testimonials` | Add a testimonial |
| `DELETE` | `/testimonials/:id` | Remove a testimonial |
| `GET` | `/stats` | Fetch credibility stats |
| `PUT` | `/stats` | Update credibility stats |
| `POST` | `/leads` | Submit a consultation inquiry (triggers WhatsApp handoff) |
| `GET` | `/leads` | List leads |
| `PATCH` | `/leads/:id` | Update a lead's pipeline status |
| `DELETE` | `/leads/:id` | Remove a lead |
| `GET` | `/whatsapp-redirect` | Build/redirect to a pre-filled WhatsApp consultation link |
| `POST` | `/admin/verify` | Authenticate into the admin console |
| `POST` | `/chat` | Send a message to the Gemini consultation assistant |

## Deployment

The production build (`npm run build`) bundles the client with Vite and the server with `esbuild` into `dist/`, ready to run with `node dist/server.cjs` or deploy directly to [Vercel](https://interior-points.vercel.app).

## Roadmap

- [ ] Persistent database layer (replace file/in-memory store)
- [ ] Image upload pipeline with CDN storage
- [ ] Role-based admin access
- [ ] Automated test coverage for API routes

## License

No license has been specified for this repository. All rights reserved by the author unless stated otherwise.

## Contact

Built and maintained by [@shahabuddeen9](https://github.com/shahabuddeen9).
For studio inquiries, use the consultation form on the [live site](https://interior-points.vercel.app).
