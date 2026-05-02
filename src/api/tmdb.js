import axios from "axios";

const tmdb = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const IMAGE_BASE = "https://image.tmdb.org/t/p";
export const img = (path, size = "w500") =>
  path ? `${IMAGE_BASE}/${size}${path}` : "/no-image.png";

// Movies
export const getTrending = (page = 1) =>
  tmdb.get(`/trending/movie/week?page=${page}`);
export const getMovies = (page = 1) =>
  tmdb.get(`/movie/popular?page=${page}`);
export const getMovieDetail = (id) =>
  tmdb.get(`/movie/${id}?append_to_response=credits,videos,similar`);
export const searchMovies = (query, page = 1) =>
  tmdb.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
export const getGenres = () => tmdb.get("/genre/movie/list");
export const getMoviesByGenre = (genreId, page = 1) =>
  tmdb.get(`/discover/movie?with_genres=${genreId}&page=${page}&sort_by=popularity.desc`);

// TV
export const getTrendingTV = (page = 1) =>
  tmdb.get(`/trending/tv/week?page=${page}`);
export const getTVShows = (page = 1) =>
  tmdb.get(`/tv/popular?page=${page}`);
export const getTVDetail = (id) =>
  tmdb.get(`/tv/${id}?append_to_response=credits,videos,similar`);

export default tmdb;
