import React, { useState } from "react";
import CircularGallery from "../../Components/CircularGallery";
import { motion } from "framer-motion";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { userAPI } from "../../assets/services/userAPI";
import { FAQAPI } from "../../assets/services/FAQAPI";
import { useEffect } from "react";


export default function Testimoni() {
const [faqs, setFaqs] = useState([]);

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

useEffect(() => {
  fetchFAQ();
}, []);

  const [selected, setSelected] = useState(null);
  const [dataTestimoni, setDataTestimoni] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tData, uData] = await Promise.all([
          testimoniAPI.fetchTestimoni(),
          userAPI.fetchUser(),
        ]);

        // Filter hanya user dengan role "user"
        const usersFiltered = uData.filter((u) => u.role === "user");

        // Join testimoni dengan user, dan hanya ambil testimoni yang status = 'tampilkan'
        const merged = tData
          .filter((t) => t.status === "ditampilkan") // Filter berdasarkan status
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

  const galleryItems = dataTestimoni.map((item) => ({
    name: item.user?.nama || "Anonim",
    testimonial: item.testimoni || "Tidak ada testimoni.",
  }));

  return (
    <section
      id="Question"
      className="w-full py-20 bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 overflow-hidden"
    >
   {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">  Pertanyaan Umum Seputar Manajemen Keuangan SiGocengs</h2>
      
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

            {/* Filter Buttons */}
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

            {/* FAQ Chat Bubble */}
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
      <div id="Testimoni" className="py-20 px-4 text-black">
        <motion.h1 className="text-3xl font-bold text-center mb-20 mt-20">
          Testimoni Pengguna
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          style={{ height: "600px", position: "relative" }}
        >
          <div className="flex flex-wrap justify-center gap-6 ">
            {dataTestimoni.map((item, idx) => (
              <div
                key={idx}
                className="bg-black text-white w-64 h-72 rounded-xl p-4 flex flex-col justify-between shadow-lg"
              >
                <p className="text-sm italic">"{item.testimoni}"</p>
                <h4 className="text-center mt-4 font-semibold">
                  {item.user?.nama || "Anonim"}
                </h4>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
