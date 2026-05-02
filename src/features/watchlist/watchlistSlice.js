import { createSlice } from "@reduxjs/toolkit";

const load = () => {
  try {
    return JSON.parse(localStorage.getItem("mv_watchlist")) || [];
  } catch {
    return [];
  }
};

const save = (items) => {
  localStorage.setItem("mv_watchlist", JSON.stringify(items));
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: load(),
  reducers: {
    addToWatchlist(state, { payload }) {
      if (!state.find((m) => m.id === payload.id)) {
        state.push({ ...payload, watched: false, addedAt: Date.now() });
        save(state);
      }
    },
    removeFromWatchlist(state, { payload }) {
      const next = state.filter((m) => m.id !== payload);
      save(next);
      return next;
    },
    toggleWatched(state, { payload }) {
      const item = state.find((m) => m.id === payload);
      if (item) {
        item.watched = !item.watched;
        save(state);
      }
    },
  },
});

export const { addToWatchlist, removeFromWatchlist, toggleWatched } =
  watchlistSlice.actions;

export const selectWatchlist = (state) => state.watchlist;
export const selectIsInWatchlist = (id) => (state) =>
  state.watchlist.some((m) => m.id === id);

export default watchlistSlice.reducer;
