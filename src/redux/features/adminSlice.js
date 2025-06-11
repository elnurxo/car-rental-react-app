// redux/features/adminSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    login(state, action) {
      state.admin = action.payload;
        state.loading = false;
    },
    updateProfile(state, action) {
      state.admin = { ...state.admin, ...action.payload };
    },
    logout(state) {
      state.admin = null;
      localStorage.setItem("adminId", JSON.stringify(null));
    },
     loginAdmin(state, action) {
      state.admin = action.payload;
    },
  },
});

export const { login, logout, updateProfile, loginAdmin } = adminSlice.actions;
export default adminSlice.reducer;
