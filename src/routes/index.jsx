//client pages
import Home from "../pages/client/Home";
import About from "../pages/client/About";
import Contact from "../pages/client/Contact";
import Cars from "../pages/client/Cars";
import CarDetail from "../pages/client/CarDetail";
import Favorites from "../pages/client/Favorites";
import Profile from "../pages/client/Profile";
import Login from "../pages/client/Login";
import Register from "../pages/client/Register";
//admin pages
import Dashboard from "../pages/admin/Dashboard";
import AdminLogin from "../pages/admin/AdminLogin";
import AdminUser from "../pages/admin/AdminUser";
import AdminCars from "../pages/admin/AdminCars";
import AdminRentals from "../pages/admin/AdminRentals";
import AdminProfile from "../pages/admin/AdminProfile";
//layouts
import ClientLayout from "../layout/ClientLayout";
import AdminLayout from "../layout/AdminLayout";
import NotFound from "../pages/common/NotFound";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AuthLayout from "../layout/AuthLayout";
import Rent from "../pages/client/Rent";

const ROUTES = [
  {
    element: <AdminLayout />,
    path: "/admin",
    children: [
      {
        element: <ProtectedRoute role="admin" />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "cars",
            element: <AdminCars />,
          },
          {
            path: "users",
            element: <AdminUser />,
          },
          {
            path: "rentals",
            element: <AdminRentals />,
          },
           {
            path: "profile",
            element: <AdminProfile />,
          },
        ],
      },
    ],
  },
  {
    element: <ClientLayout />,
    path: "/",
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "cars",
        element: <Cars />,
      },
      {
        path: "cars/:id",
        element: <CarDetail />,
      },
      {
        element: <ProtectedRoute role="client" />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "favorites",
            element: <Favorites />,
          },
          {
            path: "rent-a-car/:id",
            element: <Rent />,
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "/admin/login",
        element: <AdminLogin />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];

export default ROUTES;
