import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 pt-16 pb-8 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 mb-12">
        <div className="bg-blue-600 text-white rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2">Langganan Info Keuangan Terkini</h2>
            <p className="text-sm opacity-90">Dapatkan tips hemat dan pengelolaan keuangan keluarga setiap minggunya.</p>
          </div>
          <form className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Masukkan email Anda"
              className="py-2 px-4 rounded-lg w-full md:w-64 text-black"
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-semibold px-5 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-10">
        {/* Logo & Desc */}
        <div className="col-span-2">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">SiGocengs</h1>
          <p className="text-sm text-gray-600 mb-4">Platform manajemen keuangan pribadi dan keluarga, membantu Anda mengontrol pemasukan, pengeluaran, dan target finansial.</p>
          <div className="flex gap-4 text-blue-600">
            <FaFacebookF className="hover:text-blue-800 cursor-pointer" />
            <FaTwitter className="hover:text-blue-800 cursor-pointer" />
            <FaInstagram className="hover:text-blue-800 cursor-pointer" />
            <FaLinkedinIn className="hover:text-blue-800 cursor-pointer" />
            <FaGoogle className="hover:text-blue-800 cursor-pointer" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Perusahaan</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><a href="#">Tentang Kami</a></li>
            <li><a href="#">Layanan</a></li>
            <li><a href="#">Partner</a></li>
            <li><a href="#">Testimoni</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Bantuan</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Panduan Pengguna</a></li>
            <li><a href="#">Kritik & Saran</a></li>
            <li><a href="#">Kontak</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Kontak Kami</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li className="flex items-center gap-2"><MdPhone /> (021) 1234 5678</li>
            <li className="flex items-center gap-2"><MdEmail /> sigocengs@mail.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center text-gray-500 px-6">
        <p>© 2025 SiGocengs. Hak cipta dilindungi undang-undang.</p>
        <div className="flex justify-center gap-4 mt-2 text-xs">
          <a href="#" className="hover:underline">Kebijakan Privasi</a>
          <a href="#" className="hover:underline">Syarat & Ketentuan</a>
          <a href="#" className="hover:underline">Peta Situs</a>
        </div>
      </div>
    </footer>
  );
}
