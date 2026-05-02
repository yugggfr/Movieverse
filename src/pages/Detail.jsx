import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMovieDetail, getTVDetail, img } from "../api/tmdb";
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from "../features/watchlist/watchlistSlice";
import { Spinner } from "../components/common/Spinner";
import { MovieCard } from "../components/common/MovieCard";

export default function Detail() {
  const { type, id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);
  const dispatch = useDispatch();
  const inWatchlist = useSelector(selectIsInWatchlist(Number(id)));

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    (type === "tv" ? getTVDetail : getMovieDetail)(id)
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, type]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (loading) return <Spinner size="lg" />;
  if (!data) return <div style={{ textAlign: "center", padding: 80, color: "var(--text-muted)" }}>Not found</div>;

  const title = data.title || data.name;
  const date = data.release_date || data.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const trailer = data.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube");
  const cast = data.credits?.cast?.slice(0, 8) || [];
  const similar = data.similar?.results?.slice(0, 6) || [];
  const runtime = data.runtime
    ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m`
    : data.episode_run_time?.[0] ? `~${data.episode_run_time[0]}m / ep` : null;

  return (
    <div>
      {/* Backdrop */}
      <div style={{ position: "relative", height: isMobile ? "42vh" : "55vh", overflow: "hidden" }}>
        <img
          src={img(data.backdrop_path, "original")}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, var(--bg) 0%, rgba(10,10,12,0.5) 60%, rgba(10,10,12,0.2) 100%)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(10,10,12,0.8) 0%, transparent 60%)",
        }} />
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: isMobile ? "0 16px 48px" : "0 24px 80px" }}>
        <div style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 20 : 40,
          marginTop: isMobile ? -84 : -160,
          position: "relative",
          zIndex: 10,
          alignItems: isMobile ? "stretch" : "flex-end",
        }}>
          {/* Poster */}
          <div style={{ flexShrink: 0, width: isMobile ? 170 : 200, margin: isMobile ? "0 auto" : "0" }}>
            <img
              src={img(data.poster_path)}
              alt={title}
              style={{
                width: "100%",
                borderRadius: 12,
                border: "1px solid var(--border)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
                display: "block",
              }}
            />
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingBottom: 8, textAlign: isMobile ? "center" : "left" }}>
            {/* Genres */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12, justifyContent: isMobile ? "center" : "flex-start" }}>
              {data.genres?.map(g => (
                <span key={g.id} style={{
                  fontSize: 11, fontWeight: 600, letterSpacing: "0.08em",
                  padding: "3px 10px",
                  borderRadius: 99,
                  border: "1px solid var(--border)",
                  color: "var(--text-dim)",
                  background: "var(--bg3)",
                  textTransform: "uppercase",
                }}>{g.name}</span>
              ))}
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 56px)",
              letterSpacing: "0.03em",
              color: "var(--text)",
              lineHeight: 1,
              marginBottom: 12,
            }}>{title}</h1>

            <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{ color: "var(--gold)", fontWeight: 700, fontSize: 18 }}>
                ★ {data.vote_average?.toFixed(1)}
              </span>
              <span style={{ color: "var(--border)", fontSize: 12 }}>|</span>
              {year && <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{year}</span>}
              {runtime && <>
                <span style={{ color: "var(--border)", fontSize: 12 }}>|</span>
                <span style={{ color: "var(--text-muted)", fontSize: 14 }}>{runtime}</span>
              </>}
              <span style={{ color: "var(--border)", fontSize: 12 }}>|</span>
              <span style={{
                fontSize: 11, padding: "2px 8px",
                border: "1px solid var(--border)",
                borderRadius: 4,
                color: "var(--text-dim)",
              }}>{type === "tv" ? "TV Series" : "Movie"}</span>
            </div>

            <p style={{
              color: "var(--text-muted)",
              fontSize: isMobile ? 14 : 15, lineHeight: 1.7,
              maxWidth: 600,
              marginBottom: 28,
              marginInline: isMobile ? "auto" : 0,
            }}>{data.overview}</p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              <button
                onClick={() => dispatch(inWatchlist ? removeFromWatchlist(data.id) : addToWatchlist({ ...data, mediaType: type }))}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  fontSize: 14, fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  border: inWatchlist ? "1px solid var(--gold)" : "1px solid var(--border)",
                  background: inWatchlist ? "rgba(232,184,75,0.12)" : "var(--bg3)",
                  color: inWatchlist ? "var(--gold)" : "var(--text-muted)",
                  fontFamily: "var(--font-body)",
                }}>
                {inWatchlist ? "★ In Watchlist" : "☆ Add to Watchlist"}
              </button>
              {trailer && (
                <button
                  onClick={() => setTrailerOpen(true)}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    fontSize: 14, fontWeight: 700,
                    cursor: "pointer",
                    background: "#C0392B",
                    color: "white",
                    border: "none",
                    display: "flex", alignItems: "center", gap: 8,
                    fontFamily: "var(--font-body)",
                    transition: "opacity 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                  ▶ Watch Trailer
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div style={{ marginTop: isMobile ? 44 : 60 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 24 : 28, letterSpacing: "0.04em", color: "var(--text)", marginBottom: 20 }}>
              Top <span style={{ color: "var(--gold)" }}>Cast</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 16 }}>
              {cast.map(c => (
                <div key={c.id} style={{ textAlign: "center" }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: "50%",
                    overflow: "hidden", margin: "0 auto 8px",
                    border: "1px solid var(--border)",
                    background: "var(--bg3)",
                  }}>
                    <img
                      src={c.profile_path ? img(c.profile_path, "w185") : `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=1E1E25&color=7A7880&size=72`}
                      alt={c.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)", marginBottom: 2, display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: "var(--text-dim)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div style={{ marginTop: isMobile ? 44 : 60 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: isMobile ? 24 : 28, letterSpacing: "0.04em", color: "var(--text)", marginBottom: 20 }}>
              You Might <span style={{ color: "var(--gold)" }}>Also Like</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
              {similar.map(m => <MovieCard key={m.id} movie={m} type={type} />)}
            </div>
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      {trailerOpen && trailer && (
        <div
          onClick={() => setTrailerOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 999,
            background: "rgba(0,0,0,0.9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            width: "90%", maxWidth: 900,
            borderRadius: 12,
            overflow: "hidden",
            aspectRatio: "16/9",
            border: "1px solid var(--border)",
          }}>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="autoplay"
            />
          </div>
          <button
            onClick={() => setTrailerOpen(false)}
            style={{
              position: "fixed", top: 24, right: 24,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              width: 40, height: 40,
              borderRadius: "50%",
              fontSize: 18, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>
      )}
    </div>
  );
}