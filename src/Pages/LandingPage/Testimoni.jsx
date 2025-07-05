import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { userAPI } from "../../assets/services/userAPI";
import { FAQAPI } from "../../assets/services/FAQAPI";
import { FaStar, FaHeart } from "react-icons/fa";

export default function Testimoni() {
  const [dataTestimoni, setDataTestimoni] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [selected, setSelected] = useState(null);

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
        console.error("Gagal ambil data testimoni:", err);
      }
    };

    const fetchFAQ = async () => {
      try {
        const result = await FAQAPI.fetchFAQ();
        const filtered = result.filter((item) => item.status === "ditampilkan");
        setFaqs(
          filtered.map((item) => ({
            question: item.pertanyaan,
            answer: item.jawaban,
          }))
        );
      } catch (error) {
        console.error("Gagal mengambil data FAQ:", error);
      }
    };

    fetchAll();
    fetchFAQ();
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
    <section className="w-full py-20 bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">
          Pertanyaan Umum Seputar Manajemen Keuangan SiGocengs
        </h2>
      </motion.div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 mt-15">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card bg-white shadow-xl border border-gray-200"
        >
          <div className="card-body">
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`btn btn-sm rounded-full transition ${
                    selected === i ? "btn-primary text-white" : "btn-outline"
                  }`}
                >
                  {faq.question}
                </button>
              ))}
              <button
                onClick={() => setSelected(null)}
                className="btn btn-sm btn-neutral rounded-full"
              >
                Tampilkan Semua
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {(selected !== null ? [faqs[selected]] : faqs).map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: selected !== null ? 0 : index * 0.15,
                  }}
                  className="space-y-2"
                >
                  <div className="chat chat-start">
                    <div className="chat-bubble chat-bubble-primary text-sm px-4 py-3 max-w-xs sm:max-w-md text-white font-semibold">
                      {faq.question}
                    </div>
                  </div>
                  <div className="chat chat-end">
                    <div className="chat-bubble bg-gray-100 text-gray-800 text-sm px-4 py-3 max-w-xs sm:max-w-md">
                      {faq.answer}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* TESTIMONI */}
      <motion.h1 className="text-3xl font-bold text-center mb-20 mt-20">
        Testimoni Pengguna
      </motion.h1>

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
                  <div className="absolute -top-5 right-5 z-20 animate-pulse">
                    <div className="bg-blue-400 rounded-xl shadow p-3">
                      <FaHeart className="text-white text-xl" />
                    </div>
                  </div>

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

                  <h3 className="text-center font-bold text-lg mb-1">{item.user?.nama || "Anonim"}</h3>
                  <motion.div
                    className="flex justify-center mb-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {renderStars(4 + (idx % 2))}
                  </motion.div>

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
        <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 h-2 w-32 bg-blue-400 rounded-full z-0" />
      </div>
    </section>
  );
}