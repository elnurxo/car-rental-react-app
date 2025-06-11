import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import { updateProfile } from "../../redux/features/userSlice";

const Profile = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [rentals, setRentals] = useState([]);
  useEffect(() => {
    controller.getAll(endpoints.rentals).then((resp) => {
      setRentals([...resp.filter((r) => r.userId == user.id)]);
    });
  }, [user.id]);

  //edit profile
  const [openModal, setOpenModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      profileImage: user.profileImage,
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    onSubmit: async (values, actions) => {
      const {
        email,
        phone,
        balance,
        profileImage,
        currentPassword,
        newPassword,
        confirmNewPassword,
      } = values;
      actions.resetForm();
      const updatedUser = {
        email: email,
        balance: balance,
        profileImage: profileImage,
        phone: phone,
      };
      await controller.update(endpoints.users, user.id, updatedUser);
      dispatch(updateProfile(updatedUser));
      enqueueSnackbar("profile update successfully!", {
        autoHideDuration: 2000,
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setOpenModal(false);
    },
  });

  return (
    <div className="py-10 px-4 flex flex-col lg:flex-row gap-6 justify-center">
      {/* Left: Profile Card */}
      <div className="bg-gray-100 rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user?.profileImage}
            alt={user?.fullName}
            className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-blue-600"
          />
          <h2 className="text-2xl font-bold text-blue-600">{user?.fullName}</h2>
          <p className="text-sm text-gray-500">{user?.role?.toUpperCase()}</p>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Phone:</span>
            <span className="font-medium">{user?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span>Balance:</span>
            <span className="font-medium text-green-600">${user?.balance}</span>
          </div>
          <div className="flex justify-between">
            <span>Registered At:</span>
            <span className="font-medium">
              {moment(user?.registeredAt).startOf("day").fromNow()}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setOpenModal(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Right: Rentals Table */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Your Rentals
        </h3>
        <table className="min-w-full text-sm text-left border border-gray-200">
          <thead className="bg-gray-100 text-gray-600 uppercase">
            <tr>
              <th className="px-4 py-2 border">Car</th>
              <th className="px-4 py-2 border">Rental Date</th>
              <th className="px-4 py-2 border">Return Date</th>
              <th className="px-4 py-2 border">Days</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {rentals?.length > 0 ? (
              rentals.map((rental, idx) => {
                const days =
                  moment(rental.returnDate).diff(
                    moment(rental.rentalDate),
                    "days"
                  ) || 1;
                return (
                  <tr key={idx} className="border-t">
                    <td className="px-4 py-2 border">{rental.carName}</td>
                    <td className="px-4 py-2 border">
                      {moment(rental.rentalDate).format("LL")}
                    </td>
                    <td className="px-4 py-2 border">
                      {moment(rental.returnDate).format("LL")}
                    </td>
                    <td className="px-4 py-2 border text-center">{days}</td>
                    <td className="px-4 py-2 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          rental.status === "Returned"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border text-green-600 font-semibold">
                      ${rental.totalPrice}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                  No rentals found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Edit your profile</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <form
              onSubmit={formik.handleSubmit}
              id="update-profile"
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Update email"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Update phone number"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Balance
                  </label>
                  <input
                    type="number"
                    min="0"
                    name="balance"
                    value={formik.values.balance}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Update balance"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <input
                    type="url"
                    name="profileImage"
                    value={formik.values.profileImage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Update profile image"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <hr className="my-4 border-gray-300" />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formik.values.currentPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter current password"
                  className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Update new password"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    value={formik.values.confirmNewPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </form>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            type="submit"
            disabled={
              formik.isSubmitting ||
              Object.entries(formik.errors).length > 0 ||
              !formik.dirty
            }
            className="disabled:bg-red-500 disabled:cursor-not-allowed bg-blue-500 cursor-pointer"
            form="update-profile"
          >
            Update
          </Button>
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Profile;
