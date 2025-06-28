import { sumberAPI } from "../../assets/services/sumberAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa"; 
import { RiDeleteBinLine } from "react-icons/ri"; 
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Swal from "sweetalert2";

export default function ManajemenSumber() {
  const [dataSumber, setDataSumber] = useState([]);
  const [editData, setEditData] = useState(null);

 const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);
  

  useEffect(() => {
  const getSumberWithUsage = async () => {
    try {
      const sumberList = await sumberAPI.fetchSumberList();
      const semuaSaldo = await saldoAPI.fetchAllSaldo(); 

      const sumberCount = {};
      semuaSaldo.forEach((item) => {
        sumberCount[item.sumber_id] = (sumberCount[item.sumber_id] || 0) + 1;
      });

      const sumberWithUsage = sumberList.map((sumber) => ({
        ...sumber,
        jumlah_pengguna: sumberCount[sumber.id] || 0,
      }));

      setDataSumber(sumberWithUsage);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message);
    }
  };

  getSumberWithUsage();
}, []);



  const [formInput, setFormInput] = useState({
    nama_sumber: "",
    deskripsi: "",
    Gambar: "", 
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "Gambar") {
      const file = files[0];
      if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormInput((prev) => ({
            ...prev,
            Gambar: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        alert("File harus berupa JPG atau PNG");
      }
    } else {
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    fetchSumber();
  }, []);

  const fetchSumber = async () => {
    try {
      const result = await sumberAPI.fetchSumberList();
      setDataSumber(result);
    } catch (error) {
      console.error("Gagal ambil data sumber:", error);
    }
  };

  const handleTambahSumber = async () => {
    if (!formInput.nama_sumber || !formInput.deskripsi) {
      Swal.fire("Error", "Nama sumber dan deskripsi wajib diisi", "error");
      return;
    }

    try {
      const newSumber = {
        nama_sumber: formInput.nama_sumber,
        deskripsi: formInput.deskripsi,
        Gambar: formInput.Gambar || "", 
      };

      await sumberAPI.insertSumber(newSumber);

       Swal.fire({
               icon: "success",
               title: "Berhasil",
               text: "Data Sumber Berhasil Ditambahkan",
               timer: 2000,
               showConfirmButton: false,
               willClose: () => {
                 window.location.reload();
               },
             }); 
      document.getElementById("modal_sumber").close();

      setFormInput({ nama_sumber: "", deskripsi: "", Gambar: "" });
    } catch (err) {
      console.error("Gagal simpan sumber:", err.response?.data || err.message);
      Swal.fire(
        "Gagal",
        `Terjadi kesalahan: ${err.response?.data?.message || err.message}`,
        "error"
      );
    }
  };



const handleEditClick = (item) => {
  setEditData({
    ...item,
    gambar: item.Gambar || "",
    Gambar: item.Gambar || "",
  });
  document.getElementById("modal_edit_sumber").showModal();
};



const handleUpdateSumber = async () => {
  try {
    if (!editData.nama_sumber || !editData.deskripsi) {
      Swal.fire("Error", "Nama dan deskripsi wajib diisi", "error");
      return;
    }

    const updatePayload = {
      nama_sumber: editData.nama_sumber,
      deskripsi: editData.deskripsi,
      Gambar: editData.Gambar || "", 
    };

    await sumberAPI.updateSumber(editData.id, updatePayload);

    Swal.fire({
               icon: "success",
               title: "Berhasil",
               text: "Data Berhasil Diubah",
               timer: 2000,
               showConfirmButton: false,
               willClose: () => {
                 window.location.reload();
               },
             }); 
    document.getElementById("modal_edit_sumber").close();
  } catch (error) {
    console.error("Gagal update:", error);
    Swal.fire("Gagal", "Terjadi kesalahan saat update", "error");
  }
};



const handleEditImageChange = (e) => {
  const file = e.target.files[0];
  if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditData((prev) => ({
        ...prev,
        gambar: reader.result,   // preview
        Gambar: reader.result,   // untuk simpan ke DB
      }));
    };
    reader.readAsDataURL(file);
  } else {
    alert("File harus berupa gambar JPG atau PNG.");
  }
};

