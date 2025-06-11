import { Outlet } from "react-router";
import SideBar from "../components/admin/SideBar";

const AdminLayout = () => {
  return (
    <div>
      <SideBar />
      <div style={{paddingLeft:'260px'}}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
