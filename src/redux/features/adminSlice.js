import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  admin: null,
  isAuthChecked: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    loginAdmin(state, action) {
      state.admin = action.payload;
      localStorage.setItem("adminId", JSON.stringify(action.payload.id));
      state.isAuthChecked = true;
    },
    setAdmin(state, action) {
      state.admin = action.payload;
      state.isAuthChecked = true;
    },
    logoutAdmin(state) {
      state.admin = null;
      localStorage.removeItem("adminId");
      state.isAuthChecked = true;
    },
    updateAdminProfile(state, action) {
      state.admin = { ...state.admin, ...action.payload };
    },
  },
});

export const { loginAdmin, logoutAdmin, setAdmin, updateAdminProfile } =
  adminSlice.actions;
export default adminSlice.reducer;
