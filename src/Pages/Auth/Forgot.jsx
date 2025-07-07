import { useState } from "react";
import { userAPI } from "../../assets/services/userAPI";
import { Link, useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailValid, setEmailValid] = useState(false); // untuk ubah form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage("Email tidak boleh kosong.");
      setSuccess(false);
      return;
    }

    try {
      const response = await userAPI.checkEmail(email); // ganti sesuai API kamu
      if (response.exists) {
        setEmailValid(true); // ubah ke form password
        setMessage("Email ditemukan. Silakan masukkan password baru.");
        setSuccess(true);
      } else {
        setMessage("Email tidak ditemukan.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat memeriksa email.");
      setSuccess(false);
    }
  };

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setMessage("Mohon isi kedua kolom password.");
      setSuccess(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi tidak sama.");
      setSuccess(false);
      return;
    }

    try {
      const response = await userAPI.updatePassword(email, password); // ganti sesuai API kamu
      if (response.success) {
        setMessage("Password berhasil diperbarui. Silakan login.");
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000); // redirect
      } else {
        setMessage("Gagal memperbarui password.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat memperbarui password.");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="grid grid-cols-1 bg-white rounded-3xl overflow-hidden w-[790px] max-w-6xl h-[430px] shadow-xl group transition-all duration-500 ease-in-out">
        <div className="bg-white p-10 flex flex-col justify-center hover:z-10 hover:scale-105 transition-transform duration-500 ease-in-out">
          <h2 className="text-[30px] font-bold text-blue-600 mb-8">
            SiGocengs
          </h2>

          {message && (
            <div
              className={`mb-4 text-sm font-medium text-center ${
                success ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          <div className="space-y-4">
            {!emailValid ? (
              <>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Masukkan Email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3 pl-12 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                </div>

                <button
                  onClick={handleForgotPassword}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Cek Email Anda
                </button>
              </>
            ) : (
              <>
                <input
                  type="password"
                  placeholder="Password Baru"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                <input
                  type="password"
                  placeholder="Konfirmasi Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-gray-200 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                <button
                  onClick={handleResetPassword}
                  className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Simpan Password
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-blue-500 hover:underline text-sm">
              Kembali ke Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
