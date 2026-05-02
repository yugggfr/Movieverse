import { useDispatch, useSelector } from "react-redux";
import {
  selectWatchlist,
  removeFromWatchlist,
  toggleWatched,
} from "../features/watchlist/watchlistSlice";
import { Link } from "react-router-dom";
import { MovieCard } from "../components/common/MovieCard";

export default function Watchlist() {
  const dispatch = useDispatch();
  const watchlist = useSelector(selectWatchlist);

  const unwatched = watchlist.filter((m) => !m.watched);
  const watched = watchlist.filter((m) => m.watched);

  if (watchlist.length === 0) {
    return (
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 24 }}>🎬</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: "var(--text)", marginBottom: 12 }}>
          Your watchlist is empty
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
          Start adding movies and TV shows you want to watch!
        </p>
        <Link
          to="/"
          style={{
            display: "inline-block",
            textDecoration: "none",
            padding: "10px 24px",
            borderRadius: 999,
            background: "var(--gold)",
            color: "#000",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Browse Movies
        </Link>
      </div>
    );
  }

  const WatchlistGrid = ({ items }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
      {items.map((item) => (
        <div key={item.id}>
          <div style={{ opacity: item.watched ? 0.72 : 1 }}>
            <MovieCard movie={item} type={item.mediaType || "movie"} />
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              onClick={() => dispatch(toggleWatched(item.id))}
              style={{
                flex: 1,
                borderRadius: 999,
                border: `1px solid ${item.watched ? "rgba(110,231,183,0.5)" : "var(--border)"}`,
                background: item.watched ? "rgba(110,231,183,0.14)" : "var(--bg2)",
                color: item.watched ? "#6ee7b7" : "var(--text-muted)",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 8px",
                cursor: "pointer",
              }}
            >
              {item.watched ? "Watched" : "Mark watched"}
            </button>
            <button
              onClick={() => dispatch(removeFromWatchlist(item.id))}
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid rgba(239,68,68,0.35)",
                background: "rgba(239,68,68,0.1)",
                color: "#fca5a5",
                fontSize: 11,
                fontWeight: 600,
                padding: "6px 8px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: "var(--text)" }}>
          My <span style={{ color: "var(--gold)" }}>Watchlist</span>
        </h1>
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>
          {watched.length}/{watchlist.length} watched
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ width: "100%", background: "var(--bg2)", borderRadius: 999, height: 8, marginBottom: 40 }}>
        <div
          style={{
            background: "var(--gold)",
            height: "100%",
            borderRadius: 999,
            transition: "width 0.5s",
            width: `${(watched.length / watchlist.length) * 100}%`,
          }}
        />
      </div>

      {unwatched.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text)", marginBottom: 16 }}>
            To Watch ({unwatched.length})
          </h2>
          <WatchlistGrid items={unwatched} />
        </section>
      )}

      {watched.length > 0 && (
        <section>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text)", marginBottom: 16 }}>
            Watched ({watched.length})
          </h2>
          <WatchlistGrid items={watched} />
        </section>
      )}
    </div>
  );
}
