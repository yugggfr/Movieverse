import { useState, useEffect } from "react";
import { getTrending, getTrendingTV, getGenres, getMoviesByGenre, img } from "../api/tmdb";
import { MovieCard } from "../components/common/MovieCard";
import { Spinner } from "../components/common/Spinner";
import { Link } from "react-router-dom";

function Section({ title, accent, items, type, to }) {
  return (
    <section style={{ marginBottom: 64 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: 32, letterSpacing: "0.04em",
          color: "var(--text)",
        }}>
          {title} <span style={{ color: "var(--gold)" }}>{accent}</span>
        </h2>
        <Link to={to} style={{
          fontSize: 13, color: "var(--text-muted)",
          textDecoration: "none", borderBottom: "1px solid var(--border)",
          paddingBottom: 2, transition: "color 0.15s, border-color 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; }}
        onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
          See all →
        </Link>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
        gap: 16,
      }}>
        {items.slice(0, 10).map((m, i) => (
          <div key={m.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s both` }}>
            <MovieCard movie={m} type={type} />
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </section>
  );
}

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [trendingTV, setTrendingTV] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreMovies, setGenreMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTrending(), getTrendingTV(), getGenres()])
      .then(([t, tv, g]) => {
        setTrending(t.data.results);
        setTrendingTV(tv.data.results);
        setGenres(g.data.genres);
        setHero(t.data.results[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!trending.length) return;
    const interval = setInterval(() => {
      setHeroIdx(i => {
        const next = (i + 1) % Math.min(5, trending.length);
        setHero(trending[next]);
        return next;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [trending]);

  useEffect(() => {
    if (!selectedGenre) return;
    getMoviesByGenre(selectedGenre).then(r => setGenreMovies(r.data.results));
  }, [selectedGenre]);

  if (loading) return <Spinner size="lg" />;

  return (
    <div>
      {/* HERO */}
      {hero && (
        <div style={{ position: "relative", height: "75vh", overflow: "hidden" }}>
          <img
            key={hero.id}
            src={img(hero.backdrop_path, "original")}
            alt={hero.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              animation: "heroFade 0.8s ease",
            }}
          />
          {/* Gradients */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, rgba(10,10,12,0.95) 30%, rgba(10,10,12,0.2) 70%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(10,10,12,1) 0%, transparent 50%)",
          }} />

          {/* Content */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            padding: "0 48px 56px",
            maxWidth: 640,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(232,184,75,0.12)",
              border: "1px solid rgba(232,184,75,0.3)",
              borderRadius: 99,
              padding: "4px 12px",
              fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
              color: "var(--gold)",
              marginBottom: 16,
            }}>
              🔥 TRENDING NOW
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(42px, 6vw, 72px)",
              letterSpacing: "0.03em",
              color: "var(--text)",
              lineHeight: 1,
              marginBottom: 16,
              animation: "heroFade 0.6s ease",
            }}>
              {hero.title || hero.name}
            </h1>

            <p style={{
              color: "var(--text-muted)",
              fontSize: 15,
              lineHeight: 1.6,
              marginBottom: 28,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {hero.overview}
            </p>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Link to={`/movie/${hero.id}`} style={{
                textDecoration: "none",
                background: "var(--gold)",
                color: "#000",
                fontWeight: 700, fontSize: 14,
                padding: "12px 28px",
                borderRadius: 8,
                letterSpacing: "0.02em",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                View Details
              </Link>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "12px 20px",
                fontSize: 14, fontWeight: 600,
                color: "var(--gold)",
              }}>
                ★ {hero.vote_average?.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Hero dots */}
          <div style={{
            position: "absolute", bottom: 32, right: 48,
            display: "flex", gap: 6,
          }}>
            {trending.slice(0, 5).map((_, i) => (
              <button key={i} onClick={() => { setHeroIdx(i); setHero(trending[i]); }}
                style={{
                  width: i === heroIdx ? 24 : 6,
                  height: 6,
                  borderRadius: 99,
                  background: i === heroIdx ? "var(--gold)" : "rgba(255,255,255,0.2)",
                  border: "none", cursor: "pointer",
                  transition: "all 0.3s",
                  padding: 0,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes heroFade { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px" }}>
        {/* Genre Filter */}
        <section style={{ marginBottom: 64 }}>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: 32, letterSpacing: "0.04em",
            color: "var(--text)", marginBottom: 20,
          }}>
            Browse by <span style={{ color: "var(--gold)" }}>Genre</span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
            {genres.map(g => (
              <button key={g.id} onClick={() => setSelectedGenre(selectedGenre === g.id ? null : g.id)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 99,
                  fontSize: 13, fontWeight: 500,
                  border: `1px solid ${selectedGenre === g.id ? "var(--gold)" : "var(--border)"}`,
                  background: selectedGenre === g.id ? "rgba(232,184,75,0.12)" : "var(--bg2)",
                  color: selectedGenre === g.id ? "var(--gold)" : "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "var(--font-body)",
                }}>
                {g.name}
              </button>
            ))}
          </div>
          {selectedGenre && genreMovies.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 16,
            }}>
              {genreMovies.slice(0, 10).map(m => <MovieCard key={m.id} movie={m} type="movie" />)}
            </div>
          )}
        </section>

        <Section title="Trending" accent="Movies" items={trending} type="movie" to="/movies" />
        <Section title="Trending" accent="TV Shows" items={trendingTV} type="tv" to="/tv" />
      </div>
    </div>
  );
}