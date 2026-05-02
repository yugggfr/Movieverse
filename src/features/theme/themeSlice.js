import { createSlice } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    dark: localStorage.getItem("mv_theme") !== "light",
  },
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark;
      localStorage.setItem("mv_theme", state.dark ? "dark" : "light");
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export const selectDark = (state) => state.theme.dark;
export default themeSlice.reducer;
