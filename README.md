# Silvia Vildoza — Medical Branding & Patient Management System

![Next.js 15](https://img.shields.io/badge/Next.js-15-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC) ![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-green) ![next-intl](https://img.shields.io/badge/i18n-ES%20%7C%20PT%20%7C%20EN-orange)

Welcome to the repository for **Dra. Silvia Vildoza's** professional platform. This is a high-end, trilingual medical system designed for a specialist in Integrative Gynecology and Longevity Medicine.

The platform combines a premium **"boutique" UX** for patients with a robust **Administrative Dashboard** for managing Hormone Replacement Therapy (HRT) applications.

## Features

- **Full Internationalization (i18n):** Native support for Spanish, Portuguese, and English, allowing for seamless patient care across Argentina and Brazil.
- **Multi-step Application Form:** A sophisticated 5-step medical admission process with real-time validation and clinical file uploads.
- **Admin Dashboard:** Private panel for lead management, featuring advanced filtering by location, age, and priority status (Urgent/Pending).
- **Premium Aesthetic:** Refined UI using Glassmorphism, tailored animations, and a "boutique" color palette that builds trust and exclusivity.
- **Secure Healthcare Access:** Medical data protection and restricted access implemented via Supabase Auth and Row Level Security (RLS).

## Tech Stack

- **Next.js 15 (App Router):** Modern React framework using Route Groups for architecture separation.
- **TypeScript:** Type-safe development for scalable code.
- **Tailwind CSS:** Responsive design optimized for high-end mobile devices.
- **Supabase:** Relational database management and secure authentication.
- **next-intl:** Advanced management of localized routes and trilingual content.
- **Vercel:** Optimized deployment with CI/CD integration.

## Project Structure

~~~bash
dra-silvia-web
├── app/[locale]
│   ├── (marketing)/      # Public landing, Bio, and FAQs
│   ├── (dashboard)/      # Restricted Admin Patient Management
│   ├── layout.tsx        # Global config & fonts
│   └── page.tsx          # Localized entry point
├── components
│   ├── landing/          # Brand visual components
│   ├── multistep/        # HRT Form logic and steps
│   ├── layout/           # Navbar and Footer (i18n support)
│   └── ui/               # Base design system (Shadcn/UI)
├── i18n/                 # Routing and localization config
├── lib/                  # Supabase clients and schemas
└── messages/             # ES | PT | EN translation files
~~~

## Installation and Usage

1. **Clone the repository:**
   ~~~bash
   git clone https://github.com/Pulpoide/dra-silvia-vildoza
   cd dra-silvia-web
   ~~~

2. **Install dependencies:**
   ~~~bash
   npm install
   ~~~

3. **Run the application:**
   ~~~bash
   npm run dev
   ~~~

### Environment Variables

You need to configure the following environment variables in a `.env.local` file:

* `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
* `NEXT_PUBLIC_WHATSAPP_NUMBER`: The official contact number for the medical office.

---

## Author

**Joaquin D. Olivero** Full Stack Developer | Jr. Software Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/JoaquinOlivero)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Pulpoide)

*Project developed and tested between Córdoba (Argentina) and Punta del Este (Uruguay).*