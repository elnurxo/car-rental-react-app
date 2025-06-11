import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import { Datepicker } from "flowbite-react";
import { HR } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import dateDiffInDays from "../../utils/differenceDays";
import { enqueueSnackbar } from "notistack";
import formatDate from "../../utils/formatRentalDate";
import { updateBalance } from "../../redux/features/userSlice";

const Rent = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const [car, setCar] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("id: ", id);
    controller.getOne(endpoints.cars, id).then((resp) => {
      setCar({ ...resp });
    });
  }, [id]);

  const dispatch = useDispatch();
  //rent feature
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [days, setDays] = useState(0);
  const [validated, setValidate] = useState(false);

  return (
    <div className="flex justify-center items-center p-6">
      <div className="w-full max-w-4xl bg-gray-100 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Rent a{" "}
          <span
            className={`${
              car?.availability ? "text-blue-500" : "text-red-500"
            }`}
          >
            {car?.brand} {car?.model}
          </span>
        </h2>
        {car?.availability ? (
          <>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                //new rental post
                await controller.post(endpoints.rentals, {
                  userId: user.id,
                  carId: car.id,
                  carName: `${car.brand} ${car.model}`,
                  rentalDate: formatDate(startDate),
                  returnDate: formatDate(endDate),
                  date: new Date(),
                  status: "booked",
                  totalPrice: +days * +car.pricePerDay,
                  days: days,
                });
                const updatedBalance =
                  user.balance - Number(days) * Number(car.pricePerDay);
                await controller.update(endpoints.users, user.id, {
                  balance: updatedBalance,
                });
                dispatch(updateBalance(updatedBalance));
                enqueueSnackbar(
                  `${car.brand} ${car.model} was rented for ${days} days!`,
                  {
                    variant: "success",
                    autoHideDuration: 2000,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "right",
                    },
                  }
                );
                navigate("/cars");
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Car Info */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="start-date" className="text-lg">
                  Start Date
                </label>
                <Datepicker
                  onChange={(date1) => {
                    setStartDate(date1);
                    setDays(1);
                  }}
                  id="start-date"
                  minDate={new Date()}
                />
              </div>
              <div className="flex flex-col gap-2.5">
                <label htmlFor="return-date" className="text-lg">
                  Return Date
                </label>
                <Datepicker
                  id="return-date"
                  onChange={(date2) => {
                    const days = dateDiffInDays(startDate, date2);
                    setEndDate(date2);
                    setTotal(+days * +car.pricePerDay);
                    setDays(days);
                    //validate if enough balance
                    if (user.balance < days * car.pricePerDay) {
                      enqueueSnackbar("not enough balance to rent this car", {
                        variant: "error",
                        autoHideDuration: 2000,
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "right",
                        },
                      });
                    } else {
                      setValidate(true);
                    }
                  }}
                  minDate={new Date(startDate)}
                />
              </div>
              {/* Submit Button */}
              <div className="col-span-1 md:col-span-2 text-center">
                <button
                  type="submit"
                  disabled={validated ? false : true}
                  className={`${
                    validated
                      ? "bg-blue-600 cursor-pointer hover:bg-blue-700"
                      : "bg-red-600 cursor-not-allowed"
                  } text-white px-6 py-3 rounded-lg transition`}
                >
                  Submit Rental
                </button>
              </div>
            </form>
            <HR />
            <h3 className="text-gray-700 text-2xl font-bold">
              Total: <span>${total.toFixed(2)}</span>
            </h3>
            <h3 className="text-gray-400 text-md">
              Current Balance: <span>${user.balance}</span>
            </h3>
            <h4 className="text-gray-600 italic text-md">
              car rented for {days} days
            </h4>
          </>
        ) : (
          <>
            <h1 className="text-center my-4 mb-14 text-4xl text-red-600">
              Car is not available for renting...
            </h1>
            <button
              onClick={() => {
                navigate("/cars");
              }}
              className="mx-auto block rounded text-white bg-blue-500 px-4 cursor-pointer py-2"
            >
              browse other cars
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Rent;
