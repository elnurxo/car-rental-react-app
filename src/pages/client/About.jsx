const About = () => {
  return (
    <>
      <main className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          About Us
        </h2>
        <p className="text-lg leading-relaxed mb-6 text-center">
          RentRide is a modern car rental service built for speed, reliability,
          and comfort. We believe that renting a car should be easy, affordable,
          and stress-free.
        </p>
        <div className="grid gap-8 md:grid-cols-2 mt-10">
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              Our Mission
            </h3>
            <p className="text-gray-700">
              Our mission is to revolutionize car rentals with a user-friendly
              platform that lets customers find and book cars with just a few
              clicks.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-2 text-blue-600">
              What We Offer
            </h3>
            <p className="text-gray-700">
              From economy to luxury vehicles, we offer a wide range of cars for
              every budget. All vehicles are well-maintained and ready for your
              journey.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-4">
            Meet Our Team
          </h3>
          <p className="text-gray-700 max-w-2xl mx-auto">
            We are a passionate group of developers, drivers, and customer
            service professionals committed to making your ride experience
            smooth and enjoyable.
          </p>
        </div>
      </main>
    </>
  );
};

export default About;
