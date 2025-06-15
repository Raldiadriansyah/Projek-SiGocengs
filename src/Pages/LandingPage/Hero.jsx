import { useEffect, useState } from "react";
import {
    FaMoneyCheckAlt,
    FaChartLine,
    FaPiggyBank,
    FaBell,
    FaLock,
} from "react-icons/fa";

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
        if (darkMode) {
            document.body.classList.add("dark-mode");
            document.body.classList.remove("light-mode");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("dark-mode");
        }
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

    const toggleTheme = () => {
        setDarkMode((prev) => !prev);
    };

    const scrollToFeatures = () => {
        const section = document.getElementById("features");
        if (section) section.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section
            className={`min-h-screen w-full pt-24 pb-16 relative transition-colors duration-500 ${darkMode
                ? "bg-gray-900 text-white"
                : "bg-gradient-to-br from-blue-100 to-purple-200 text-gray-900"
                }`}
        >

            {/* Background Blur Glowing Orbs */}
            <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
                <div
                    className={`absolute top-10 left-10 w-32 h-32 rounded-full filter blur-2xl animate-float ${darkMode ? "bg-gray-600 opacity-30" : "bg-black opacity-20"
                        }`}
                />
                <div
                    className={`absolute bottom-16 right-20 w-40 h-40 rounded-full filter blur-3xl animate-float ${darkMode ? "bg-gray-500 opacity-25" : "bg-black opacity-20"
                        }`}
                />
                <div
                    className={`absolute top-1/3 left-1/3 w-24 h-24 rounded-full filter blur-xl animate-float ${darkMode ? "bg-gray-700 opacity-20" : "bg-black opacity-20"
                        }`}
                />
                <div
                    className={`absolute bottom-10 left-1/4 w-20 h-20 rounded-full filter blur-2xl animate-float ${darkMode ? "bg-gray-600 opacity-30" : "bg-black opacity-20"
                        }`}
                />
            </div>


            {/* Konten Utama */}
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 relative z-10">
                {/* Text Left */}
                <div className="w-full md:w-1/2 text-center md:text-left">

                    <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                        We collaborate <br /> to build digital experience
                    </h1>
                    <button
                        onClick={toggleTheme}
                        className="absolute top-4 left-4 btn btn-sm btn-outline z-50"
                    >
                        {darkMode ? "☀️ Normal Mode" : "🌙 Dark Mode"}
                    </button>
                    <p className="mt-4 text-lg opacity-80">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cursus
                        imperdiet sed id elementum.
                    </p>
                    <button
                        onClick={scrollToFeatures}
                        className="mt-6 px-6 py-3 rounded-full bg-neutral text-white hover:bg-neutral-focus transition"
                    >
                        Get Started
                    </button>
                </div>

                {/* Image Right */}
                <div className="relative w-full md:w-1/2 flex justify-center items-center">
                    <div className="relative w-[280px] h-[360px] rounded-[50%/60%] border-2 border-base-content overflow-hidden shadow-xl">
                        <img
                            src="img/Sigocengss.jpg"
                            alt="Profile"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="absolute top-4 left-4 text-4xl text-base-content">★</div>
                    <div className="absolute bottom-4 right-6 text-5xl text-base-content">✦</div>
                </div>
            </div>

            {/* Feature Cards */}
           {/* Feature Cards */}
            <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20 px-4 max-w-6xl mx-auto">
            {features.map((feature, index) => (
                <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 text-white shadow-lg transform transition duration-300 hover:scale-105`}
                >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm opacity-90">{feature.description}</p>
                </div>
            ))}
            </div>


            {/* Testimonials */}
            <div className="max-w-3xl mx-auto bg-primary text-primary-content rounded-2xl p-8 shadow-md text-center relative overflow-hidden">
                <div
                    key={current}
                    className={`transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
                        }`}
                >
                    <p className="italic text-xl">"{testimonials[current].quote}"</p>
                    <p className="mt-4 text-sm font-semibold">{testimonials[current].name}</p>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {testimonials.map((_, index) => (
                        <span
                            key={index}
                            className={`h-2 w-2 rounded-full ${index === current ? "bg-white" : "bg-white/50"
                                }`}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
}