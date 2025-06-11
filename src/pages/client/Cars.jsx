import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { updateProfile } from "../../redux/features/userSlice";

const Cars = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [cars, setCars] = useState([]);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    controller.getAll(endpoints.cars).then((data) => {
      setCars([...data]);
    });
  }, []);

  const [sort, setSort] = useState("");
  const filteredCars = cars
    .filter((car) => {
      const matchesSearch =
        car.brand.toLowerCase().includes(search.toLowerCase()) ||
        car.model.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || car.type === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === "asc") {
        return a.pricePerDay - b.pricePerDay;
      } else if (sort === "desc") {
        return b.pricePerDay - a.pricePerDay;
      }
    });

  const types = [
    "coupe",
    "crossover",
    "electric",
    "hatchback",
    "hybrid",
    "minivan",
    "pickup-truck",
    "sedan",
    "sports-car",
    "station-wagon",
    "suv",
  ];

  return (
    <>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8 text-blue-600">
            Our Cars
          </h3>

          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-10">
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              onChange={(e) => {
                switch (e.target.value) {
                  case "asc":
                    setSort("asc");
                    break;
                  case "desc":
                    setSort("desc");
                    break;
                  default:
                    setSort("");
                    break;
                }
              }}
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option disabled defaultValue={""}>
                sort cars by price
              </option>
              <option value="desc">price high-to-low</option>
              <option value="asc">price low-to-high</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All Types</option>
              {types &&
                types.map((type, idx) => {
                  return (
                    <option key={idx} value={type}>
                      {type}
                    </option>
                  );
                })}
            </select>
          </div>

          {/* Car Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.length ? (
              filteredCars.map((car) => (
                <div
                  key={car.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <img
                    src={car.imageUrl}
                    alt={car.brand}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-lg underline">
                      <Link to={`/cars/${car.id}`}>
                        <span className="font-bold">{car.brand}</span>{" "}
                        {car.model}
                      </Link>
                    </h4>
                    <p className="text-sm text-gray-600">
                      {car.type} – From ${car.pricePerDay}/day
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (user && user.role === "client") {
                            navigate(`/rent-a-car/${car.id}`);
                          } else {
                            enqueueSnackbar("you should be logged in to rent", {
                              variant: "error",
                              autoHideDuration: 2000,
                              anchorOrigin: {
                                vertical: "bottom",
                                horizontal: "right",
                              },
                            });
                          }
                        }}
                        className="cursor-pointer mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        Rent Now
                      </button>
                      {user && (
                        <button
                          onClick={async () => {
                            if (user.favorites.find((fav) => fav == car.id)) {
                              await controller.update(
                                endpoints.users,
                                user.id,
                                {
                                  favorites: [
                                    ...user.favorites.filter(
                                      (f) => f != car.id
                                    ),
                                  ],
                                }
                              );
                              enqueueSnackbar(
                                `${car.brand} ${car.model} removed to favorites`,
                                {
                                  autoHideDuration: 2000,
                                  anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right",
                                  },
                                  variant: "success",
                                }
                              );
                              dispatch(
                                updateProfile({
                                  favorites: [
                                    ...user.favorites.filter(
                                      (f) => f != car.id
                                    ),
                                  ],
                                })
                              );
                            } else {
                              await controller.update(
                                endpoints.users,
                                user.id,
                                {
                                  favorites: [...user.favorites, car.id],
                                }
                              );
                              enqueueSnackbar(
                                `${car.brand} ${car.model} added to favorites`,
                                {
                                  autoHideDuration: 2000,
                                  anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "right",
                                  },
                                  variant: "success",
                                }
                              );
                              dispatch(
                                updateProfile({
                                  favorites: [...user.favorites, car.id],
                                })
                              );
                            }
                          }}
                          className="cursor-pointer mt-4 bg-red-800 text-white px-4 py-3 rounded hover:bg-red-700"
                        >
                          {user.favorites.find((fav) => fav == car.id) ? (
                            <FaHeart />
                          ) : (
                            <FaRegHeart />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No cars found.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cars;
