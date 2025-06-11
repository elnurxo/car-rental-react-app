import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import ROUTES from "./routes";
import { setUser, logoutUser } from "./redux/features/userSlice";
import { setAdmin, logoutAdmin } from "./redux/features/adminSlice";
import { useLazyGetUserByIdQuery } from "./redux/api/userApi";

const router = createBrowserRouter(ROUTES);

function App() {
  const dispatch = useDispatch();
  const [fetchUserById] = useLazyGetUserByIdQuery();

  useEffect(() => {
    async function restoreSession() {
      const userId = JSON.parse(localStorage.getItem("userId"));
      const adminId = JSON.parse(localStorage.getItem("adminId"));

      if (userId) {
        try {
          const user = await fetchUserById(userId).unwrap();
          // eslint-disable-next-line no-unused-vars
          const { password, ...safeUser } = user;
          dispatch(setUser(safeUser));
        } catch {
          dispatch(logoutUser());
        }
      } else {
        dispatch(logoutUser());
      }

      if (adminId) {
        try {
          const admin = await fetchUserById(adminId).unwrap();
          // eslint-disable-next-line no-unused-vars
          const { password, ...safeAdmin } = admin;
          dispatch(setAdmin(safeAdmin));
        } catch {
          dispatch(logoutAdmin());
        }
      } else {
        dispatch(logoutAdmin());
      }
    }

    restoreSession();
  }, [dispatch, fetchUserById]);

  return (
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  );
}

export default App;
