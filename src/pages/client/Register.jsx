import { Link, useNavigate } from "react-router";
import { useFormik } from "formik";
import registerValidationSchema from "../../validations/registerValidation";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { enqueueSnackbar } from "notistack";

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      profileImage: "",
      balance: "",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values, action) => {
      const users = await controller.getAll(endpoints.users);
      const duplicateEmail = users.find((u) => u.email == values.email);
      if (duplicateEmail) {
        values.email = "";
        enqueueSnackbar("email already taken", {
          variant: "error",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        await controller.post(endpoints.users, {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
          profileImage:
            values.profileImage ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
          role: "client",
          phone: values.phone,
          isBanned: false,
          banUntil: null,
          favorites: [],
          balance: values.balance,
          registeredAt: new Date(),
        });
        enqueueSnackbar("user registered successfully", {
          variant: "success",
          autoHideDuration: 2000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        navigate("/login");
        action.resetForm();
      }
    },
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Register
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-x-2.5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="text"
                placeholder="Alice Johnson"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.errors.fullName && formik.touched.fullName && (
                <span className="text-red-500 text-sm">
                  {formik.errors.fullName}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="email"
                placeholder="alice@example.com"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.errors.email && formik.touched.email && (
                <span className="text-red-500 text-sm">
                  {formik.errors.email}
                </span>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="tel"
              placeholder="+123456789"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.phone && formik.touched.phone && (
              <span className="text-red-500 text-sm">
                {formik.errors.phone}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-2.5">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.errors.password && formik.touched.password && (
                <span className="text-red-500 text-sm">
                  {formik.errors.password}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="password"
                placeholder="••••••••"
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {formik.errors.confirmPassword &&
                formik.touched.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Image (optional)
            </label>
            <input
              name="profileImage"
              value={formik.values.profileImage}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="url"
              placeholder="profile image..."
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.profileImage && formik.touched.profileImage && (
              <span className="text-red-500 text-sm">
                {formik.errors.profileImage}
              </span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Balance
            </label>
            <input
              name="balance"
              value={formik.values.balance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              min={0}
              placeholder="balance"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formik.errors.balance && formik.touched.balance && (
              <span className="text-red-500 text-sm">
                {formik.errors.balance}
              </span>
            )}
          </div>
          <button
            disabled={
              formik.isSubmitting ||
              Object.entries(formik.errors).length > 0 ||
              !formik.dirty
            }
            type="submit"
            className="w-full cursor-pointer bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to={"/login"} className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
