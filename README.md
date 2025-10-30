# Concert Countdown – Full Manual (React + TypeScript + Vite)

This document explains everything about your project in simple language. You will learn:
- What each folder and file does
- How the app flows from start to finish
- Why we use React and TypeScript
- How the countdown and background selector work
- How to run, debug, and extend the app

If you read this once, you will understand the whole project.

## 1) What this app does
- Shows a live countdown to May 30 (your concert date).
- Updates every second: days, hours, minutes, seconds.
- Lets you choose a background image from a dropdown.
- Remembers your background choice using localStorage.

## 2) Why React?
- React makes UI state easy. State is the data that changes over time (like seconds ticking or a selected background).
- When state changes, React re-renders the UI automatically. You do not update the DOM by hand.
- React components are small, reusable pieces. This app has a main `App` component and a tiny `TimeBox` component.

In short: React saves you from manual DOM work and gives you a clean structure.

## 3) Why TypeScript?
- TypeScript adds types to JavaScript. Types help you catch mistakes early.
- Example: If a function expects a `Date` but you pass a string, TypeScript warns you.
- Types make code more readable and safer, especially as the app grows.

## 4) Why Vite?
- Vite is a fast development server and build tool.
- It gives instant reloads and a simple build command.
- It is modern and works great with React + TypeScript.

## 5) Project structure
```
countdown/
  ├─ index.html                 # HTML page that loads your React app
  ├─ package.json               # Scripts and dependencies
  ├─ vite.config.ts             # Vite configuration
  ├─ tsconfig.json              # Root TypeScript config (uses references)
  ├─ tsconfig.app.json          # TS config for the app code (browser side)
  ├─ tsconfig.node.json         # TS config for node-side (Vite config)
  ├─ public/                    # Static assets served as-is
  │   └─ vite.svg
  └─ src/
      ├─ main.tsx               # App entry: mounts React into the page
      ├─ App.tsx                # Main React component (countdown + backgrounds)
      ├─ styles.css             # App styling (layout + visuals)
      ├─ index.css (optional)   # Template CSS (not used by our main path)
      ├─ App.css (optional)     # Template CSS (not used by our main path)
      └─ assets/
          └─ react.svg          # Template asset (from Vite)
```

Notes:
- Only `main.tsx`, `App.tsx`, and `styles.css` are important for the app logic and UI.
- `tsconfig.*.json` files control TypeScript behavior (explained below).

## 6) The app flow (from start to screen)
1. Browser loads `index.html`.
2. `index.html` includes `<script type="module" src="/src/main.tsx"></script>`.
3. `src/main.tsx` imports React and `App`, finds the DOM element with id `root`, and renders `<App />` inside it.
4. `App.tsx` sets up:
   - The concert date (May 30, current year or next if already past).
   - A timer that ticks every second to update the countdown.
   - The background selector and localStorage persistence.
5. `styles.css` gives the page layout, glass card style, and responsive grid.

## 7) Deep dive: `src/main.tsx`
- It imports React, ReactDOM, `App`, and the global CSS.
- It calls `ReactDOM.createRoot(...).render(...)` to mount the app into the div with id `root`.
- It uses `React.StrictMode` to help catch common problems during development.

In short: `main.tsx` is the one-time startup file.

## 8) Deep dive: `src/App.tsx`
`App.tsx` does the main work. Important parts:

- Target date logic
  - We get today’s year.
  - Build May 30 of this year.
  - If today is after May 30, we set the target to next year.

- Countdown logic
  - A function `getTimeRemaining(targetDate)` returns days, hours, minutes, seconds.
  - It clamps negative values to zero (so UI never shows negative time).
  - A `setInterval` (via `useEffect`) runs every second to force a re-render.

- Background selection
  - A list `BACKGROUNDS` holds options (id, label, image URL).
  - We keep the selected background id in React state.
  - We save the id to `localStorage` so your choice persists after refresh.

- Rendering
  - A full-screen background image + a dark overlay (scrim) for readability.
  - A centered “card” that shows the title, target year, and the 4 time boxes.
  - A dropdown to change background and a Reset button.

- Accessibility and readability
  - The countdown grid uses clear labels.
  - Numbers are padded to 2 digits for hours/minutes/seconds.

## 9) Deep dive: `src/styles.css`
Main ideas:
- Full-height layout, centered content.
- A background image layer and a semi-transparent overlay to keep text readable.
- A glass-like card with rounded corners and blur.
- A responsive grid for the 4 time boxes (2 columns on small screens).
- Focus styles for keyboard accessibility.

