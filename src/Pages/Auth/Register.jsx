import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userAPI } from "../../assets/services/userAPI";

export default function Register() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage("");
    setSuccess(false);

    if (!nama || !email || !password) {
      setMessage("Semua kolom wajib diisi!");
      return;
    }

    try {
      const newUser = { nama, email, password };
      await userAPI.createUser(newUser);

      setSuccess(true);
      setMessage("Akun berhasil dibuat!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Gagal membuat akun. Coba lagi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden w-full max-w-6xl shadow-xl group transition-all duration-500 ease-in-out">

        {/* Register Form */}
        <div className="bg-white p-10 flex flex-col justify-center hover:z-10 hover:scale-105 transition-transform duration-500 ease-in-out">
          <h2 className="text-[30px] font-bold text-blue-600 mb-4">
            SiGocengs
          </h2>

         {message && (
          <div
            className={`w-full px-5 py-3 rounded-xl shadow-inner text-sm font-medium mb-4 ${
              success
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-red-100 border-red-400 text-red-700"
            }`}
          >
            {message}
          </div>
        )}


          <div className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Masukkan Nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Masukkan Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            </div>
          </div>

          <button
            onClick={handleRegister}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
          >
            Daftar
          </button>
           <div className="mt-4 text-center">
            <Link to="/" className="text-blue-500 hover:underline text-sm">
              Kembali ke landing page
            </Link>
          </div>
        </div>

        {/* Login Info */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out hover:z-10 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4">Selamat Datang!</h2>
          <p className="text-center mb-6 text-sm">
            Sudah memiliki akun? silahkan masuk untuk melanjutkan
          </p>
          <Link
            to="/login"
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
