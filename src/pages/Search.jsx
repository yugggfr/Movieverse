import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { searchMovies } from "../api/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { Spinner } from "../components/common/Spinner";
import { useDebounce } from "../hooks/useDebounce";
import searchImg from "../../search.jpg";

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
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", marginBottom: 22 }}>
        Search <span style={{ color: "var(--gold)" }}>MovieVerse</span>
      </h1>

      {/* Search input */}
      <div style={{ position: "relative", marginBottom: 22, maxWidth: 700 }}>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search for a movie..."
          style={{
            width: "100%",
            background: "var(--bg2)",
            color: "var(--text)",
            padding: "clamp(10px, 2.4vw, 12px) 16px clamp(10px, 2.4vw, 12px) clamp(36px, 10vw, 42px)",
            borderRadius: 14,
            border: "1px solid var(--border)",
            fontSize: "clamp(14px, 3.6vw, 15px)",
            outline: "none",
            transition: "border-color 0.2s",
            fontFamily: "var(--font-body)",
          }}
          autoFocus
        />
        <img
          src={searchImg}
          alt="Search"
          style={{
            position: "absolute",
            left: "clamp(10px, 3vw, 14px)",
            top: "50%",
            transform: "translateY(-50%)",
            width: "clamp(14px, 4.5vw, 18px)",
            height: "clamp(14px, 4.5vw, 18px)",
            objectFit: "contain",
            borderRadius: 4,
          }}
        />
      </div>

      {/* Filters */}
      {results.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 22, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ color: "var(--text-muted)", fontSize: 13 }}>Sort by:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{
                background: "var(--bg2)",
                color: "var(--text)",
                fontSize: 13,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <label style={{ color: "var(--text-muted)", fontSize: 13 }}>
              Min Rating: <span style={{ color: "var(--gold)" }}>{minRating}+</span>
            </label>
            <input
              type="range"
              min={0}
              max={9}
              step={0.5}
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              style={{ accentColor: "var(--gold)" }}
            />
          </div>
          <span style={{ color: "var(--text-dim)", fontSize: 13, marginLeft: "auto" }}>
            {sorted.length} result{sorted.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {loading && <Spinner />}

      {!loading && debounced && sorted.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎭</div>
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
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            style={{
              padding: "8px 16px",
              background: "var(--bg2)",
              color: "var(--text)",
              borderRadius: 999,
              border: "1px solid var(--border)",
              cursor: page === 1 ? "not-allowed" : "pointer",
              opacity: page === 1 ? 0.35 : 1,
            }}
          >
            ← Prev
          </button>
          <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", fontSize: 13 }}>
            Page {page} of {Math.min(totalPages, 500)}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{
              padding: "8px 16px",
              background: "var(--bg2)",
              color: "var(--text)",
              borderRadius: 999,
              border: "1px solid var(--border)",
              cursor: page >= totalPages ? "not-allowed" : "pointer",
              opacity: page >= totalPages ? 0.35 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
