// AdminLogin.jsx
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { enqueueSnackbar } from "notistack";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/adminSlice";
import { useNavigate } from "react-router";

const AdminLogin = () => {
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    controller.getAll(endpoints.users).then((resp) => {
      setAdmins([...resp.filter((r) => r.role === "admin")]);
    });
  }, []);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, actions) => {
      const { email, password } = values;
      const validAdmin = admins.find(
        (a) => a.email === email && a.password === password
      );
      if (validAdmin) {
        //ok
        console.log("valid admin: ", validAdmin);
        dispatch(login(validAdmin));
        localStorage.setItem("adminId", JSON.stringify(validAdmin.id));
        navigate("/admin");
        enqueueSnackbar("welcome back admin", {
          autoHideDuration: 2000,
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        enqueueSnackbar("invalid credentials", {
          autoHideDuration: 2000,
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        actions.resetForm();
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            disabled={
              formik.isSubmitting ||
              Object.entries(formik.errors).length > 0 ||
              !formik.dirty
            }
            type="submit"
            className="w-full py-2 px-4 disabled:bg-red-600 disabled:cursor-not-allowed cursor-pointer bg-blue-600  text-white font-semibold rounded-xl shadow-md transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
