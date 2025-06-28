import { userAPI } from "../../assets/services/userAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { BudgetAPI } from "../../assets/services/budgetAPI";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ManajemenUser() {
  const [dataUser, setDataUser] = useState([]);
  useEffect(() => {
    fetchUser2();
  }, []);

  const fetchUser2 = async () => {
    try {
      const result = await userAPI.fetchUser2();
      setDataUser(result);
    } catch (error) {
      console.error("Gagal ambil data pengguna:", error);
    }
  };

  useEffect(() => {
    const getUserWithTotalSaldo = async () => {
      try {
        const users = await userAPI.fetchUser2();
        const filteredUsers = users.filter((user) => user.role === "user");

        const saldos = await saldoAPI.fetchAllSaldo();
        const jumlahSaldoPerUser = {};
        saldos.forEach(({ user_id }) => {
          jumlahSaldoPerUser[user_id] = (jumlahSaldoPerUser[user_id] || 0) + 1;
        });

        const combined = filteredUsers.map((user) => ({
          ...user,
          jumlah_sumber: jumlahSaldoPerUser[user.id] || 0,
        }));

        setDataUser(combined);
      } catch (error) {
        console.error(
          "Gagal mengambil data pengguna atau jumlah saldo:",
          error.message
        );
      }
    };

    getUserWithTotalSaldo();
  }, []);

  useEffect(() => {
    const getUserWithSaldoAndTransaksi = async () => {
      try {
        const users = await userAPI.fetchUser2();
        const saldos = await saldoAPI.fetchAllSaldo();
        const transaksi = await transaksiAPI.fetchAllTransaksi();

        const saldoToUserMap = {};
        saldos.forEach(({ id, user_id }) => {
          saldoToUserMap[id] = user_id;
        });

        const jumlahSaldoPerUser = {};
        saldos.forEach(({ user_id }) => {
          jumlahSaldoPerUser[user_id] = (jumlahSaldoPerUser[user_id] || 0) + 1;
        });

        const jumlahTransaksiPerUser = {};
        transaksi.forEach(({ saldo_id }) => {
          const user_id = saldoToUserMap[saldo_id];
          if (user_id) {
            jumlahTransaksiPerUser[user_id] =
              (jumlahTransaksiPerUser[user_id] || 0) + 1;
          }
        });

        const combined = users.map((user) => ({
          ...user,
          jumlah_sumber: jumlahSaldoPerUser[user.id] || 0,
          jumlah_transaksi: jumlahTransaksiPerUser[user.id] || 0,
        }));

        setDataUser(combined);
      } catch (error) {
        console.error(
          "Gagal mengambil data pengguna, saldo, atau transaksi:",
          error.message
        );
      }
    };

    getUserWithSaldoAndTransaksi();
  }, []);

  const handleDelete = async (user) => {
    const confirmResult = await Swal.fire({
      title: `Hapus data ${user.nama}?`,
      text: "Semua data terkait juga akan dihapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    try {
      const saldos = await saldoAPI.fetchAllSaldo();
      const userSaldos = saldos.filter((s) => s.user_id === user.id);

      for (let saldo of userSaldos) {
        await transaksiAPI.deleteBySaldoId(saldo.id);
      }

      await saldoAPI.deleteByUserId(user.id);
      await BudgetAPI.deleteByUserId(user.id);
      await userAPI.deleteUser(user.id);

      setDataUser((prev) => prev.filter((u) => u.id !== user.id));

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data pengguna dan relasi berhasil dihapus!",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
            window.location.reload();
        },
      });
    } catch (err) {
      console.error("Gagal hapus data:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Terjadi kesalahan saat menghapus data.",
      });
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const filteredData = dataUser.filter(
    (item) =>
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if ((b.jumlah_sumber || 0) !== (a.jumlah_sumber || 0)) {
      return (b.jumlah_sumber || 0) - (a.jumlah_sumber || 0);
    }
    return (b.jumlah_transaksi || 0) - (a.jumlah_transaksi || 0);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px]">
      <div className="flex justify-center font-poppins text-center pt-8 ">
        <div className="text-[36px] font-semibold text-white leading-tight">
          Pengguna Sistem - SiGocengs
        </div>
        <div className="text-[36px] font-semibold text-white leading-tight">
          <div className="absolute top-[110px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[740px] z-10">
            <div className="overflow-auto w-full px-6 mt-5">
              <div className="flex justify-end mb-4 text-black">
               <input
              type="text"
              placeholder="Cari User..."
              className="input input-bordered w-full max-w-[600px] border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
              </div>
              <table className="min-w-[400px] w-full border border-gray-300 text-left text-sm rounded-2 text-black">
                <thead className="bg-blue-100 ">
                  <tr>
                    <th className="px-4 py-2 border-b">No</th>
                    <th className="px-4 py-2 border-b">Nama User</th>
                    <th className="px-4 py-2 border-b">Email</th>
                    <th className="px-4 py-2 border-b">Jumlah Sumber</th>
                    <th className="px-4 py-2 border-b">Jumlah Transaksi</th>
                    <th className="px-4 py-2 border-b">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-[14px] font-normal">
                  {currentData.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-500"
                      >
                        Tidak ada data pengguna
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id}>
                        <td className="px-4 py-2 border-b h-15">
                          {indexOfFirstItem + index + 1}
                        </td>
                        <td className="px-4 py-2 border-b">{item.nama}</td>
                        <td className="px-4 py-2 border-b">{item.email}</td>
                        <td className="px-4 py-2 border-b text-left">
                          {item.jumlah_sumber}
                        </td>
                        <td className="px-4 py-2 border-b text-left">
                          {item.jumlah_transaksi || 0}
                        </td>
                        <td className="px-4 py-2 border-b">
                          <div className="flex">
                            <div
                              className="bg-red-500 hover:bg-red-600 p-2 rounded-1 text-white cursor-pointer transition duration-300"
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
