import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-xl group transition-all duration-500 ease-in-out">

        {/* Register Form */}
        <div className="bg-white p-10 flex flex-col justify-center hover:z-10 hover:scale-105 transition-transform duration-500 ease-in-out">
          <h2 className="text-[30px] font-bold text-blue-600 mb-8">
            SiGocengs
          </h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Full name"
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Create a password"
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105">
            📝 REGISTER
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </div>

        {/* Login Info */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out hover:z-10 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4">WELCOME BACK!</h2>
          <p className="text-center mb-6 text-sm">
            To keep connected with us please login with your credentials
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            LOG IN
          </Link>
        </div>
      </div>
    </div>
  );
}
