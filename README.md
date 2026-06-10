# Interactive Frontend Developer Portfolio

An interactive portfolio built with React, TypeScript, Vite, and Kaboom. The app presents portfolio content through a playable neon quest hub while also offering a recruiter-friendly traditional portfolio view for fast review.

## Description

This project is designed to be both a portfolio and a live frontend work sample. Visitors can move through a small game world, unlock About, Skills, Projects, and Contact sections, collect optional signal fragments, and review project case studies. Recruiter Mode presents the same content in a clean, scannable format for hiring managers, clients, and collaborators who prefer a traditional portfolio page.

## Features

- Animated Kaboom game hub with keyboard controls
- Data-driven About, Skills, Projects, and Contact sections
- Recruiter Mode with professional summary, grouped skills, featured work, and contact links
- Project case-study structure with problem, solution, role, impact, tech stack, lessons, and improvements
- Mobile Mission Map for touch-friendly section access
- Accessible modal behavior with focus management and Escape close
- Reduced-motion support for CSS and game-world effects
- Local progress persistence for completed stations
- No backend, external API, or secret handling required

## Tech Stack

- React
- TypeScript
- Vite
- Kaboom
- CSS

## Screenshots

TODO: Add desktop and mobile screenshots before publishing.

- TODO: Game hub screenshot
- TODO: Recruiter Mode screenshot
- TODO: Project showcase screenshot

## Local Development

Use Node.js 22 or newer. Do not commit or ship `node_modules`, `dist`, or other generated dependency/build folders in project archives; install from `package-lock.json` instead.

Install dependencies:

```sh
npm ci
```

Run the development server:

```sh
npm run dev
```

## Build

Create a production build:

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

Run type checking:

```sh
npm run typecheck
```

Before sharing or deploying, validate from a clean install:

```sh
npm ci
npm run build
npm run lint
```

Local cleanup for generated folders only:

```sh
npm run clean
```

## Project Structure

- `src/App.tsx` handles route state, active modal state, toast state, and high-level layout.
- `src/data/portfolioData.ts` stores the profile, grouped skills, contact links, sections, and project case studies.
- `src/hooks/usePortfolioProgress.ts` owns progression, unlock rules, localStorage persistence, and Recruiter Mode preference.
- `src/components/GameCanvas.tsx` mounts and cleans up the Kaboom canvas.
- `src/game/scenes/MainScene.ts` defines the animated game world and interactions.
- `src/components/PortfolioModal.tsx` renders section details and project showcases.
- `src/components/RecruiterMode.tsx` renders the traditional portfolio view.
- `src/components/MobilePortfolioMap.tsx` renders touch-friendly section access.
- `src/styles/global.css` contains layout, responsive, Recruiter Mode, modal, and reduced-motion styles.
- `src/styles/project-showcase.css` contains project showcase styles.

## Roadmap

- TODO: Add final screenshots and social preview image.
- Add more project filters once the project list grows.
- Add additional accessibility testing with screen reader workflows.

## Deployment Notes

- The app is fully client-side and can deploy to static hosting.
- Configure the host to serve `index.html` for `/projects/:projectId` routes.
- Do not add frontend secrets; public portfolio links should be safe to expose.
- Keep project screenshots, live links, and repository availability notes current before sharing the portfolio publicly.

## Accessibility Notes

- Modals use `role="dialog"`, `aria-modal`, labelled headings, Escape close, and focus restoration.
- Recruiter Mode uses semantic sections and headings so the portfolio remains useful without playing the game.
- Keyboard users can navigate the DOM controls and use WASD/arrows plus `E`/`Enter` in the game.
- Reduced-motion preferences are respected in CSS and passed into the Kaboom scene.

## Performance Notes

- Game effects use Kaboom primitives and short-lived particles with lifespans.
- The app avoids external animation, UI, state, and sound dependencies.
- Project screenshots are bundled as compressed assets; keep large source captures out of the production bundle.
