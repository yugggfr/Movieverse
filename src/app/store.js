import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "../features/watchlist/watchlistSlice";
import themeReducer from "../features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
    theme: themeReducer,
  },
});
