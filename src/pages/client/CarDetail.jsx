// CarDetail.jsx
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";

const CarDetail = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    controller.getOne(endpoints.cars, id).then((resp) => {
      setCar({ ...resp });
    });
  }, [id]);

  if (!car?.id) {
    return (
      <div className="p-10 text-center text-red-600 font-semibold">
        Car not found.
      </div>
    );
  } else {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-80 object-cover rounded-xl mb-6"
        />
        <h2 className="text-3xl font-bold text-blue-600 mb-2">
          {car.brand} {car.model}
        </h2>
        <p className="text-gray-700 text-lg mb-1">Year: {car.year}</p>
        <p className="text-gray-700 text-lg mb-1">Type: {car.type}</p>
        <p className="text-gray-700 text-lg mb-1">
          Price per day: ${car.pricePerDay}
        </p>
        <p
          className={`text-lg font-semibold mb-4 ${
            car.availability ? "text-green-600" : "text-red-500"
          }`}
        >
          {car.availability ? "Available" : "Not Available"}
        </p>

        <Link
          to="/cars"
          className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back to Cars
        </Link>
      </div>
    );
  }
};

export default CarDetail;