const handleDelete = async (item) => {
  const confirm = await Swal.fire({
    title: `Hapus sumber "${item.nama_sumber}"?`,
    text: "Tindakan ini tidak dapat dibatalkan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      await sumberAPI.deleteSumber(item.id);
      Swal.fire({
               icon: "success",
               title: "Berhasil",
               text: "Transaksi berhasil dihapus",
               timer: 2000,
               showConfirmButton: false,
               willClose: () => {
                 window.location.reload();
               },
             }); 
    } catch (error) {
      console.error("Gagal hapus data:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
    }
  }
};

const filteredData = dataSumber.filter((item) =>
    item.nama_sumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);


  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px]">
      <div className="font-poppins text-center pt-8 ">
        <div className="text-[36px] text-center font-semibold text-white leading-tight">
           Kelola Sumber Dana
        </div>
        <div className="text-[36px] font-semibold text-white leading-tight ">
          <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 w-[90%]  z-20 ml-5 mt-5 ">
            <div className="flex">
              <button
              className="btn bg-blue-400 hover:bg-blue-500 text-white mt-3 ml-2"
              onClick={() => document.getElementById("modal_sumber").showModal()}
            >
              Tambah Sumber
            </button>          
             <div className="flex justify-end item-right px-6 mt-3 w-500 mr-5 text-black">
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="input input-bordered w-full max-w-[600px] border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
            </div>
          </div>

          <dialog id="modal_sumber" className="modal text-black text-left">
            <div className="modal-box font-normal">
              <h3 className="font-bold text-lg mb-4">Tambah Data Sumber</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Sumber</label>
                  <input
                    type="text"
                    name="nama_sumber"
                    value={formInput.nama_sumber}
                    onChange={handleInputChange}
                    className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Masukkan nama sumber"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <textarea
                    name="deskripsi"
                    rows="3"
                    value={formInput.deskripsi}
                    onChange={handleInputChange}
                    className="textarea border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    placeholder="Masukkan deskripsi"
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="flex text-sm font-medium mb-1">
                    Gambar <p className="text-red-400 ml-2">(jpg, jpeg, PNG)</p>
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    name="Gambar" 
                    onChange={handleInputChange}
                    className="file-input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="modal-action">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => document.getElementById("modal_sumber").close()}
                  >
                    Tutup
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleTambahSumber}
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </dialog>

          <div className="absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[740px] z-10">
            <div className="overflow-auto w-full px-6 mt-20">
              <table className="min-w-[400px] w-full border border-gray-300 text-left text-sm rounded-2 text-black">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 border-b w-20">No</th>
                    <th className="px-4 py-2 border-b w-60">Nama Sumber</th>
                    <th className="px-4 py-2 border-b w-80">Gambar</th>
                    <th className="px-4 py-2 border-b">Deskripsi</th>
                    <th className="px-4 py-2 border-b w-40">Pengguna</th>
                    <th className="px-4 py-2 border-b w-40">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text font-normal">
                 {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        Tidak ada data sumber
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 border-b">{index + 1}</td>
                        <td className="px-4 py-2 border-b ">{item.nama_sumber}</td>
                        <td className="px-4 py-2 border-b">
                          {item.Gambar ? (
                            <img src={item.Gambar} alt="" className="w-[90px] h-[90px] object-contain rounded-md  items-center" />
                          ) : (
                            <span className="text-gray-400">No Image</span>
                          )}
                        </td>
                        <td className="px-4 py-2 border-b">{item.deskripsi}</td>
                        <td className="px-4 py-2 border-b "> {item.jumlah_pengguna}</td>
                        <td className="px-4 py-2 border-b">
                         <div className="flex space-x-4">
                          <div className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-1 text-white cursor-pointer transition duration-300"
                            onClick={() => handleEditClick(item)}>
                            <FaRegEdit size={20} />
                          </div>
                          <dialog id="modal_edit_sumber" className="modal text-black text-left">
                              <div className="modal-box">
                                <h3 className="font-bold text-lg mb-4">Edit Data Sumber</h3>
                                <form className="space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Nama Sumber</label>
                                    <input
                                      type="text"
                                      value={editData?.nama_sumber || ""}
                                      onChange={(e) =>
                                        setEditData({ ...editData, nama_sumber: e.target.value })
                                      }
                                      className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-1">Deskripsi</label>
                                    <textarea
                                      rows="3"
                                      value={editData?.deskripsi || ""}
                                      onChange={(e) =>
                                        setEditData({ ...editData, deskripsi: e.target.value })
                                      }
                                      className="textarea border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    ></textarea>
                                  </div>
                                  <div>
                                    
                                  <label className="flex text-sm font-medium mb-1">
                                    Gambar <p className="text-red-400 ml-2">(jpg, jpeg, PNG)</p>
                                  </label>
                                  {editData?.gambar && (
                                      <div className="mt-2 mb-5">
                                        <img src={editData.Gambar} alt="Preview" className="w-[150px] h-[120px] object-contain rounded-md " />
                                      </div>
                                    )}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className="file-input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                  />                                 

                                </div>

                                  <div className="modal-action">
                                    <button
                                      type="button"
                                      className="btn"
                                      onClick={() => document.getElementById("modal_edit_sumber").close()}
                                    >
                                      Tutup
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleUpdateSumber}
                                    >
                                      Simpan
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </dialog>

                         
                          <div className="bg-red-500 hover:bg-red-600 p-2 rounded-1 text-white cursor-pointer transition duration-300"
                              onClick={() => handleDelete(item)}>
                               <RiDeleteBinLine size={20} />
                          </div>
                         </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              <div className="flex justify-center mt-1 space-x-2 font-normal text-[18px] text-black">
                    {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6 space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={currentPage === 1}
                      >
                        <AiOutlineArrowLeft size={20} />
                      </button>

                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`px-3 py-1 rounded ${
                            currentPage === i + 1
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 hover:bg-gray-300"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                        disabled={currentPage === totalPages}
                      >
                        <AiOutlineArrowRight size={20} />
                      </button>
                    </div>
                  )}


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
