import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarToggle,
} from "flowbite-react";
import { Link, NavLink } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/userSlice";

const Header = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const links = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "About",
      url: "/about",
    },
    {
      title: "Contact",
      url: "/contact",
    },
    {
      title: "Cars",
      url: "/cars",
    },
  ];
  return (
    <>
      <Navbar className="shadow py-4" fluid rounded>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          <Link to={"/"}>Car Rental</Link>
        </span>
        {user ? (
          <>
            <div className="flex md:order-2">
              <Dropdown
                arrowIcon={false}
                inline
                label={
                  <Avatar alt="User settings" img={user.profileImage} rounded />
                }
              >
                <DropdownHeader>
                  <span className="block text-sm">{user.fullName}</span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </DropdownHeader>
                <DropdownItem>
                  <Link to={"/profile"}>Profile</Link>
                </DropdownItem>
                <DropdownItem>
                  <Link to={"/favorites"}>Favorites</Link>
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem
                  onClick={() => {
                    dispatch(logout());
                    localStorage.setItem("userId", JSON.stringify(null));
                  }}
                >
                  Sign out
                </DropdownItem>
              </Dropdown>
              <NavbarToggle />
            </div>
          </>
        ) : (
          <div className="flex md:order-2 cursor-pointer gap-x-3.5">
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-blue-700" : "text-gray-600"
              }
              to={"/login"}
            >
              Login
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-blue-700" : "text-gray-600"
              }
              to={"/register"}
            >
              Sign Up
            </NavLink>
          </div>
        )}
        <NavbarCollapse>
          {links &&
            links.map((link, idx) => {
              return (
                <div className="cursor-pointer" key={idx}>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "text-blue-700" : "text-gray-600"
                    }
                    to={link.url}
                  >
                    {link.title}
                  </NavLink>
                </div>
              );
            })}
        </NavbarCollapse>
      </Navbar>
    </>
  );
};

export default Header;
