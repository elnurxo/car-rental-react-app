import { useSelector } from "react-redux";

const AdminProfile = () => {
  const admin = useSelector((state) => state.admin.admin);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={admin.profileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
          />
          <h1 className="text-2xl font-semibold text-blue-800 mb-1">
            {admin.fullName}
          </h1>
          <span className="text-sm text-gray-500 mb-4">{admin.email}</span>
        </div>

        <div className="border-t border-gray-200 pt-4 space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Role:</span>
            <span className="text-blue-600">{admin.role}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Phone:</span>
            <span>{admin.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Registered At:</span>
            <span>{admin.registeredAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Balance:</span>
            <span>${admin.balance}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Banned:</span>
            <span
              className={admin.isBanned ? "text-red-600" : "text-green-600"}
            >
              {admin.isBanned ? `Yes (until ${admin.banUntil || "N/A"})` : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
