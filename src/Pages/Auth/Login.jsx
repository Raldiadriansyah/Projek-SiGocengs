import { useState } from "react";
import { userAPI } from "../../assets/services/userAPI";
import { Link, useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  

  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const users = await userAPI.fetchUser();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {      
      localStorage.setItem("userName", user.nama || "User");
      localStorage.setItem("userID", user.id.toString());
      localStorage.setItem("userRole", user.role); 
     
      if (user.role === "admin") {
        navigate("/BerandaAdmin");
      } else {
        navigate("/Beranda");
      }
    } else {
      setMessage("Email atau password salah!");
    }
  } catch (error) {
    console.error("Login error:", error);
    setMessage("Gagal mengakses server.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl overflow-hidden w-[950px] max-w-6xl h-[410px] shadow-xl group transition-all duration-500 ease-in-out">
        {/* Login Form */}
        <div className="bg-white p-10 flex flex-col justify-center hover:z-10 hover:scale-105 transition-transform duration-500 ease-in-out">
          <h2 className="text-[30px] font-bold text-blue-600 mb-8">
            SiGocengs
          </h2>

          {message && (
            <div className="mb-4 text-sm font-medium text-center text-red-500">
              {message}
            </div>
          )}

          <div className="space-y-4">
            {/* Email Input */}
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

            {/* Password Input */}
            <div className="relative">
              <input
                type="password"
                placeholder="Masukkan Password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">🔒</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Ingatkan Saya
            </label>
            <a href="#" className="hover:underline font-medium">
              Lupa Password?
            </a>
          </div>

          <button 
          onClick={handleLogin}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105">
            Masuk
          </button>
        </div>

        {/* Signup Info */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-10 flex flex-col justify-center items-center transition-transform duration-500 ease-in-out hover:z-10 hover:scale-105">
          <h2 className="text-2xl font-semibold mb-4">Selamat Datang</h2>
          <p className="text-center mb-6 text-sm">
            Belum memiliki akun? Silahkan daftar terlebih dahulu!
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-700 font-bold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}
