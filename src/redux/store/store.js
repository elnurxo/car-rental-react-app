import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import adminReducer from "../features/adminSlice";
import { userApi } from "../api/userApi";
import { setupListeners } from "@reduxjs/toolkit/query";
import { carApi } from "../api/carsApi";

export const store = configureStore({
  reducer: {
    user: userReducer,
    admin: adminReducer,
    [userApi.reducerPath]: userApi.reducer,
    [carApi.reducerPath]: carApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware).concat(carApi.middleware),
});

setupListeners(store.dispatch);