You can tweak colors and fonts here.

## 10) TypeScript config files
- `tsconfig.json` (root)
  - Uses `references` to point at `tsconfig.app.json` and `tsconfig.node.json`.
  - This is a “project references” setup. Each referenced config must be buildable.

- `tsconfig.app.json`
  - For browser app code (files in `src/`).
  - Has `"composite": true` and emits declaration files (not JS) to satisfy the references rule.
  - Sets `jsx: "react-jsx"` and other strict/lint-related options.

- `tsconfig.node.json`
  - For Node context (like `vite.config.ts`).
  - Also `"composite": true` and emits declaration files only.

Why declarations only? TypeScript requires referenced projects to be “emittable.” We emit type declarations instead of JS because Vite will handle JS bundling.

## 11) How to run the app
1. Install Node.js (LTS is recommended). On Windows, you can use `nvm-windows` to manage versions.
2. In the project folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the URL printed in the terminal (usually `http://localhost:5173`).

Build for production:
```bash
npm run build
npm run preview
```

## 12) How the countdown works (step by step)
- We compute `difference = targetDate - now` in milliseconds.
- Convert milliseconds into days/hours/minutes/seconds using division/modulo.
- Recalculate every second with `setInterval` and React state to trigger a re-render.
- If the target date is past, `difference` is negative; we clamp to 0 and show a small message.

## 13) How the background selector works
- Background choices live in a constant array `BACKGROUNDS` with image URLs.
- The dropdown’s value is kept in React state `backgroundId`.
- When the value changes, we save it to `localStorage` under the key `countdown:bg`.
- On startup, we read from `localStorage` to restore the user’s choice.

To add a new background:
1. Add a new item to `BACKGROUNDS` in `App.tsx`:
   - `{ id: 'my-photo', label: 'My Photo', url: 'https://...' }`
2. It will show automatically in the dropdown.

## 14) Common customizations
- Change the target date:
  - In `App.tsx`, we set the date to May 30 by default. You can change it to a fixed date:
    ```ts
    const concertDate = new Date('2026-05-30T00:00:00');
    ```
  - Or add a date picker component and store the result in state.

- Change fonts/colors:
  - Edit CSS variables in `:root` inside `styles.css`.

- Add more UI (like event name or location):
  - Add new elements inside the `.card` div of `App.tsx`.

## 15) Troubleshooting
- TypeScript reference errors (`composite`, `noEmit`):
  - Keep `"composite": true` in `tsconfig.app.json` and `tsconfig.node.json`.
  - Do not set `"noEmit": true` in referenced projects; use declaration-only emit instead.

- Duplicate symbol errors (e.g., `Identifier 'App' has already been declared`):
  - Ensure `src/main.tsx` mounts the app only once and imports `App` only once.
  - Ensure `src/App.tsx` exports a single default `App` component.

- Blank page:
  - Check browser console for errors.
  - Make sure `index.html` has `<div id="root"></div>` and `main.tsx` targets `#root`.

## 16) Quick glossary
- Component: A reusable piece of UI in React (function that returns JSX).
- State: Data that changes over time and triggers re-render.
- Props: Input parameters to a component.
- JSX: HTML-like syntax inside JavaScript/TypeScript used by React.
- Render: When React turns components into real DOM elements on the page.

## 17) What I changed and why (history highlights)
- Created a React + TypeScript app using Vite structure.
- Implemented `App.tsx` with:
  - Target date calculation (May 30, this year or next).
  - `getTimeRemaining` to compute days/hours/minutes/seconds.
  - One-second ticking using `setInterval` in a `useEffect`.
  - Background selector with localStorage persistence.
  - Responsive and accessible UI in `styles.css`.
- Cleaned up duplicate components and duplicate entry-point code.
- Fixed TypeScript project references:
  - Added `"composite": true` to `tsconfig.app.json` and `tsconfig.node.json`.
  - Replaced `noEmit` with declaration-only emission to satisfy references.

## 18) Learn React with this project (simple path)
1. Open `src/App.tsx` and read top-to-bottom.
2. Change the target date and see how UI updates.
3. Add a new background option and select it.
4. Change styles in `src/styles.css` (e.g., colors, padding).
5. Create a new component (e.g., `EventName.tsx`) and render it in `App`.

Each change gives you quick feedback in the browser.

## 19) Commands reference
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## 20) Next ideas
- Add a custom date picker so you can count down to anything.
- Allow users to upload their own background image.
- Add timezone selection.
- Animate the time boxes when values change.

You now have a solid base to learn and build more. Have fun coding!
