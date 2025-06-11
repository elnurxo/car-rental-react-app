import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import loginValidationSchema from "../../validations/loginValidation";
import { enqueueSnackbar } from "notistack";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { useDispatch } from "react-redux";
import { login } from "../../redux/features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, actions) => {
      const users = await controller.getAll(endpoints.users);
      const validUser = users.find(
        (u) =>
          u.email === values.email &&
          u.password === values.password &&
          u.role === "client"
      );
      if (validUser) {
        if (validUser.isBanned) {
          const now = new Date();
          const banUntil = new Date(validUser.banUntil);
          const timeDifferenceMs = banUntil.getTime() - now.getTime();
          const remainedMinutes =
            Math.floor(timeDifferenceMs / 1000 / 60) - 240;

          if (remainedMinutes > 0) {
            enqueueSnackbar(
              `your account has been banned, come back after ${remainedMinutes} minutes`,
              {
                variant: "warning",
                autoHideDuration: 2000,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              }
            );
          } else {
            actions.resetForm();
            await controller.update(endpoints.users, validUser.id, {
              isBanned: false,
              banUntil: null,
            });
            enqueueSnackbar("user sign in successfully", {
              variant: "success",
              autoHideDuration: 2000,
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
              },
            });
            const user = { ...validUser };
            delete user.password;
            localStorage.setItem("userId", JSON.stringify(user.id));
            dispatch(login(user));
            navigate("/cars");
          }
        } else {
          actions.resetForm();
          enqueueSnackbar("user sign in successfully", {
            variant: "success",
            autoHideDuration: 2000,
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          const user = { ...validUser };
          delete user.password;
          localStorage.setItem("userId", JSON.stringify(user.id));
          dispatch(login(user));
          navigate("/cars");
        }
      } else {
        enqueueSnackbar("invalid credentials", {
          variant: "error",
          autoHideDuration: 2000,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              value={formik.values.email}
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.email && formik.touched.email && (
              <span className="text-red-500 test-sm">
                {formik.errors.email}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={formik.values.password}
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.password && formik.touched.password && (
              <span className="text-red-500 test-sm">
                {formik.errors.password}
              </span>
            )}
          </div>
          <button
            disabled={
              formik.isSubmitting ||
              !formik.dirty ||
              Object.entries(formik.errors).length > 0
            }
            type="submit"
            className="w-full disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer  bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
