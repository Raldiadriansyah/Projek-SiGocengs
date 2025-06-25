import React, { useState } from "react";
import CircularGallery from "../../Components/CircularGallery";
import { motion } from "framer-motion";

const testimonials = [
  { id: 1, name: "Andi Saputra", image: "/img/About1.jpeg" },
  { id: 2, name: "Siti Aminah", image: "/img/People2.jpeg" },
  { id: 3, name: "Rudi Hartono", image: "/img/testimoni3.jpg" },
  { id: 4, name: "Lisa Anggraini", image: "/img/testimoni4.jpg" },
];

const galleryItems = testimonials.map((item) => ({
  image: item.image,
  text: item.name,
}));

const faqs = [
  {
    question: "Apa itu SiGocengs?",
    answer:
      "SiGocengs adalah aplikasi manajemen keuangan pribadi yang membantu Anda mencatat pemasukan, pengeluaran, membuat anggaran, dan melihat laporan keuangan dengan mudah.",
  },
  {
    question: "Apakah data keuangan saya aman?",
    answer:
      "Tentu. SiGocengs menggunakan enkripsi dan penyimpanan aman untuk menjaga privasi dan keamanan data Anda.",
  },
  {
    question: "Apakah bisa dipakai untuk bisnis kecil?",
    answer:
      "Walaupun dirancang untuk individu, banyak pengguna menggunakan SiGocengs untuk mencatat transaksi bisnis kecil atau UMKM.",
  },
  {
    question: "Apakah SiGocengs tersedia gratis?",
    answer:
      "SiGocengs tersedia secara gratis dengan fitur dasar, namun ada juga paket Premium dan Pro untuk fitur lanjutan seperti export laporan dan integrasi API.",
  },
];

export default function Testimoni() {
  const [selected, setSelected] = useState(null);

  return (
    <section
      id="testimoni"
      className="w-full py-20 bg-gradient-to-br from-blue-100 to-purple-200 text-gray-800 overflow-hidden"
    >
      {/* Testimonials Heading */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-6xl mx-auto px-4 text-center mb-12"
      >
        <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka?</h2>
        <h3 className="text-sm text-white/80">
          Beberapa testimoni dari pengguna SiGocengs yang telah merasakan manfaatnya.
        </h3>
      </motion.div>
      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="card bg-white shadow-xl border border-gray-200"
        >
          <div className="card-body">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              Pertanyaan Umum Seputar Manajemen Keuangan SiGocengs
            </h2>

            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`btn btn-sm rounded-full transition ${selected === i ? "btn-primary text-white" : "btn-outline"
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

            {/* FAQ Chat Bubble Display */}
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


      {/* Circular Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        style={{ height: "600px", position: "relative" }}
      >
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
        />
      </motion.div>

    </section>
  );
}
