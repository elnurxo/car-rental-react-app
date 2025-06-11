import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes";
import { SnackbarProvider } from "notistack";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import controller from "./services/requests/request";
import { endpoints } from "./constants";
import { loginAdmin } from "./redux/features/adminSlice";
import { loginUser, logoutUser } from "./redux/features/userSlice";
const routes = createBrowserRouter(ROUTES);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const adminId = JSON.parse(localStorage.getItem("adminId"));
    const userId = JSON.parse(localStorage.getItem("userId"));

    if (adminId) {
      controller.getOne(endpoints.users, adminId).then((admin) => {
        if (admin?.id) {
          delete admin.password;
          dispatch(loginAdmin(admin));
        } else {
          localStorage.setItem("adminId", JSON.stringify(null));
        }
      });
    }

    if (userId) {
      controller.getOne(endpoints.users, userId).then((user) => {
        if (user?.isBanned) {
          dispatch(logoutUser());
          alert("Your account has been banned!");
          window.location.reload();
        } else if (user?.id) {
          delete user.password;
          dispatch(loginUser(user));
        } else {
          localStorage.setItem("userId", JSON.stringify(null));
        }
      });
    }
  }, [dispatch]);
  return (
    <>
      <SnackbarProvider>
        <RouterProvider router={routes} />
      </SnackbarProvider>
    </>
  );
};

export default App;
