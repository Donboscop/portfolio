# React Data Fetching — Practice Project

This mirrors the tutorial: a React app that fetches course data from a local
`json-server` "fake backend" using `useEffect` + `fetch`.

## What's inside
- `src/App.jsx` → **starter file with TODOs** — fill these in yourself.
- `src/App.solution.jsx` → the completed answer, for after you've tried.
- `data/dummydata.json` → the dummy "database" (a `courses` resource).
- `data/assets/` → 4 placeholder course images.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. In **one terminal**, start the fake backend (json-server):
   ```bash
   npm run server
   ```
   This serves your data at: `http://localhost:3000/courses`
   Open that URL in a browser to confirm you see the JSON.

3. In **another terminal**, start the React app:
   ```bash
   npm run dev
   ```
   Open the URL Vite gives you (usually `http://localhost:5173`).

## Your task

Open `src/App.jsx` and complete the 5 TODOs:
1. Call `fetch()` on the local courses endpoint.
2. Convert the response to JSON.
3. Store the data in state with `setCourses`.
4. Guard against rendering before data has loaded.
5. Map over `courses` to render a card per course.

Once your course list renders with images, names, and prices — you're done!
Compare against `src/App.solution.jsx` if you get stuck.

## Try extending it yourself
- Add a 5th course to `data/dummydata.json` and confirm it shows up without
  touching any React code.
- Try changing the endpoint to `https://jsonplaceholder.typicode.com/users`
  and render user names instead, to practice with a *real* external API.
- Add a loading message instead of an empty fragment while data is fetching.
