import { createSlice } from "@reduxjs/toolkit";

const getInitialNightMode = () => {
  const savedNightMode = localStorage.getItem("nightMode");
  return savedNightMode ? JSON.parse(savedNightMode) : false; // Default to false if not found
};

const initialState = {
  nightMode: getInitialNightMode(), // New toggle state
};

const pageSetting = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetSuccess: (state) => {
      state.success = false; // Reset success state
    },
    setNightMode: (state, action) => {
      state.nightMode = action.payload; // Update the toggle state
      localStorage.setItem("nightMode", JSON.stringify(action.payload));
    },
  },
});

export const { setNightMode } = pageSetting.actions;
export default pageSetting.reducer;
