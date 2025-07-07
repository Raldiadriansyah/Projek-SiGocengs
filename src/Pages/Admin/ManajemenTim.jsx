import { timAPI } from "../../assets/services/timAPI";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ManajemenTim() {
  const [dataTim, setDataTim] = useState([]);
  const [editData, setEditData] = useState({ nama: "", keterangan: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchTim = async () => {
      try {
        const result = await timAPI.fetchTim();
        setDataTim(result);
      } catch (error) {
        console.error("Gagal ambil data tim:", error);
      }
    };

    fetchTim();
  }, []);

  const handleEditClick = (index) => {
    setEditIndex(index);
    const selected = dataTim[index];
    setEditData({
      nama: selected.nama,
      keterangan: selected.keterangan,
      gambar: selected.foto,
      Gambar: selected.foto,
    });
    document.getElementById("modal_edit_tim").showModal();
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData((prev) => ({
          ...prev,
          gambar: reader.result,
          Gambar: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      alert("File harus berupa gambar JPG atau PNG.");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto" && files.length > 0) {
      const file = files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditData((prev) => ({
            ...prev,
            foto: file,
            gambar: reader.result, // Preview
            Gambar: reader.result, // Base64 untuk DB
          }));
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire("Error", "File harus berupa JPG atau PNG", "error");
      }
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSaveEdit = async () => {
    const updated = [...dataTim];
    const currentId = dataTim[editIndex].id;

    try {
      await timAPI.updateTim(currentId, {
        nama: editData.nama,
        keterangan: editData.keterangan,
        foto: editData.Gambar, // Base64 langsung ke kolom
      });

      updated[editIndex] = {
        ...updated[editIndex],
        nama: editData.nama,
        keterangan: editData.keterangan,
        foto: editData.Gambar,
      };

      setDataTim(updated);
      document.getElementById("modal_edit_tim").close();
      setEditIndex(null);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data tim berhasil diperbarui.",
        timer: 1800,
        showConfirmButton: false,
        willClose: () => {
          window.location.reload();
        },
      });
    } catch (err) {
      console.error("Gagal update data tim:", err);
      Swal.fire("Gagal!", "Terjadi kesalahan saat menyimpan data.", "error");
    }
  };

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px]">
      <div className="flex justify-center font-poppins text-center pt-8 ">
        <div className="text-[36px] font-semibold text-white leading-tight">
          Developer - Tim Pengembang
        </div>
        <div className="text-[36px] font-semibold text-white leading-tight">
          <div className="absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[740px] z-10">
            <div className="relative flex text-black  justify-center space-x-14">
              {dataTim.map((tim, index) => (
                <div
                  key={index}
                  className="relative bg-blue-100 rounded-2xl shadow-md p-4 flex flex-col items-center h-140 mt-20 w-full max-w-100"
                >
                  <img
                    src={
                      tim.foto.startsWith("data:image")
                        ? tim.foto
                        : `/img/tim/${tim.foto}`
                    }
                    alt={tim.nama}
                    className="w-60 h-60 object-cover rounded-full border-4 border-blue-300"
                  />
                  <h3 className="text-xl font-bold mt-10">{tim.nama}</h3>
                  <p className="text-gray-600 text-sm mt-2 text-center">
                    {tim.keterangan.split("-").map((line, i) => (
                      <span key={i}>
                        {line.trim()}
                        {i !== tim.keterangan.split("-").length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                  <div className="mt-18 w-full">
                    <button
                      onClick={() => handleEditClick(index)}
                      className="text-white text-[12px] bg-blue-400 hover:bg-blue-500 w-full h-10 rounded-2xl flex items-center justify-center transition duration-200"
                    >
                      Edit Data Tim
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Edit Tim */}
            <dialog id="modal_edit_tim" className="modal">
              <div className="modal-box text-black text-left font-normal">
                <h3 className="font-bold text-lg mb-4">Edit Data Tim</h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="nama"
                      value={editData.nama}
                      onChange={handleEditInputChange}
                      className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Keterangan
                    </label>
                    <textarea
                      name="keterangan"
                      value={editData.keterangan}
                      onChange={handleEditInputChange}
                      className="textarea border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      rows={3}
                      required
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Foto (jpg/png)
                    </label>
                    <input
                      type="file"
                      name="foto"
                      accept="image/jpeg, image/png"
                      onChange={handleEditImageChange}
                      className="file-input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>

                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() =>
                        document.getElementById("modal_edit_tim").close()
                      }
                    >
                      Tutup
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSaveEdit}
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
