import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectWatchlist } from "../../features/watchlist/watchlistSlice";
import { useState } from "react";

export function Navbar() {
  const watchlist = useSelector(selectWatchlist);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setQ("");
    }
  };

  return (
    <nav className="mv-nav" style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,10,12,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div className="mv-nav-inner" style={{
        maxWidth: 1280, margin: "0 auto",
        padding: "0 24px",
        minHeight: 64,
        display: "flex", alignItems: "center", gap: 32, flexWrap: "wrap",
      }}>
        {/* Logo */}
        <Link className="mv-nav-logo" to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <img
            src="/logo.jpg"
            alt="Movieverse logo"
            style={{
              width: 34,
              height: 34,
              borderRadius: 8,
              objectFit: "cover",
              border: "1px solid var(--border)",
            }}
          />
          <span className="mv-logo-text" style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            letterSpacing: "0.05em",
            color: "var(--text)",
          }}>
            MOVIE<span style={{ color: "var(--gold)" }}>VERSE</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="mv-nav-links" style={{ display: "flex", gap: 4 }}>
          {[
            { to: "/", label: "Home", end: true },
            { to: "/movies", label: "Movies" },
            { to: "/tv", label: "TV Shows" },
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} style={({ isActive }) => ({
              textDecoration: "none",
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.01em",
              color: isActive ? "var(--gold)" : "var(--text-muted)",
              background: isActive ? "rgba(232,184,75,0.08)" : "transparent",
              transition: "all 0.15s",
            })}>
              {label}
            </NavLink>
          ))}
        </div>

        {/* Search */}
        <form className="mv-nav-search" onSubmit={handleSearch} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              height: 48,
              display: "flex",
              alignItems: "center",
              paddingLeft: 14,
              paddingRight: 14,
              gap: 10,
              background: "rgba(0,0,0,0.7)",
              border: `1px solid ${focused ? "var(--gold)" : "rgba(232,184,75,0.75)"}`,
              borderRadius: 99,
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxShadow: focused ? "0 0 0 3px rgba(232,184,75,0.12)" : "none",
            }}
          >
            <img
              src="/search.jpg"
              alt="Search"
              style={{
                width: 30,
                height: "auto",
                objectFit: "contain",
                marginLeft: 4,
                flexShrink: 0,
                display: "block",
                imageRendering: "-webkit-optimize-contrast",
              }}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search movies, shows..."
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                background: "transparent",
                border: "none",
                padding: 0,
                fontSize: 14,
                color: "var(--text)",
                outline: "none",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>
        </form>

        {/* Right */}
        <div className="mv-nav-right" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link to="/watchlist" style={{
            textDecoration: "none",
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "1px solid var(--border)",
            color: "var(--text-muted)",
            fontSize: 13,
            fontWeight: 500,
            transition: "all 0.15s",
            background: "transparent",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
            ★ Watchlist
            {watchlist.length > 0 && (
              <span style={{
                background: "var(--gold)", color: "#000",
                fontSize: 11, fontWeight: 700,
                padding: "1px 6px", borderRadius: 99,
              }}>{watchlist.length}</span>
            )}
          </Link>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .mv-nav-inner {
            gap: 10px !important;
            padding: 10px 14px !important;
          }
          .mv-nav-search {
            order: 3;
            flex: 1 1 100% !important;
          }
          .mv-nav-links {
            order: 2;
            width: 100%;
            overflow-x: auto;
            padding-bottom: 2px;
            scrollbar-width: none;
          }
          .mv-nav-links::-webkit-scrollbar {
            display: none;
          }
          .mv-nav-right {
            margin-left: auto;
          }
        }
        @media (max-width: 560px) {
          .mv-logo-text {
            font-size: 19px !important;
          }
        }
      `}</style>
    </nav>
  );
}