import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { Spinner } from "../components/common/Spinner";
import { useDebounce } from "../hooks/useDebounce";

const SORT_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Rating ↓", value: "rating_desc" },
  { label: "Rating ↑", value: "rating_asc" },
  { label: "Newest", value: "date_desc" },
  { label: "Oldest", value: "date_asc" },
];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("relevance");
  const [minRating, setMinRating] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debounced = useDebounce(query, 400);

  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      return;
    }
    setSearchParams({ q: debounced });
    setLoading(true);
    searchMovies(debounced, page)
      .then((res) => {
        setResults(res.data.results);
        setTotalPages(res.data.total_pages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debounced, page]);

  const sorted = [...results]
    .filter((m) => m.vote_average >= minRating)
    .sort((a, b) => {
      if (sort === "rating_desc") return b.vote_average - a.vote_average;
      if (sort === "rating_asc") return a.vote_average - b.vote_average;
      if (sort === "date_desc")
        return new Date(b.release_date) - new Date(a.release_date);
      if (sort === "date_asc")
        return new Date(a.release_date) - new Date(b.release_date);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-black text-white mb-6">
        Search <span className="text-amber-400">MovieVerse</span>
      </h1>

      {/* Search input */}
      <div className="relative mb-6">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search for a movie..."
          className="w-full bg-gray-800 text-white px-5 py-4 pl-12 rounded-2xl border border-gray-700 focus:outline-none focus:border-amber-500 text-lg transition"
          autoFocus
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-amber-500"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-400 text-sm">
              Min Rating: <span className="text-amber-400">{minRating}+</span>
            </label>
            <input
              type="range"
              min={0}
              max={9}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="accent-amber-500"
            />
          </div>
          <span className="text-gray-500 text-sm ml-auto">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {loading && <Spinner />}

      {!loading && debounced && sorted.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🎭</div>
          <p>No results found for "{debounced}"</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))", gap: 16 }}>
        {sorted.map((m) => (
          <MovieCard key={m.id} movie={m} type="movie" />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-5 py-2 bg-gray-800 text-white rounded-full disabled:opacity-30 hover:bg-gray-700 transition"
          >
            ← Prev
          </button>
          <span className="text-gray-400 flex items-center text-sm">
            Page {page} of {Math.min(totalPages, 500)}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-5 py-2 bg-gray-800 text-white rounded-full disabled:opacity-30 hover:bg-gray-700 transition"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
