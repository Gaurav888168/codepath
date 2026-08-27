# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React application with an Express backend for API, authentication, code execution, and firewall features.

- `src/` contains the frontend. `src/App.jsx` holds UI and state flow, `src/data.js` stores curriculum and quiz data, and CSS lives in `src/App.css` and `src/index.css`.
- `src/assets/` and `public/` contain images, favicons, and icon sprites used by the app.
- `server.js` runs the local Express backend on port `8000`.
- `api/index.js` adapts the backend for Vercel serverless deployment.
- `scraped_data/` contains generated DSA data and visualizer HTML files.
- `dist/` is build output; regenerate it with the build command rather than editing it directly.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts Vite on port `3000` with `/api` proxied to `http://localhost:8000`.
- `npm start` runs the Express backend from `server.js`.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs Oxlint using `.oxlintrc.json`.
- `npm run deploy` builds and publishes `dist/` with `gh-pages`.

## Coding Style & Naming Conventions

Use modern ES modules, React functional components, and hooks. Follow the existing JavaScript style: 2-space indentation, single quotes, semicolons in application files, and descriptive camelCase names. Name React components in PascalCase. Keep shared curriculum, quiz, and practice data in `src/data.js`. Use `lucide-react` for UI icons.

## Testing Guidelines

No first-party test framework is currently configured. Before opening a pull request, run `npm run lint` and `npm run build`. For new coverage, prefer colocated names such as `ComponentName.test.jsx` or a `src/__tests__/` directory, and document any new test command in `package.json` and this guide.

## Commit & Pull Request Guidelines

Git history is not available in this working copy, so there is no observed repository-specific commit convention. Use concise, imperative commit messages such as `Add quiz progress persistence` or `Fix firewall log rendering`.

Pull requests should include a summary, affected frontend/backend areas, verification steps, and screenshots or recordings for UI changes. Link related issues when available. Note changes to `vercel.json`, `.github/workflows/deploy.yml`, or build output behavior.

## Security & Configuration Tips

Keep secrets out of source files and commits. Use environment variables for deployed API settings such as `VITE_API_URL`. Treat `server.js` code-execution and firewall logic as security-sensitive: validate inputs, preserve timeouts, and test suspicious payload handling.
