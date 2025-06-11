import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { updateProfile } from "../../redux/features/userSlice";
import { enqueueSnackbar } from "notistack";
import { Link } from "react-router-dom";

const Favorites = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [favoriteCars, setFavoriteCars] = useState([]);
  useEffect(() => {
    controller.getAll(endpoints.cars).then((cars) => {
      setFavoriteCars([
        ...user.favorites.map((fav) => {
          const car = cars.find((c) => c.id === fav);
          if (car) {
            return car;
          }
        }),
      ]);
    });
  }, [user.favorites]);
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Favorite Cars
        </h3>

        {/* Car Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteCars.length ? (
            favoriteCars.map((car) => (
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
                      {car.brand} {car.model}
                    </Link>
                  </h4>
                  <p className="text-sm text-gray-600">
                    {car.type} – From ${car.pricePerDay}/day
                  </p>
                  <button
                    onClick={() => {
                      controller.update(endpoints.users, user.id, {
                        favorites: [
                          ...user.favorites.filter((f) => f != car.id),
                        ],
                      });
                      dispatch(
                        updateProfile({
                          favorites: [
                            ...user.favorites.filter((f) => f != car.id),
                          ],
                        })
                      );
                      enqueueSnackbar(
                        `${car.brand} ${car.model} removed from favorites`,
                        {
                          autoHideDuration: 2000,
                          anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "right",
                          },
                          variant: "success",
                        }
                      );
                    }}
                    className="cursor-pointer mt-4 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    remove from favorites
                  </button>
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
  );
};

export default Favorites;
