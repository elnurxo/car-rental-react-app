import { HR } from "flowbite-react";
import { useEffect, useState } from "react";
import controller from "../../services/requests/request";
import { endpoints } from "../../constants";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import moment from "moment";

const Dashboard = () => {
  const [cars, setCars] = useState([]);
  const [users, setUser] = useState([]);
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    controller.getAll(endpoints.cars).then((resCars) => {
      setCars([...resCars]);
    });
    controller.getAll(endpoints.users).then((resUsers) => {
      setUser([...resUsers]);
    });
    controller.getAll(endpoints.rentals).then((resRentals) => {
      setRentals([...resRentals]);
    });
  }, []);

  const stats = [
    { title: "Total Users", value: users.length },
    { title: "Total Cars", value: cars.length },
    { title: "Total Rentals", value: rentals.length },
  ];

  //chart 1
  const availableCount = cars.filter((car) => car.availability).length;
  const unavailableCount = cars.length - availableCount;

  const availabilityData = [
    { name: "Available Cars", value: availableCount },
    { name: "Unavailable Cars", value: unavailableCount },
  ];

  const COLORS = ["#00C49F", "#FF8042"];

  //chart 2
  const revenueMap = rentals.reduce((acc, rental) => {
    const carId = rental.carId;
    acc[carId] = (acc[carId] || 0) + rental.totalPrice;
    return acc;
  }, {});

  const revenueData = Object.entries(revenueMap).map(([carId, total]) => {
    const car = cars.find((c) => c.id === carId);
    return {
      name: car ? `${car.brand} ${car.model}` : `Car ID ${carId}`,
      revenue: total,
    };
  });

  //recent rentals & popular cars
  const recentRentals = rentals
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((rental) => {
      const user = users.find((u) => u.id === rental.userId);
      return {
        userName: user?.fullName || "Unknown User",
        carName: rental.carName,
        timeAgo: moment(rental.date).fromNow(),
      };
    });
  const carRentalCounts = rentals.reduce((acc, rental) => {
    acc[rental.carName] = (acc[rental.carName] || 0) + 1;
    return acc;
  }, {});

  const popularCars = Object.entries(carRentalCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([carName, count]) => ({
      name: carName,
      count,
      emoji: "🚗",
    }));
  return (
    <main className="px-6 pt-8 w-full">
      {/* Header */}
      <section className="flex gap-x-8 justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-800">
          Car Rental | Admin Panel Dashboard
        </h1>
        <span className="text-gray-600">{new Date().toDateString()}</span>
      </section>

      <HR className="mb-6" />

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 border border-gray-100"
          >
            <h2 className="text-gray-500 text-sm font-medium">{stat.title}</h2>
            <p className="text-3xl font-bold text-blue-800 mt-2">
              {stat.value}
            </p>
          </div>
        ))}
      </section>

      {/* Additional Sections */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Recent Rentals */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Rentals</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {recentRentals.length > 0 ? (
              recentRentals.map((rental, index) => (
                <li key={index}>
                  {rental.userName} rented {rental.carName} - {rental.timeAgo}
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No recent rentals</li>
            )}
          </ul>
        </div>

        {/* Popular Cars */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Popular Cars</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {popularCars.length > 0 ? (
              popularCars.map((car, index) => (
                <li key={index}>
                  {car.emoji} {car.name} ({car.count} rental
                  {car.count !== 1 ? "s" : ""})
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No rental data available</li>
            )}
          </ul>
        </div>
      </section>

      <HR />
      <h3 className="text-center text-2xl text-blue-800 mb-6">
        Dashboard Charts
      </h3>

      <section id="chart-1" className="grid grid-cols-2 px-8 gap-x-2.5 mt-4">
        <div className="available-cars w-full h-72">
          <PieChart width={300} height={250}>
            <Pie
              data={availabilityData}
              dataKey="value"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {availabilityData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div>
          <h3 className="text-center text-xl text-blue-800 mt-10">
            Car Revenue
          </h3>
          <BarChart
            width={600}
            height={300}
            data={revenueData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
