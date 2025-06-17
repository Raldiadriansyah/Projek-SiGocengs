import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMoneyCheckAlt,
  FaChartLine,
  FaPiggyBank,
  FaBell,
  FaLock,
} from "react-icons/fa";
import About from "./About";
import Testimoni from "./Testimoni";

const testimonials = [
  {
    quote: "Don't know where your money is going? With this app, you can get your family budget in order.",
    name: "– Gorchakov, App Store",
  },
  {
    quote: "A simple yet powerful tool for managing finances. Highly recommend!",
    name: "– Amanda, Google Play",
  },
  {
    quote: "I now feel in control of my spending. This app changed how I view money.",
    name: "– Yusuf, App Store",
  },
];

const features = [
  {
    title: "Transaksi Harian",
    description: "Catat pemasukan dan pengeluaran dengan cepat dan mudah.",
    icon: <FaMoneyCheckAlt className="text-white text-4xl" />,
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Laporan & Analisis",
    description: "Pantau laporan keuangan harian, mingguan, dan bulanan.",
    icon: <FaChartLine className="text-white text-4xl" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Manajemen Anggaran",
    description: "Tetapkan batas pengeluaran & kelola target menabung.",
    icon: <FaPiggyBank className="text-white text-4xl" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Notifikasi & Reminder",
    description: "Pengingat untuk pengeluaran, tagihan, dan lainnya.",
    icon: <FaBell className="text-white text-4xl" />,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Keamanan Data",
    description: "Semua data dienkripsi dan aman dengan privasi pengguna.",
    icon: <FaLock className="text-white text-4xl" />,
    color: "from-gray-700 to-gray-900",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
  }, [darkMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setFade(true);
      }, 200);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const scrollToFeatures = () => {
    const section = document.getElementById("features");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className={`min-h-screen pt-24 pb-16 relative transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 left-4 btn btn-sm btn-outline z-50"
      >
        {darkMode ? "☀️ Normal Mode" : "🌙 Dark Mode"}
      </button>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 relative z-10">
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            We collaborate <br /> to build digital experience
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Solusi pintar untuk kelola uangmu, pantau pengeluaran & menabung lebih baik.
          </p>
          <button
            onClick={scrollToFeatures}
            className="mt-6 px-6 py-3 rounded-full bg-neutral text-white hover:bg-neutral-focus transition"
          >
            Get Started
          </button>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="relative w-[280px] h-[360px] rounded-[50%/60%] border-2 border-base-content overflow-hidden shadow-xl">
            <img
              src="img/Sigocengss.jpg"
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <motion.div
        id="features"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 px-4 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 text-white shadow-lg transform transition duration-300 hover:scale-105`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-sm opacity-90">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Testimonials */}
      <motion.div
        className="max-w-3xl mx-auto bg-primary text-primary-content rounded-2xl p-8 shadow-md text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"}`}>
          <p className="italic text-xl">"{testimonials[current].quote}"</p>
          <p className="mt-4 text-sm font-semibold">{testimonials[current].name}</p>
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {testimonials.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/50"}`}
            ></span>
          ))}
        </div>
      </motion.div>
            <About />
            <Testimoni/>

    </section>
    
    
  );
}
