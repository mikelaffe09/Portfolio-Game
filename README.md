# Interactive Frontend Developer Portfolio

An interactive developer portfolio for Mike Allaffi built with React, TypeScript, Vite, Kaboom, GSAP, and plain CSS. The site presents the same portfolio content in two modes: a playable neon quest hub and a recruiter-friendly traditional scan.

The project is intentionally more than a profile page. It is also a live frontend work sample that demonstrates responsive UI, stateful interactions, canvas/game integration, accessible modal behavior, data-driven case studies, SEO/social metadata, and static-hosting deployment constraints.

## Table of Contents

- [Status](#status)
- [Experience](#experience)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Portfolio Content](#portfolio-content)
- [Assets and Social Preview](#assets-and-social-preview)
- [SEO and Metadata](#seo-and-metadata)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Deployment](#deployment)
- [Validation Checklist](#validation-checklist)
- [Troubleshooting](#troubleshooting)
- [Maintenance Notes](#maintenance-notes)

## Status

- Application type: static client-side SPA
- Runtime backend: none
- External API calls: none
- Secret handling: none
- Package manager: npm with `package-lock.json`
- Required Node version: `>=22`
- Primary assumed public URL: `https://mikelaffe09.github.io/portfolio-game/`

Generated folders such as `node_modules` and `dist` should not be committed or shared as source. Recreate them from `package-lock.json` and the build scripts.

## Experience

Visitors can use the portfolio in either path:

- Game Mode: move through a small neon portfolio world, unlock stations, collect signal fragments, and open portfolio sections.
- Recruiter Mode: scan the same profile, skills, experience, projects, education, and contact details in a conventional layout.

The game layer is meant to add personality, not block access. Recruiter Mode exists so hiring managers, clients, and collaborators can review the portfolio quickly without learning the game interaction.

## Features

- Playable Kaboom quest hub with keyboard controls
- Mobile controls for touch devices
- Lazy-loaded game canvas so the Kaboom chunk is not required for the first recruiter scan
- Data-driven About, Skills, Projects, and Contact sections
- Recruiter Mode with professional summary, skills, experience, education, projects, and contact links
- Project case-study pages with problem, solution, role, standout feature, impact, stack, lessons, and planned improvements
- Portfolio-game case study included as a project entry
- Accessible modal behavior with labelled dialog, Escape close, focus trap, and focus restoration
- Reduced-motion handling for CSS, the spiral animation, and the game scene
- Local progress persistence for completed stations, recruiter preference, and collected fragments
- Social preview image and Open Graph/Twitter metadata
- Static sitemap and robots file
- No backend, no public frontend secrets, and no server-only environment variables

## Tech Stack

- React 19
- TypeScript
- Vite
- Kaboom
- GSAP
- CSS
- ESLint

## Requirements

Use Node.js 22 or newer.

Check your version:

```sh
node --version
npm --version
```

Install dependencies from the lockfile:

```sh
npm ci
```

## Quick Start

Run the local development server:

```sh
npm run dev
```

Build for production:

```sh
npm run build
```

Preview the production build:

```sh
npm run preview
```

Run linting:

```sh
npm run lint
```

Run TypeScript checking:

```sh
npm run typecheck
```

Before publishing or handing off the project, run:

```sh
npm ci
npm run lint
npm run build
```

## Available Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Runs TypeScript build checks and creates the production `dist` output. |
| `npm run typecheck` | Runs `tsc -b` without producing app output. |
| `npm run lint` | Runs ESLint across the project. |
| `npm run preview` | Serves the production build locally. |
| `npm run clean` | Removes generated build/temp folders. |

Note: `npm run clean` currently uses `rm -rf`, which is shell-specific. If Windows-native cleanup is required outside Git Bash/compatible shells, replace it with a Node cleanup script or a cross-platform tool.

## Project Structure

```text
.
├── public/
│   ├── Mike_Allaffi_CV.pdf
│   ├── robots.txt
│   ├── sitemap.xml
│   └── social-preview.webp
├── src/
│   ├── assets/
│   │   ├── hero.webp
│   │   └── projects/
│   ├── components/
│   ├── data/
│   ├── game/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

Important files:

- `src/App.tsx` owns high-level app state, route state, modal state, toasts, lazy game loading, and metadata updates.
- `src/data/portfolioData.ts` stores profile content, experience, education, skills, contact links, sections, and project case studies.
- `src/hooks/usePortfolioProgress.ts` owns unlock rules, completion state, localStorage persistence, and Recruiter Mode preference.
- `src/hooks/useReducedMotion.ts` reads the system reduced-motion preference.
- `src/components/GameCanvas.tsx` mounts and cleans up Kaboom.
- `src/game/scenes/MainScene.ts` defines the game world, player movement, stations, collectibles, particles, and interactions.
- `src/components/PortfolioModal.tsx` renders section details and the project showcase modal.
- `src/components/ProjectPage.tsx` renders shareable case-study pages.
- `src/components/RecruiterMode.tsx` renders the traditional portfolio view.
- `src/components/MobilePortfolioMap.tsx` renders touch-friendly section navigation.
- `src/components/MobileGameControls.tsx` maps touch controls into game input.
- `src/utils/seo.ts` updates document title, canonical URL, Open Graph, and Twitter metadata after route changes.
- `src/styles/global.css` contains the main layout, responsive behavior, recruiter mode, modal, project page, and reduced-motion styles.
- `src/styles/project-showcase.css` contains the project showcase modal styles.

## Routes

The app uses lightweight client-side route state rather than a router package.

Supported routes:

- `/`
- `/projects/smartgarage`
- `/projects/portfolio-game`
- `/projects/gala-flowers`
- `/projects/mr-fix`
- `/projects/calcvault`
- `/projects/selected-web-work`

Unknown project routes render a simple project-not-found page.

Static hosts must serve `index.html` for project routes. Without SPA fallback/rewrite support, direct visits to `/projects/:projectId` can return a 404 from the host before React loads.

## Portfolio Content

Most public-facing content lives in `src/data/portfolioData.ts`.

When updating content:

- Update `portfolioProfile` for name, role, summary, availability, contact links, and current focus.
- Update `experienceItems`, `educationItems`, `courseItems`, and `languageItems` for CV-style content.
- Update `skillGroups` for capability categories.
- Update `portfolioSections` for game station content.
- Update each `PortfolioProject` entry for case-study pages, screenshots, live links, repository notes, lessons, and improvements.
- Keep project `id` values stable because route paths and navigation depend on them.
- Add new project route URLs to `public/sitemap.xml`.
- If a project is removed or commented out, remove or comment its sitemap entry too.

Project image fields:

- `screenshotUrl`: primary preview image used by cards and project pages.
- `previewImage`: optional fallback/alternate preview image.
- `previewAlt`: accessible description for the preview.
- `galleryImages`: detailed image list for the case-study page.

## Assets and Social Preview

Current optimized assets:

- `src/assets/hero.webp`: mission panel artwork.
- `src/assets/projects/portfolio-game-preview.webp`: portfolio-game case-study preview.
- `public/social-preview.webp`: default social sharing image.

Recommended social/README screenshots before publishing:

- Game hub on desktop
- Game hub or Mission Map on mobile
- Recruiter Mode scan on desktop
- Project showcase modal
- Individual project case-study page

Asset guidelines:

- Prefer WebP or AVIF for large UI and project preview images.
- Keep source captures out of the production bundle unless they are directly used.
- Avoid adding large PNG screenshots when a compressed WebP/AVIF version is enough.
- Use descriptive alt text for project screenshots.
- Rebuild and inspect `dist/assets` after replacing large media.
- If a social platform rejects WebP previews, publish a compressed JPG or PNG fallback in `public/` and update `index.html` plus `src/utils/seo.ts`.

## SEO and Metadata

Crawler-visible default metadata is defined in `index.html`.

Client-side route metadata is updated from `src/utils/seo.ts` after React loads. It updates:

- `document.title`
- `meta[name="description"]`
- canonical link
- Open Graph title, description, URL, type, image, and image alt
- Twitter large-card title, description, image, and image alt

Important limitation:

Many social crawlers do not run SPA JavaScript. The default metadata in `index.html` is reliable for crawlers. The per-project metadata from `src/utils/seo.ts` is useful for browser state and crawlers that execute JavaScript, but it is not a substitute for prerendered HTML if each project URL needs a unique social card.

For fully route-specific social previews, add one of the following:

- Static prerendered HTML for each `/projects/:projectId` route
- Server-side rendering
- A host/build step that emits route-specific `index.html` files

If the deployment URL changes, update all of these together:

- `src/utils/seo.ts`
- `index.html`
- `public/sitemap.xml`
- `public/robots.txt`
- Any live demo links in `src/data/portfolioData.ts`

## Performance

Current performance choices:

- The Kaboom game canvas is lazy-loaded from `src/App.tsx`.
- The game chunk loads when the game section nears the viewport or when the user clicks Enter Hub.
- The recruiter path can render before the game chunk is needed.
- Large PNG artwork was replaced with WebP.
- Project images use `loading` and `decoding` attributes where appropriate.
- Reduced-motion mode lowers visual activity in CSS, the spiral animation, and the game.

Recent production build shape:

- Main app chunk: about 332 KB before gzip
- Lazy GameCanvas chunk: about 147 KB before gzip
- `hero.webp`: about 34 KB
- `portfolio-game-preview.webp`: about 81 KB

Next performance improvements:

- Convert remaining large JPG screenshots to WebP/AVIF where quality allows.
- Consider responsive image sizes for project gallery images.
- Consider in-place game scene state updates instead of recreating the Kaboom scene when progress props change.
- Review `favicon.png`, which is currently large for a favicon-sized asset.
- Add bundle analysis if more dependencies are introduced.

## Accessibility

Current accessibility behavior:

- Recruiter Mode provides a non-game reading path.
- Modal uses `role="dialog"`, `aria-modal`, labelled headings, Escape close, focus trap, and focus restoration.
- Keyboard users can use standard DOM controls and the game controls.
- Game movement supports WASD and arrow keys.
- Game station interaction supports `E` and `Enter`.
- Mobile users get touch controls and a Mission Map.
- Reduced-motion preference is respected.
- Project images include alt text through the portfolio data model.

Recommended manual checks:

- Navigate the home page with keyboard only.
- Open and close each modal with keyboard only.
- Confirm focus returns to the trigger after closing a modal.
- Confirm Recruiter Mode content reads logically with headings.
- Confirm mobile controls do not overlap content.
- Confirm reduced-motion mode removes or limits distracting animation.
- Test high-contrast readability of badges, cards, buttons, and modal text.

Future hardening:

- Add automated axe checks.
- Add Playwright smoke tests for route navigation, modal focus, Recruiter Mode, and project pages.
- Review `aria-disabled` button patterns for locked route nodes so screen reader behavior matches click behavior.
- Add a formal test script once automated tests are introduced; the current project uses linting and TypeScript/build checks only.

## Deployment

The app is static and can deploy to GitHub Pages, Netlify, Vercel static hosting, Cloudflare Pages, or any host that can serve a Vite build.

Build output:

```sh
npm run build
```

The generated site is in:

```text
dist/
```

Static host requirements:

- Serve `dist/index.html` for `/`.
- Serve `dist/index.html` as the fallback for `/projects/:projectId`.
- Serve files from `public/` at the site root.
- Preserve `robots.txt`, `sitemap.xml`, `social-preview.webp`, favicon files, and the CV PDF.

Current metadata and sitemap assume:

```text
https://mikelaffe09.github.io/portfolio-game/
```

If deploying somewhere else, update the metadata and sitemap files listed in [SEO and Metadata](#seo-and-metadata).

GitHub Pages project-path note:

This repository name implies a possible GitHub Pages path of `/portfolio-game/`. If hosting under that subpath, make sure Vite asset paths, React navigation paths, sitemap URLs, canonical URLs, and public asset URLs all agree. A mismatch between root hosting and subpath hosting is one of the easiest ways to break refreshes, favicons, PDFs, and social previews.

## Validation Checklist

Before sharing publicly:

- `npm ci` completes cleanly.
- `npm run lint` passes.
- `npm run typecheck` passes.
- `npm run build` passes.
- `npm run preview` serves the built app locally.
- Home page loads without console errors.
- Recruiter Mode opens from the hero and HUD.
- Enter Hub loads the game canvas.
- Keyboard movement works in the game.
- Mobile controls render on touch-sized viewports.
- About, Skills, Projects, and Contact stations open.
- Locked stations show the expected warning.
- Project modal opens and project selector works.
- Each `/projects/:projectId` route loads directly through the host fallback.
- Contact links, GitHub links, live demos, and resume link work.
- `public/sitemap.xml` only lists live project routes.
- `public/social-preview.webp` renders correctly in link preview tools.
- Build output does not contain unnecessary large source captures.

## Troubleshooting

### Direct project URL returns 404

The static host is not falling back to `index.html`. Configure an SPA fallback/rewrite for `/projects/*`.

### Assets work locally but fail after deployment

Check whether the site is deployed at root (`/`) or under `/portfolio-game/`. Vite base paths, hardcoded public URLs, sitemap URLs, and history navigation must match the actual host path.

### Social preview does not update

Social platforms cache previews. Confirm `public/social-preview.webp` is deployed, then refresh the cache in the relevant platform debugger.

If a platform does not accept WebP for link previews, add a compressed JPG or PNG fallback and update the Open Graph/Twitter image metadata.

### Project page has the wrong title or description

Check the project entry in `src/data/portfolioData.ts` and the route metadata logic in `src/utils/seo.ts`.

### Game does not appear immediately

The game canvas is lazy-loaded intentionally. It loads when the game section nears the viewport or when Enter Hub is clicked.

### Progress seems stuck or already complete

Progress is stored in browser `localStorage`. Clear site data for the local/dev URL to reset station completion, collected fragments, and Recruiter Mode preference.

### Build fails on Linux but works on Windows

Check import path casing. Linux file systems are case-sensitive, so asset imports must match file names exactly.

## Maintenance Notes

- Keep `README.md`, `public/sitemap.xml`, `index.html`, and `src/utils/seo.ts` aligned when deployment URLs or project routes change.
- Keep project copy honest: explain what is live, private, in progress, or available only as a walkthrough.
- Keep repository notes clear for private client or coursework projects.
- Avoid committing `dist`, `node_modules`, local logs, or generated temporary files.
- Re-run build and lint after changing content because imported assets and route metadata are TypeScript-checked.
- There is no license declared in this repository. Add one before distributing the source as an open-source project.
