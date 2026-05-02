import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWatchlist, removeFromWatchlist, selectIsInWatchlist } from "../../features/watchlist/watchlistSlice";
import { img } from "../../api/tmdb";
import { useState } from "react";

export function MovieCard({ movie, type = "movie" }) {
  const dispatch = useDispatch();
  const inWatchlist = useSelector(selectIsInWatchlist(movie.id));
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  const title = movie.title || movie.name;
  const date = movie.release_date || movie.first_air_date;
  const year = date ? new Date(date).getFullYear() : null;
  const rating = movie.vote_average?.toFixed(1);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) dispatch(removeFromWatchlist(movie.id));
    else dispatch(addToWatchlist({ ...movie, mediaType: type }));
  };

  return (
    <Link
      to={`/${type}/${movie.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--bg3)",
        border: `1px solid ${hovered ? "rgba(232,184,75,0.25)" : "var(--border)"}`,
        transform: hovered ? "translateY(-4px)" : "none",
        transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered ? "0 12px 40px rgba(0,0,0,0.5)" : "none",
        position: "relative",
      }}
    >
      {/* Poster */}
      <div style={{ aspectRatio: "2/3", overflow: "hidden", position: "relative" }}>
        <img
          src={img(movie.poster_path)}
          alt={title}
          loading="lazy"
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.4s ease",
            display: "block",
          }}
          onError={(e) => {
            e.target.style.background = "var(--bg4)";
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&size=300&background=1E1E25&color=4A4852&length=1&bold=true`;
          }}
        />

        {/* Dark overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(10,10,12,0.9) 0%, rgba(10,10,12,0.2) 50%, transparent 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
        }} />

        {/* Rating chip */}
        <div style={{
          position: "absolute", top: 8, left: 8,
          background: "rgba(10,10,12,0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 6,
          padding: "3px 8px",
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 12, fontWeight: 600,
          color: "var(--gold)",
          border: "1px solid rgba(232,184,75,0.2)",
        }}>
          ★ {rating || "?"}
        </div>

        {/* Watchlist button */}
        <button
          onClick={handleWatchlist}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            position: "absolute", top: 8, right: 8,
            width: 32, height: 32,
            borderRadius: "50%",
            border: `1px solid ${inWatchlist ? "var(--gold)" : "rgba(255,255,255,0.2)"}`,
            background: inWatchlist ? "var(--gold)" : "rgba(10,10,12,0.7)",
            color: inWatchlist ? "#000" : "white",
            fontSize: 14,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s",
            opacity: hovered || inWatchlist ? 1 : 0,
            transform: btnHovered ? "scale(1.1)" : "scale(1)",
          }}
        >
          {inWatchlist ? "★" : "☆"}
        </button>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{
          fontWeight: 500, fontSize: 13,
          color: "var(--text)",
          lineHeight: 1.3,
          marginBottom: 4,
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>{title}</p>
        {year && (
          <p style={{ fontSize: 12, color: "var(--text-dim)" }}>{year}</p>
        )}
      </div>
    </Link>
  );
}