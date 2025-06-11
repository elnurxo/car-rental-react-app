// redux/features/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    updateBalance(state, action) {
      state.user = { ...state.user, balance: action.payload };
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    logout(state) {
      state.user = null;
      localStorage.setItem("userId", JSON.stringify(null));
    },
     loginUser(state, action) {
      state.user = action.payload;
    },
     logoutUser(state) {
      state.user = null;
      localStorage.setItem("userId", JSON.stringify(null));
    },
  },
});

export const { login, logout, updateBalance, updateProfile, loginUser, logoutUser } =
  userSlice.actions;
export default userSlice.reducer;
