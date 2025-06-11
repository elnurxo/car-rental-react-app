import { Link } from "react-router";

const Home = () => {
  return (
    <>
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Rent Your Dream Car Today
          </h2>
          <p className="text-lg md:text-xl mb-8">
            Affordable. Fast. Reliable. Anywhere in the city.
          </p>
          <Link
            to={"/cars"}
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-gray-100"
          >
            Browse Cars
          </Link>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-8">Why Choose RentRide?</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-100 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">Affordable Prices</h4>
              <p className="text-sm text-gray-600">
                Get the best deals on a wide range of cars.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">24/7 Support</h4>
              <p className="text-sm text-gray-600">
                We’re here whenever you need us.
              </p>
            </div>
            <div className="p-6 bg-gray-100 rounded-xl">
              <h4 className="font-semibold text-lg mb-2">Easy Booking</h4>
              <p className="text-sm text-gray-600">
                Book a car in just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
};

export default Home;
