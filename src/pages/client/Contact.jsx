const Contact = () => {
  return (
    <>
      <section className="bg-white my-4 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Contact Us
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Have questions or need help? Reach out — we’d love to hear from you!
          </p>

          <form className="bg-gray-100 p-8 rounded-xl shadow-md space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
            >
              Send Message
            </button>
          </form>

          <div className="mt-12 text-center text-sm text-gray-500">
            Or email us at{" "}
            <a
              href="mailto:support@rentrides.com"
              className="text-blue-600 hover:underline"
            >
              support@rentrides.com
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
