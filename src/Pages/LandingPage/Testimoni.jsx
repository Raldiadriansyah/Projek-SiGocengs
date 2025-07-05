import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { userAPI } from "../../assets/services/userAPI";
import { FaStar, FaHeart } from "react-icons/fa";

export default function Testimoni() {
  const [dataTestimoni, setDataTestimoni] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tData, uData] = await Promise.all([
          testimoniAPI.fetchTestimoni(),
          userAPI.fetchUser(),
        ]);
        const usersFiltered = uData.filter((u) => u.role === "user");

        const merged = tData
          .filter((t) => t.status === "ditampilkan")
          .map((t) => {
            const relatedUser = usersFiltered.find(
              (u) => Number(u.id) === Number(t.user_id)
            );
            return {
              ...t,
              user: relatedUser,
            };
          });

        setDataTestimoni(merged);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };

    fetchAll();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const renderStars = (count = 4) => {
    return [...Array(count)].map((_, idx) => (
      <FaStar key={idx} className="text-yellow-400 inline mr-1" />
    ));
  };

  return (
    <motion.section
      className="py-20 bg-blue-100 text-gray-800"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Testimoni Pengguna
      </motion.h1>

      {/* Monitor/Bingkai Card */}
      <div className="max-w-3xl mx-auto relative">
        <motion.div
          className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-gray-300 relative z-10"
          style={{ borderRadius: "2rem", minHeight: "420px" }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-gray-500 rounded"></div>

          <Slider {...settings}>
            {dataTestimoni.map((item, idx) => (
              <div key={idx} className="flex justify-center items-center px-4 py-4">
                <motion.div
                  className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto border border-gray-200 hover:shadow-xl transition duration-300"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                >
                  {/* Ikon hati animasi pulse */}
                  <div className="absolute -top-5 right-5 z-20 animate-pulse">
                    <div className="bg-blue-400 rounded-xl shadow p-3">
                      <FaHeart className="text-white text-xl" />
                    </div>
                  </div>

                  {/* Avatar animasi bounce */}
                  <motion.div
                    className="flex justify-center mb-3"
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 120, delay: 0.2 }}
                  >
                    <div className="avatar">
                      <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <img
                          src={`https://api.dicebear.com/7.x/thumbs/svg?seed=${item.user?.nama || "anonim"}`}
                          alt="avatar"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Nama dan rating */}
                  <h3 className="text-center font-bold text-lg mb-1">{item.user?.nama || "Anonim"}</h3>

                  <motion.div
                    className="flex justify-center mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {renderStars(4 + (idx % 2))}
                  </motion.div>

                  {/* Isi testimoni */}
                  <motion.p
                    className="text-center text-sm italic text-gray-700 leading-relaxed"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    "{item.testimoni}"
                  </motion.p>
                </motion.div>
              </div>
            ))}
          </Slider>
        </motion.div>

        {/* Hiasan bawah */}
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 h-2 w-32 bg-blue-400 rounded-full z-0" />
      </div>
    </motion.section>
  );
}
