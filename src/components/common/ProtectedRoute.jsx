import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
  const { user, isAuthChecked: userChecked } = useSelector(
    (state) => state.user
  );
  const { admin, isAuthChecked: adminChecked } = useSelector(
    (state) => state.admin
  );

  if (role === "client") {
    if (!userChecked) return null; // or <FullPageLoader />
    return user && user.role === "client" ? (
      <Outlet />
    ) : (
      <Navigate to="/login" />
    );
  }

  if (role === "admin") {
    if (!adminChecked) return null; // or <FullPageLoader />
    return admin && admin.role === "admin" ? (
      <Outlet />
    ) : (
      <Navigate to="/admin/login" />
    );
  }

  return null;
};

export default ProtectedRoute;
