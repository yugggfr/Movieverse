import { useState, useEffect, useCallback } from "react";
import { getTVShows } from "../api/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { Spinner } from "../components/common/Spinner";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchShows = useCallback(async (p) => {
    setLoading(true);
    try {
      const res = await getTVShows(p);
      setShows((prev) =>
        p === 1 ? res.data.results : [...prev, ...res.data.results]
      );
      setTotalPages(res.data.total_pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchShows(page);
  }, [page, fetchShows]);

  const loadMore = useCallback(() => {
    if (!loading && page < totalPages) setPage((p) => p + 1);
  }, [loading, page, totalPages]);

  const sentinelRef = useInfiniteScroll(loadMore, page < totalPages);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)", marginBottom: 32 }}>
        Popular <span style={{ color: "var(--gold)" }}>TV Shows</span>
      </h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(130px, 100%), 1fr))", gap: 16 }}>
        {shows.map((s) => (
          <MovieCard key={s.id} movie={s} type="tv" />
        ))}
      </div>
      {loading && <Spinner />}
      <div ref={sentinelRef} className="h-4" />
    </div>
  );
}
