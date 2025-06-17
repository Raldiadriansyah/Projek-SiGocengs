import { Outlet } from "react-router-dom";
import Header from "../Pages/LandingPage/Header";
import Footer from "../Pages/LandingPage/Footer";

export default function LandingPage() {
  return (
    <div id="app-container" className="flex flex-col min-h-screen bg-gray-100">
      {/* Header tetap di atas */}
      <Header />

      {/* Konten utama dengan Outlet */}
      <main id="main-content" className="flex-grow px-4 py-6">
        <Outlet />
      </main>

      {/* Footer tetap di bawah */}
      <Footer />
    </div>
  );
}
