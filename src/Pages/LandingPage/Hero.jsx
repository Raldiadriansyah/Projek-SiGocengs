import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaMoneyCheckAlt,
  FaChartLine,
  FaPiggyBank,
  FaBell,
  FaLock,
  FaStar,
  FaPlay,
  FaMoneyBillWave,
} from "react-icons/fa";
import About from "./About";
import Testimoni from "./Testimoni";
import Berlangganan from "./Berlangganan";
import ScrollVelocity from "../../Components/ScrollVelocity";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";




const testimonials = [
  {
    quote:
      "Don't know where your money is going? With this app, you can get your family budget in order.",
    name: "– Gorchakov, App Store",
  },
  {
    quote:
      "A simple yet powerful tool for managing finances. Highly recommend!",
    name: "– Amanda, Google Play",
  },
  {
    quote:
      "I now feel in control of my spending. This app changed how I view money.",
    name: "– Yusuf, App Store",
  },
];

const features = [
  {
    title: "Analisis keuangan",
    description: "Pantau keuangan harian, mingguan, dan bulanan.",
    icon: <FaChartLine className="text-white text-4xl" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    title: "Transaksi Harian",
    description: "Catat pemasukan dan pengeluaran dengan cepat dan mudah.",
    icon: <FaMoneyCheckAlt className="text-white text-4xl" />,
    color: "from-purple-500 to-indigo-600",
  },
  {
    title: "Manajemen Budget",
    description: "Tetapkan batas pengeluaran & kelola target menabung.",
    icon: <FaPiggyBank className="text-white text-4xl" />,
    color: "from-green-500 to-emerald-500",
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

  return (
    <>
      {/* HERO SECTION */}
      <section
        id="home"
        className={`pt-24 pb-16 relative transition-colors duration-500 ${darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 text-white"
          }`}
      >
        {/* Theme Toggle */}
        <label className="absolute top-4 left-4 z-50 flex cursor-pointer items-center gap-2">
          {/* Sun icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-400"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            />
          </svg>

          {/* DaisyUI toggle */}
          <input
            type="checkbox"
            className="toggle theme-controller"
            checked={darkMode}
            onChange={toggleTheme}
          />

          {/* Moon icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-300"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </label>


        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between gap-8 relative z-10">
          {/* Left */}
          <motion.div
            className="w-full md:w-1/2 text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Rating */}
            <div className="flex justify-center md:justify-start items-center gap-2 text-yellow-400 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
              <span className="text-sm text-white ml-2">
                5.0 Star (1.2k+ Reviews)
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Because Email Is <br /> Complicated Enough.🔥
            </h1>

            <p className="text-lg opacity-90 mb-6">
              Try Email Finder. Build your leads database faster with SiGocengs Email Finder. Start using for free.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href="#"
                className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-lg shadow hover:bg-gray-100 transition"
              >
                App Store
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-white hover:underline transition"
              >
                <FaPlay /> Watch Demo
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 mt-10">
              <div>
                <h3 className="text-2xl font-bold">20M+</h3>
                <p className="text-sm opacity-90">Contact leads</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">120+</h3>
                <p className="text-sm opacity-90">App Integrations</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">80+</h3>
                <p className="text-sm opacity-90">Countries Coverage</p>
              </div>
            </div>
          </motion.div>          

          {/* Right */}
     <motion.div
      className="w-full md:w-1/2 flex justify-center items-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Lottie tanpa card putih */}
      <div className="w-[500px] h-[500px]">
        <DotLottieReact
          src="https://lottie.host/a1d603fc-200a-4ac8-99ee-f0e2a9ca8171/HT00BkzHZ7.lottie"
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </motion.div>
        </div>
        <div className="mt-15">
           <motion.div
          id="features"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 max-w-6xl mx-auto mb-10 md:mb-16 lg:mb-20"
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
  
        </div>

      </section>
      

      <div className="bg-gradient-to-br from-blue-100 to-purple-200 py-8">
        <ScrollVelocity
          texts={[
            <>
              <FaMoneyBillWave className="inline-block mr-2 text-blue-700" />
              Kelola keuangan lebih cerdas dengan SiGocengs Atur anggaran & raih target menabung
            </>,
            <>
              <FaChartLine className="inline-block mr-2 text-indigo-700" />
              Pantau laporan keuangan mingguan & bulanan Dapatkan pengingat transaksi otomatis
            </>,
          ]}
          velocity={80}
          numCopies={4}
        />
      </div>

      {/* SECTION BAWAH: FEATURES */}
      <div className="bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 dark:text-white transition-colors duration-500 pt-10 pb-20">
       

     
      <About />
   
      <Testimoni />


      {/* <div className="w-full h-16 -mt-8 bg-white rounded-t-[50%]"></div> */}
    </div >
    </>
  );
}
