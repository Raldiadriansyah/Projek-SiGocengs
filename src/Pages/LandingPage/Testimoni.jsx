import React from "react";
import CircularGallery from "../../Components/CircularGallery";

const testimonials = [
  {
    id: 1,
    name: "Andi Saputra",
    // role: "Pengusaha",
    // text: "Marito",
    image: "/img/About1.jpeg"
  },
  {
    id: 2,
    name: "Siti Aminah",
    // role: "Mahasiswa",
    // text: "AyamBesar",
    image: "/img/testimoni2.jpg"
  },
  {
    id: 3,
    name: "Rudi Hartono",
    // role: "Karyawan Swasta",
    // text: "Kuda Lumping",
    image: "/img/testimoni3.jpg"
  },
  {
    id: 4,
    name: "Lisa Anggraini",
    // role: "Ibu Rumah Tangga",
    // text: "Yanto Susanto",
    image: "/img/testimoni4.jpg"
  }
];

// Format ulang ke format CircularGallery
const galleryItems = testimonials.map((item) => ({
  image: item.image,
  text: `${item.name}`
}));

export default function Testimoni() {
  return (
    <section id="testimoni" className="w-full py-20 bg-purple-200 text-gray-800 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Apa Kata Mereka?</h2>
        <p className="text-sm text-white/80">
          Beberapa testimoni dari pengguna SiGocengs yang telah merasakan manfaatnya.
        </p>
      </div>

      <div style={{ height: "600px", position: "relative" }}>
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
        />
      </div>
    </section>
  );
}
