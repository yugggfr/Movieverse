# MovieVerse

MovieVerse is a modern movie and TV discovery web app built with React.  
It includes trending content, genre browsing, detailed pages, search, and a personal watchlist.

## Features

- Explore trending **Movies** and **TV Shows**
- Browse content by **genre**
- View rich **detail pages** (rating, cast, similar titles, trailer support)
- Fast **search** with filtering/sorting
- Personal **watchlist** with watched/unwatched tracking
- Responsive UI optimized for desktop and mobile

## Tech Stack

- React + Vite
- Redux Toolkit
- React Router
- TMDB API (The Movie Database)
- Tailwind CSS + custom styles

## Getting Started

### 1) Clone the repo

```bash
git clone https://github.com/yugggfr/Movieverse.git
cd Movieverse
```

### 2) Install dependencies

```bash
npm install
```

### 3) Setup environment variables

Create a `.env` file in the project root:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

> `.env` is ignored by git for safety.

### 4) Start development server

```bash
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run lint` - run ESLint

## Project Structure

```text
src/
  api/            # TMDB API helpers
  app/            # Redux store setup
  components/     # shared UI components (Navbar, MovieCard, etc.)
  features/       # Redux slices (theme, watchlist)
  hooks/          # custom hooks
  pages/          # route pages (Home, Movies, TVShows, Search, Detail, Watchlist)
```

## Notes

- This project uses TMDB data but is not endorsed or certified by TMDB.
- If poster/backdrop images fail, fallback placeholders are used where applicable.
