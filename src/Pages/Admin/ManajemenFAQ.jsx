import { useEffect, useState } from "react";
import { FAQAPI } from "../../assets/services/FAQAPI";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ManajemenFAQ() {
  const [dataFAQ, setDataFAQ] = useState([]);
  const [formData, setFormData] = useState({ pertanyaan: "", jawaban: "" });
  const [editingFAQ, setEditingFAQ] = useState(null);

  const fetchFAQ = async () => {
    try {
      const result = await FAQAPI.fetchFAQ();
      setDataFAQ(result);
    } catch (error) {
      console.error("Gagal ambil data FAQ:", error);
    }
  };

  useEffect(() => {
    fetchFAQ();
  }, []);

  const handleTambahFAQ = async () => {
    try {
      const newFAQ = {
        pertanyaan: formData.pertanyaan,
        jawaban: formData.jawaban,
        status: "baru", // status default untuk FAQ baru
      };

      await FAQAPI.createFAQ(newFAQ);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "FAQ berhasil ditambahkan.",
        timer: 2000,
        showConfirmButton: false,
         willClose: () => {
             window.location.reload();
          },
      });

      // Reset form jika perlu
      setFormData({ pertanyaan: "", jawaban: "" });

      // Refresh data
      const updated = await FAQAPI.fetchFAQ();
      setDataFAQ(updated);

      // Tutup modal
      document.getElementById("modal_tambah_faq").close();
    } catch (error) {
      console.error("Gagal tambah FAQ:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menambahkan FAQ.",
      });
    }
  };

  const handleEditClick = (faq) => {
    setEditingFAQ(faq);
    setFormData({
      pertanyaan: faq.pertanyaan,
      jawaban: faq.jawaban,
      status: faq.status || "baru",
    });
    document.getElementById("modal_edit_faq").showModal();
  };
  const handleUpdateFAQ = async () => {
    try {
      console.log("Mengirim data ke updateFAQ:", {
        pertanyaan: formData.pertanyaan,
        jawaban: formData.jawaban,
        status: formData.status,
      });

      await FAQAPI.updateFAQ(editingFAQ.id, {
        pertanyaan: formData.pertanyaan,
        jawaban: formData.jawaban,
        status: formData.status,
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "FAQ berhasil diperbarui.",
        timer: 2000,
        showConfirmButton: false,
         willClose: () => {
             window.location.reload();
          },
      });

      setEditingFAQ(null);
      setFormData({ pertanyaan: "", jawaban: "", status: "baru" });
      fetchFAQ();
      document.getElementById("modal_edit_faq").close();
    } catch (error) {
      console.error("Gagal update FAQ:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat mengubah FAQ.",
      });
    }
  };
  const handleDeleteKebutuhan = async (id) => {
  const confirm = await Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data FAQ akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      await FAQAPI.deleteFAQ(id);

      Swal.fire({
        icon: "success",
        title: "Terhapus!",
        text: "Data FAQ berhasil dihapus.",
        timer: 2000,
        showConfirmButton: false,
         willClose: () => {
             window.location.reload();
          },
      });

      fetchFAQ(); // Refresh data
    } catch (error) {
      console.error("Gagal menghapus FAQ:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: "Terjadi kesalahan saat menghapus FAQ.",
      });
    }
  }
};


  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl min-h-[500px] mt-[-15px]">
      <div className="flex justify-center font-poppins text-center pt-8">
        <div className="text-[36px] font-semibold text-white leading-tight">
          FAQ - Pertanyaan Umum
        </div>
      </div>

      <div className="absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg p-6 max-h-[740px] overflow-y-auto space-y-6 z-10">
        <div className="flex justify-between items-center mb-4 px-4">
          <h2 className="text-xl font-semibold text-blue-700">Daftar FAQ</h2>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded transition duration-300"
            onClick={() =>
              document.getElementById("modal_tambah_faq").showModal()
            }
          >
            Tambah FAQ
          </button>
        </div>

        {/* Modal Tambah FAQ */}
        <dialog id="modal_tambah_faq" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-5">Tambah FAQ</h3>

            <div className="form-control mb-4">
              <label className="label">Pertanyaan</label>
              <input
                type="text"
                className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={formData.pertanyaan}
                onChange={(e) =>
                  setFormData({ ...formData, pertanyaan: e.target.value })
                }
              />
            </div>

            <div className="form-control mb-4">
              <label className="label">Jawaban</label>
              <textarea
                className="textarea border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                rows="4"
                value={formData.jawaban}
                onChange={(e) =>
                  setFormData({ ...formData, jawaban: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-action flex justify-end gap-2">
              <form method="dialog">
                <button className="btn btn-outline">Tutup</button>
              </form>
              <button className="btn btn-primary" onClick={handleTambahFAQ}>
                Simpan
              </button>
            </div>
          </div>
        </dialog>

        {dataFAQ.length === 0 ? (
          <p className="text-gray-600 text-center">Belum ada data FAQ.</p>
        ) : (
          dataFAQ.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 shadow-md rounded-xl p-4 flex justify-between items-start"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.pertanyaan}
                </h3>
                <p className="text-gray-600">{item.jawaban}</p>
              </div>

              <div className="flex flex-col items-end mr-4 ml-4 whitespace-nowrap mt-4">
                <p className="text-sm font-semibold text-gray-600">Status</p>
                <p
                  className={`text-sm font-semibold ${
                    item.status === "baru"
                      ? "text-green-600"
                      : item.status === "ditampilkan"
                      ? "text-blue-600"
                      : item.status === "disembunyikan"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  {item.status || "Belum diatur"}
                </p>
              </div>

              <div className="h-12 border-l-4 border-blue-500 mx-4 mt-4" />

              <div className="flex space-x-3 mt-4">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded text-white transition duration-300"
                  onClick={() => handleEditClick(item)}
                >
                  <FaRegEdit size={20} />
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 p-2 rounded text-white transition duration-300"
                  onClick={() => handleDeleteKebutuhan(item.id)}
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <dialog id="modal_edit_faq" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-5">Edit FAQ</h3>

          <div className="form-control mb-4">
            <label className="label">Pertanyaan</label>
            <input
              type="text"
              className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={formData.pertanyaan}
              onChange={(e) =>
                setFormData({ ...formData, pertanyaan: e.target.value })
              }
            />
          </div>

          <div className="form-control mb-4">
            <label className="label">Jawaban</label>
            <textarea
              className="textarea border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              rows="4"
              value={formData.jawaban}
              onChange={(e) =>
                setFormData({ ...formData, jawaban: e.target.value })
              }
            ></textarea>
          </div>
          <select
            className="select border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
          >
            {formData.status === "baru" ? (
              <>
                <option value="baru">Baru</option>
                <option value="ditampilkan">Ditampilkan</option>
                <option value="disembunyikan">Disembunyikan</option>
              </>
            ) : (
              <>
                <option value="ditampilkan">Ditampilkan</option>
                <option value="disembunyikan">Disembunyikan</option>
              </>
            )}
          </select>

          <div className="modal-action flex justify-end gap-2">
            <form method="dialog">
              <button className="btn btn-outline">Tutup</button>
            </form>
            <button className="btn btn-primary" onClick={handleUpdateFAQ}>
              Simpan Perubahan
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
