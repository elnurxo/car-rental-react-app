import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { HiChartPie, HiUser, HiLogout, HiUsers } from "react-icons/hi";
import { PiCarSimpleBold } from "react-icons/pi";
import { MdOutlineCarRental } from "react-icons/md";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { Link, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../../redux/features/adminSlice";
import { enqueueSnackbar } from "notistack";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "flowbite-react";

const SideBar = () => {
  const [cars, setCars] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const admin = useSelector((state) => state.admin.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    controller.getAll(endpoints.cars).then((res) => {
      setCars([...res]);
    });
  }, []);
  return (
    <>
      <Sidebar
        style={{ height: "100vh", position: "fixed" }}
        aria-label="Default sidebar example"
      >
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem icon={HiChartPie} as={Link} to="/admin">
              Dashboard
            </SidebarItem>
            <SidebarItem
              icon={PiCarSimpleBold}
              label={cars.length}
              as={Link}
              to="/admin/cars"
            >
              Cars
            </SidebarItem>
            <SidebarItem icon={HiUsers} as={Link} to="/admin/users">
              Users
            </SidebarItem>
            <SidebarItem
              icon={MdOutlineCarRental}
              as={Link}
              to="/admin/rentals"
            >
              Rentals
            </SidebarItem>
            <SidebarItem icon={HiUser} as={Link} to="/admin/profile">
              <span className="text-blue-700">{admin?.fullName}</span>
            </SidebarItem>
            <SidebarItem
              style={{ cursor: "pointer" }}
              onClick={() => setOpenModal(true)}
              icon={HiLogout}
            >
              Sign Out
            </SidebarItem>
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <ModalHeader>Admin Sign Out</ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Are you sure to log out?
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              setOpenModal(false);
              dispatch(logoutAdmin());
              localStorage.setItem("adminId", JSON.stringify(null));
              navigate("/admin/login");
              enqueueSnackbar("admin logged out successfully!", {
                variant: "success",
                autoHideDuration: 2000,
                anchorOrigin: {
                  vertical: "bottom",
                  horizontal: "right",
                },
              });
            }}
          >
            Log Out
          </Button>
          <Button color="alternative" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default SideBar;
