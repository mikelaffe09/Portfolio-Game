# Signal Run

Signal Run is an interactive portfolio game built with React, TypeScript, Vite, and Kaboom. Visitors move through a guided route of portfolio stations to unlock About, Skills, Projects, and Contact content.

## Features

- Game-like portfolio navigation with sequential station unlocks
- Recruiter-friendly quick scan cards for each portfolio section
- Project detail modal with selected work, role, impact, and tech
- Responsive layout for desktop and mobile screens

## Tech Stack

- React
- TypeScript
- Vite
- Kaboom
- CSS

## Getting Started

Install dependencies:

```sh
npm install
```

Run the development server:

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

## Project Structure

- `src/App.tsx` renders the portfolio shell and station flow.
- `src/components/GameCanvas.tsx` mounts the Kaboom scene.
- `src/game/scenes/MainScene.ts` defines the interactive route.
- `src/data/portfolioData.ts` stores portfolio sections and project content.
- `src/styles/global.css` contains the main responsive UI styles.

## Updating Project Previews

Project preview images live in `src/assets/projects`.

To add or replace a project preview:

1. Add a 16:9 PNG or JPG to `src/assets/projects`.
2. Import it in `src/data/portfolioData.ts`.
3. Add `previewImage`, `previewAlt`, and `path` to the project entry.
4. Use a route path in the format `/projects/project-id`.
5. Run `npm run build` to confirm the image import and project page still compile.
