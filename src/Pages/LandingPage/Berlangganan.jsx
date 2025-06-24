import { useState } from "react";
import { motion } from "framer-motion";

const packages = [
  {
    name: "Premium",
    price: "Rp 29.000/bulan",
    features: [
      "Pencatatan pemasukan & pengeluaran harian",
      "Laporan keuangan mingguan & bulanan",
      "Manajemen anggaran pribadi",
      "Notifikasi pengingat transaksi",
    ],
    disabled: [
      "Export laporan ke PDF/Excel",
      "Integrasi API pihak ketiga",
    ],
    highlight: true,
  },
  {
    name: "Pro",
    price: "Rp 59.000/bulan",
    features: [
      "Semua fitur Premium",
      "Export laporan ke PDF & Excel",
      "Rekomendasi keuangan berbasis AI",
      "Integrasi API pihak ketiga",
      "Keamanan data terenkripsi tingkat lanjut",
    ],
    disabled: [],
    highlight: false,
  },
];

const products = [
  { name: "Pencatatan Harian", category: "Transaksi" },
  { name: "Laporan Real-Time", category: "Laporan" },
  { name: "Anggaran & Rekomendasi", category: "Perencanaan" },
  { name: "Reminder & Notifikasi", category: "Pengingat" },
  { name: "Export Data", category: "Ekspor" },
  { name: "Keamanan Data", category: "Keamanan" },
];

export default function Berlangganan() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || p.category === category)
  );

  return (
    <div className="p-6 text-black">
      <motion.h1
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Paket Berlangganan SiGocengs
      </motion.h1>

      {/* PRICING SECTION */}
      <div className="flex flex-wrap gap-6 justify-center mb-12">
        {packages.map((pkg, i) => (
          <motion.div
            key={i}
            className={`card w-80 bg-base-100 text-black shadow-md border ${
              pkg.highlight ? "border-primary" : "border-base-200"
            }`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <div className="card-body">
              {pkg.highlight && (
                <span className="badge badge-warning badge-sm w-fit">
                  Rekomendasi
                </span>
              )}
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{pkg.name}</h2>
                <span className="text-lg font-semibold">{pkg.price}</span>
              </div>
              <ul className="mt-4 flex flex-col gap-2 text-sm">
                {pkg.features.map((f, i) => (
                  <li key={i}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-success"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
                {pkg.disabled.map((f, i) => (
                  <li key={i} className="opacity-50 line-through">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4 me-2 inline-block text-base-content/50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn-primary btn-block mt-4">Berlangganan</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* PRODUCT FILTER SECTION */}
      <motion.div
        className="max-w-xl mx-auto bg-base-100 p-6 rounded-xl shadow"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-4 text-black">Layanan Kami</h2>

        <div className="form-control mb-4">
          <input
            type="text"
            placeholder="Cari layanan..."
            className="input input-bordered"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`btn btn-sm ${category === "" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setCategory("")}
          >
            Semua
          </button>
          {[...new Set(products.map((p) => p.category))].map((cat, i) => (
            <button
              key={i}
              className={`btn btn-sm ${category === cat ? "btn-primary" : "btn-outline"}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="list-disc pl-4 text-sm space-y-1 text-black">
          {filteredProducts.map((p, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="font-medium">{p.name}</span> —{" "}
              <span className="text-xs text-gray-500">{p.category}</span>
            </motion.li>
          ))}
          {filteredProducts.length === 0 && (
            <li className="text-gray-400">Tidak ditemukan.</li>
          )}
        </ul>
      </motion.div>
    </div>
  );
}
