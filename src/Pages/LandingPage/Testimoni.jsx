import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import { ChevronDown } from "lucide-react";
import { FaStar, FaHeart } from "react-icons/fa";
import { FAQAPI } from "../../assets/services/FAQAPI";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { userAPI } from "../../assets/services/userAPI";

export default function FAQTestimoniSection() {
  const [faqs, setFaqs] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [dataTestimoni, setDataTestimoni] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [faqData, testiData, userData] = await Promise.all([
          FAQAPI.fetchFAQ(),
          testimoniAPI.fetchTestimoni(),
          userAPI.fetchUser(),
        ]);

        const filteredFAQs = faqData
          .filter((item) => item.status === "ditampilkan")
          .map((item) => ({
            question: item.pertanyaan,
            answer: item.jawaban,
          }));

        setFaqs(filteredFAQs);

        const usersFiltered = userData.filter((u) => u.role === "user");

        const mergedTestimoni = testiData
          .filter((t) => t.status === "ditampilkan")
          .map((t) => {
            const relatedUser = usersFiltered.find(
              (u) => Number(u.id) === Number(t.user_id)
            );
            return {
              ...t,
              user: relatedUser || { nama: "Anonim", role: "Pengguna Aplikasi" },
            };
          });

        setDataTestimoni(mergedTestimoni);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleAccordion = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  const renderStars = (count = 5) => {
    return [...Array(count)].map((_, idx) => (
      <FaStar key={idx} className="text-yellow-400 inline mr-1" />
    ));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    arrows: false,
  };

  return (
    <section className="bg-gradient-to-br from-blue-100 via-white to-purple-100 py-20 px-4">
      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <motion.h2
          className="text-3xl font-bold text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Pertanyaan Umum Seputar Manajemen Keuangan
        </motion.h2>
        <p className="text-gray-600 mt-2 text-sm">
          Temukan jawaban dari pertanyaan umum yang sering diajukan oleh pengguna SiGocengs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* FAQ Accordion */}
        <div className="bg-white shadow-xl rounded-xl p-6 space-y-2">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <div key={index} className="group border-b border-gray-200">
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-4 flex justify-between items-center text-left hover:text-blue-600 transition duration-300"
                >
                  <span
                    className={`text-base font-semibold transition ${
                      expandedIndex === index ? "text-blue-800" : "text-gray-700"
                    } group-hover:text-blue-600`}
                  >
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-500 transform transition-transform duration-300 ${
                      expandedIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    expandedIndex === index
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden text-gray-600 text-sm pb-4 pr-2"
                >
                  {faq.answer}
                </motion.div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Belum ada data FAQ.</p>
          )}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-blue-500 shadow-lg rounded-xl p-8 flex flex-col justify-center"
        >
          <h3 className="text-xl font-semibold text-black mb-4 text-center">
            Masih ada pertanyaan?
          </h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="👤 Nama Lengkap"
                className="p-3 border border-blue-300 rounded-lg w-full bg-white text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 transition"
              />
              <input
                type="email"
                placeholder="✉️ Email"
                className="p-3 border border-blue-300 rounded-lg w-full bg-white text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 transition"
              />
            </div>
            <textarea
              placeholder="📝 Tulis pesan kamu..."
              className="p-3 border border-blue-300 rounded-lg w-full bg-white text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 transition"
              rows={5}
            />
            <button
              type="submit"
              className="bg-white text-blue-600 font-semibold py-3 rounded-md w-full hover:bg-blue-100 transition duration-300"
            >
              Kirim Pesan
            </button>
          </form>
        </motion.div>
      </div>

      {/* Testimoni Slider */}
      <div className="mt-24 max-w-3xl mx-auto">
        <motion.h2
          className="text-3xl font-bold text-center mb-10 text-gray-800"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Testimoni Pengguna
        </motion.h2>

        <motion.div
          className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-gray-300 relative z-10"
          style={{ borderRadius: "2rem", minHeight: "420px" }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {dataTestimoni.length > 0 ? (
            <Slider {...sliderSettings}>
              {dataTestimoni.map((item, idx) => (
                <div key={idx} className="flex justify-center items-center px-4 py-4">
                  <motion.div
                    className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto border border-gray-200 hover:shadow-xl transition duration-300"
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                  >
                    <div className="flex justify-center mb-3">
                      <div className="w-20 h-20 rounded-full bg-sky-800 flex items-center justify-center text-white text-3xl border-4 border-blue-300">
                        😊
                      </div>
                    </div>

                    <h3 className="text-center font-bold text-lg mb-1 text-gray-900">
                      {item.user?.nama || "Anonim"}
                    </h3>

                    <div className="flex justify-center mb-3">
                      {renderStars(5)}
                    </div>

                    <p className="text-center text-sm italic text-gray-700 leading-relaxed">
                      "{item.testimoni}"
                    </p>
                  </motion.div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-gray-500">Belum ada testimoni ditampilkan.</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}