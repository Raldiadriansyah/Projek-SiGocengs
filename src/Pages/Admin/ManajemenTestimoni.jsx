import { GiSightDisabled } from "react-icons/gi";
import { GrView } from "react-icons/gr";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { userAPI } from "../../assets/services/userAPI";
import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import Swal from "sweetalert2";

export default function ManajemenTestimoni() {
  const [dataTestimoni, setDataTestimoni] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 9;

useEffect(() => {
  setCurrentPage(1); 
}, [searchTerm]);

const filteredData = dataTestimoni.filter((item) => {
  const namaUser = item.user?.nama?.toLowerCase() || "";
  const isiTestimoni = item.testimoni?.toLowerCase() || "";
  const status = item.status?.toLowerCase() || "";

  return (
    namaUser.includes(searchTerm.toLowerCase()) ||
    isiTestimoni.includes(searchTerm.toLowerCase()) ||
    status.includes(searchTerm.toLowerCase())
  );
});

const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const indexEnd = currentPage * itemsPerPage;
const indexStart = indexEnd - itemsPerPage;
const currentData = filteredData.slice(indexStart, indexEnd);


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [tData, uData] = await Promise.all([
          testimoniAPI.fetchTestimoni(),
          userAPI.fetchUser(), 
        ]);

        const usersFiltered = uData.filter((u) => u.role === "user");

        const merged = tData.map((t) => {
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

  const handleUpdateStatus = async (item, newStatus) => {
    const actionText =
      newStatus === "ditampilkan" ? "menampilkan" : "menyembunyikan";

    const result = await Swal.fire({
      title: `Yakin ingin ${actionText} testimoni ini?`,
      text: "Perubahan status akan langsung diterapkan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah status",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await testimoniAPI.updateStatus(item.id, newStatus);
     
        setDataTestimoni((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, status: newStatus } : t))
        );


        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Status testimoni berhasil diubah menjadi "${newStatus}"`,
          timer: 1800,
          showConfirmButton: false,
          willClose: () => {
             window.location.reload();
          },
        });
      } catch (error) {
        console.error("Gagal update status:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: "Terjadi kesalahan saat mengubah status.",
        });
      }
    }
  };

  const handleDelete = async (item) => {
    const result = await Swal.fire({
      title: `Hapus testimoni dari ${item.user?.nama || "User"}?`,
      text: "Data yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await testimoniAPI.deleteTestimoni(item.id);
        setDataTestimoni((prev) =>
          prev.filter((testi) => testi.id !== item.id)
        );

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Testimoni telah dihapus.",
          timer: 1800,
          showConfirmButton: false,
          willClose: () => {
             window.location.reload();
          },
        });
      } catch (error) {
        console.error("Gagal hapus testimoni:", error);
        Swal.fire("Gagal!", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };


  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px]">
      <div className="flex justify-center font-poppins text-center pt-8 ">
        <div className="text-[36px] font-semibold text-white leading-tight">
          Testimoni - Ulasan Pengguna
        </div>
        <div className="text-[36px] font-semibold text-white leading-tight">
          <div className="absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[740px] z-10">
            <div className="overflow-auto w-full px-6 mt-5">
              <div className="flex justify-end mb-4 text-black">
               <input
              type="text"
              placeholder="Cari Data Testimoni..."
              className="input input-bordered w-full max-w-[600px] border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
              </div>
              <table className="min-w-[400px] w-full border border-gray-300 text-left text-sm rounded-2 text-black">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 border-b">No</th>
                    <th className="px-4 py-2 border-b">Nama User</th>
                    <th className="px-4 py-2 border-b ">Testimoni</th>
                    <th className="px-4 py-2 border-b">Status</th>
                    <th className="px-4 py-2 border-b w-40">Aksi</th>
                  </tr>
                </thead>
                <tbody className="font-normal">
                  {currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, idx) => (
                      <tr key={item.id} className="">
                        <td className="px-4 py-2 border-b">
                          {indexStart + idx + 1}
                        </td>
                        <td className="px-4 py-2 border-b">
                          {item.user?.nama || "-"}
                        </td>
                        <td className="px-4 py-2 border-b">{item.testimoni}</td>
                        <td className="px-4 py-2 border-b text-left">
                          <span
                            className={`rounded text-[15px] font-medium ${
                              item.status === "ditampilkan"
                                ? "text-blue-600 "
                                : item.status === "disembunyikan"
                                ? "text-yellow-600 "
                                : "text-green-600 "
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-2 border-b">
                          <div className="flex space-x-4">
                            <div
                              className="bg-blue-500 hover:bg-blue-600 p-2 rounded text-white cursor-pointer transition duration-300"
                              onClick={() =>
                                handleUpdateStatus(item, "ditampilkan")
                              }
                            >
                              <GrView size={20} />
                            </div>
                            <div
                              className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded text-white cursor-pointer transition duration-300"
                              onClick={() =>
                                handleUpdateStatus(item, "disembunyikan")
                              }
                            >
                              <GiSightDisabled size={20} />
                            </div>
                            <div
                              className="bg-red-500 hover:bg-red-600 p-2 rounded text-white cursor-pointer transition duration-300"
                              onClick={() => handleDelete(item)}
                            >
                              <RiDeleteBinLine size={20} />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-1 space-x-2 font-normal text-[18px] text-black">
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-6 space-x-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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
