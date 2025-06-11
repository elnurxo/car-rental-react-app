import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("userId", JSON.stringify(action.payload.id));
      state.isAuthChecked = true;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthChecked = true;
    },
    logoutUser(state) {
      state.user = null;
      localStorage.removeItem("userId");
      state.isAuthChecked = true;
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    updateBalance(state, action) {
      state.user = { ...state.user, balance: action.payload };
    },
  },
});

export const { loginUser, logoutUser, setUser, updateProfile, updateBalance } =
  userSlice.actions;
export default userSlice.reducer;
