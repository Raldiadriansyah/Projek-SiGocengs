import { AiOutlineArrowLeft } from "react-icons/ai";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useEffect, useState } from "react";
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import { BudgetAPI } from "../../assets/services/budgetAPI";
import { sumberAPI } from "../../assets/services/sumberAPI";
import Swal from "sweetalert2";
export default function Transaksi() {
  const [dataSaldo, setDataSaldo] = useState([]);
  const [data, setData] = useState([]);
  const [dataSumber, setDataSumber] = useState([]);
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;


  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


 const sortedData = [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

const filteredData = sortedData.filter((item) => {
  const saldoItem = dataSaldo.find(s => s.id === item.saldo_id);
  const sumberNama = dataSumber.find(s => s.id === saldoItem?.sumber_id)?.nama_sumber || "";
  const kebutuhan = item.kebutuhan?.jenis_kebutuhan || "";
  const jenisTransaksi = item.jenis_transaksi || "";

  return (
    sumberNama.toLowerCase().includes(searchTerm) ||
    kebutuhan.toLowerCase().includes(searchTerm) ||
    jenisTransaksi.toLowerCase().includes(searchTerm)
  );
});

const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const [newTransaksi, setNewTransaksi] = useState({
    saldo_id: "",
    jenis_transaksi: "masuk",
    jumlah: 0,
    kebutuhan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const result = await transaksiAPI.getAll();

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Dapatkan data saldo dan budget
      const saldoList = JSON.parse(localStorage.getItem("dataSaldo")) || [];
      const budgetList = await BudgetAPI.getAllByUser(
        localStorage.getItem("userID")
      );

      // Gabungkan data relasi manual
      const enriched = result.map((item) => {
        const saldo = saldoList.find((s) => s.id === item.saldo_id);
        const kebutuhan = budgetList.find((b) => b.id === item.kebutuhan);
        return { ...item, saldo, kebutuhan };
      });

      const filtered = enriched.filter((item) => {
        const date = new Date(item.created_at);
        return (
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        );
      });

      setData(filtered);
    };

    fetchData();
  }, []);

  const totalMasuk = data
    .filter((item) => item.jenis_transaksi === "masuk")
    .reduce((acc, item) => acc + item.jumlah, 0);

  const totalKeluar = data
    .filter((item) => item.jenis_transaksi === "keluar")
    .reduce((acc, item) => acc + item.jumlah, 0);


  useEffect(() => {
    fetchSaldoWithSumber();
  }, []);

  const [dataBudget, setDataBudget] = useState([]);

  useEffect(() => {
    const fetchSumber = async () => {
      try {
        const sumberList = await sumberAPI.getAll();
        setDataSumber(sumberList);
      } catch (error) {
        console.error("Gagal mengambil data sumber:", error);
      }
    };
    fetchSumber();
  }, []);

  useEffect(() => {
    const fetchBudget = async () => {
      const userId = localStorage.getItem("userID");
      if (!userId) return;

      try {
        const result = await BudgetAPI.getAllByUser(userId);
        setDataBudget(result);
      } catch (error) {
        console.error("Gagal memuat data budget:", error);
      }
    };

    fetchBudget();
  }, []);

  const fetchSaldoWithSumber = async () => {
    const userId = localStorage.getItem("userID");
    if (!userId) return;

    try {
      const [saldoList, sumberList] = await Promise.all([
        saldoAPI.fetchSaldoByUser(userId),
        sumberAPI.getAll(),
      ]);

      const saldoWithSumber = saldoList.map((saldo) => {
        const sumber = sumberList.find((s) => s.id === saldo.sumber_id);
        return {
          ...saldo,
          nama_sumber: sumber ? sumber.nama_sumber : "Sumber tidak ditemukan",
        };
      });

      setDataSaldo(saldoWithSumber);
    } catch (error) {
      console.error("Gagal memuat saldo dengan sumber:", error);
    }
  };
  const handleEditClick = (item) => {
    setEditData({
      ...item,
      jumlah: item.jumlah,
      jenis_transaksi: item.jenis_transaksi,
      kebutuhan: item.kebutuhan?.id || "",
    });
    document.getElementById("edit_modal").showModal();
  };

  const handleSimpanEdit = async () => {
    try {
      const saldoItem = dataSaldo.find((s) => s.id === editData.saldo_id);
      if (!saldoItem) {
        Swal.fire("Gagal", "Saldo tidak ditemukan", "error");
        return;
      }

      const transaksiLama = data.find((t) => t.id === editData.id);
      if (!transaksiLama) {
        Swal.fire("Gagal", "Transaksi lama tidak ditemukan", "error");
        return;
      }

      const jumlahBaru = parseInt(editData.jumlah);
      const jumlahLama = transaksiLama.jumlah;
      const selisih = jumlahBaru - jumlahLama;

      let saldoFinal = saldoItem.saldo;

      if (editData.jenis_transaksi === "masuk") {
        saldoFinal += selisih;
      } else {
        saldoFinal -= selisih;
      }

      await transaksiAPI.updateTransaksi(editData.id, {
        jumlah: jumlahBaru,
        jenis_transaksi: editData.jenis_transaksi,
        kebutuhan:
          editData.jenis_transaksi === "masuk"
            ? null
            : parseInt(editData.kebutuhan),
      });

      await saldoAPI.updateSaldo(saldoItem.id, { saldo: saldoFinal });

      document.getElementById("edit_modal").close();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Transaksi berhasil diperbarui!",
        timer: 2000,
        showConfirmButton: false,
        willClose: () => {
          window.location.reload();
        },
      });

      const refreshed = await transaksiAPI.getAll();
      setData(refreshed);
    } catch (error) {
      console.error("Gagal edit:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menyimpan", "error");
    }
  };

  const handleDelete = async (item) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus akan memengaruhi saldo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const saldoItem = dataSaldo.find((s) => s.id === item.saldo_id);
        if (!saldoItem) {
          Swal.fire("Gagal", "Data saldo tidak ditemukan", "error");
          return;
        }

        const saldoBaru = {
          ...saldoItem,
          saldo:
            item.jenis_transaksi === "keluar"
              ? saldoItem.saldo + item.jumlah
              : saldoItem.saldo - item.jumlah,
        };

        await saldoAPI.updateSaldo(saldoBaru.id, { saldo: saldoBaru.saldo });

        await transaksiAPI.deleteTransaksi(item.id);

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

        const refreshed = await transaksiAPI.getAll();
        setData(refreshed);
      } catch (error) {
        console.error("Gagal menghapus transaksi:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Terjadi kesalahan saat menghapus transaksi.",
        });
      }
    }
  };

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[300px] mt-[-15px]">
      <div className="flex justify-center font-poppins text-center pt-8 space-x-90 ">
        <div className="text-[36px] font-semibold text-white leading-tight">
          <h1 className="flex items-center gap-2 justify-center ml-4">
            Masuk <AiOutlineArrowDown className="text-green-300" />
          </h1>
          <p>Rp. {totalMasuk.toLocaleString("id-ID")}</p>
        </div>
        <div className="border-l-4 border-white h-30 my-auto"></div>
        <div className="text-[36px] font-semibold text-white leading-tight">
          <h1 className="flex items-center gap-2 justify-center ml-4">
            Keluar <AiOutlineArrowUp className="text-red-500" />
          </h1>
          <p>Rp. {totalKeluar.toLocaleString("id-ID")}</p>
        </div>
      </div>
      <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[680px] z-10">
        <div className="flex">
          <button
            className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition duration-300 ml-10 mt-5"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            Tambah Transaksi
          </button>
          <div className="flex justify-end item-right px-6 mt-5 w-500">
            <input
              type="text"
              placeholder="Cari transaksi..."
              className="input input-bordered w-full max-w-[600px] border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
            />
          </div>
        </div>

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Tambah Transaksi</h3>

            {/* Pilih Sumber */}
            <label className="block mb-2">Pilih Sumber</label>
            <select
              className="select  border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTransaksi.saldo_id}
              onChange={(e) =>
                setNewTransaksi({
                  ...newTransaksi,
                  saldo_id: parseInt(e.target.value),
                })
              }
            >
              <option value="">-- Pilih Sumber --</option>
              {dataSaldo.map((s) => (
                <option key={s.id} value={Number(s.id)}>
                  {s.nama_sumber}
                </option>
              ))}
            </select>

            {/* Jenis Transaksi */}
            <label className="block mb-2 mt-4">Jenis Transaksi</label>
            <select
              className="select border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTransaksi.jenis_transaksi}
              onChange={(e) => {
                const jenis = e.target.value;
                setNewTransaksi({
                  ...newTransaksi,
                  jenis_transaksi: jenis,
                  kebutuhan: jenis === "masuk" ? null : newTransaksi.kebutuhan,
                });
              }}
            >
              <option value="masuk">Masuk</option>
              <option value="keluar">Keluar</option>
            </select>

            {/* Jumlah */}
            <label className="block mb-2 mt-4">Jumlah</label>
            <input
              type="number"
              className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTransaksi.jumlah}
              onChange={(e) =>
                setNewTransaksi({
                  ...newTransaksi,
                  jumlah: parseInt(e.target.value),
                })
              }
            />

            {/* Pilih Kebutuhan */}
            <label className="block mb-2 mt-4">Kebutuhan</label>
            <select
              className="select border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={newTransaksi.kebutuhan || ""}
              onChange={(e) =>
                setNewTransaksi({
                  ...newTransaksi,
                  kebutuhan: parseInt(e.target.value),
                })
              }
              disabled={newTransaksi.jenis_transaksi === "masuk"}
            >
              <option value="">
                {newTransaksi.jenis_transaksi === "masuk"
                  ? "-- Tidak diperlukan --"
                  : "-- Pilih Kebutuhan --"}
              </option>
              {dataBudget.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.jenis_kebutuhan}
                </option>
              ))}
            </select>

            {/* Tombol Simpan & Close */}
            <div className="modal-action">
              <form method="dialog" className="flex gap-2">
                <button className="btn">Tutup</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      const userId = localStorage.getItem("userID");
                      if (
                        !userId ||
                        !newTransaksi.saldo_id ||
                        newTransaksi.jumlah <= 0 ||
                        (newTransaksi.jenis_transaksi === "keluar" &&
                          !newTransaksi.kebutuhan)
                      ) {
                        Swal.fire({
                          icon: "warning",
                          title: "Peringatan",
                          text: "Lengkapi semua data terlebih dahulu!",
                          timer: 2000,
                          showConfirmButton: false,
                        });
                        return;
                      }

                      await transaksiAPI.createTransaksi({
                        saldo_id: newTransaksi.saldo_id,
                        jenis_transaksi: newTransaksi.jenis_transaksi,
                        jumlah: newTransaksi.jumlah,
                        kebutuhan:
                          newTransaksi.jenis_transaksi === "masuk"
                            ? null
                            : newTransaksi.kebutuhan,
                        created_at: new Date().toISOString(),
                      });

                      const saldoItem = await saldoAPI
                        .fetchSaldoByUser(localStorage.getItem("userID"))
                        .then((list) =>
                          list.find((s) => s.id === newTransaksi.saldo_id)
                        );

                      if (!saldoItem) {
                        Swal.fire({
                          icon: "error",
                          title: "Gagal",
                          text: "Saldo tidak ditemukan",
                          timer: 2000,
                          showConfirmButton: false,
                        });
                        return;
                      }

                      const updatedSaldo = {
                        ...saldoItem,
                        saldo:
                          newTransaksi.jenis_transaksi === "masuk"
                            ? saldoItem.saldo + newTransaksi.jumlah
                            : saldoItem.saldo - newTransaksi.jumlah,
                      };

                      await saldoAPI.updateSaldo(updatedSaldo.id, updatedSaldo);

                      // Reset form dan tutup modal
                      setNewTransaksi({
                        saldo_id: "",
                        jenis_transaksi: "masuk",
                        jumlah: 0,
                        kebutuhan: "",
                      });

                      document.getElementById("my_modal_1").close();

                      // Tampilkan pesan sukses
                      Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Transaksi berhasil ditambahkan!",
                        timer: 2000,
                        showConfirmButton: false,
                      });

                      setTimeout(() => {
                        window.location.reload();
                      }, 2100);
                    } catch (error) {
                      console.error("Gagal menyimpan transaksi:", error);
                      Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Terjadi kesalahan saat menyimpan transaksi.",
                        timer: 2000,
                        showConfirmButton: false,
                      });
                    }
                  }}
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <div className="overflow-auto w-full px-6 mt-6">
          <table className="min-w-[400px] w-full border border-gray-300 text-left text-sm rounded-2">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-2 border-b">No</th>
                <th className="px-4 py-2 border-b">Tanggal</th>
                <th className="px-4 py-2 border-b">Sumber</th>
                <th className="px-4 py-2 border-b">Transaksi</th>
                <th className="px-4 py-2 border-b ml-30">Kebutuhan</th>
                <th className="px-4 py-2 border-b ml-30">Jumlah</th>
                <th className="px-4 py-2 border-b w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentItems
                .filter((item) => {
                  const saldoItem = dataSaldo.find(
                    (s) => s.id === item.saldo_id
                  );
                  const sumberNama =
                    dataSumber.find((s) => s.id === saldoItem?.sumber_id)
                      ?.nama_sumber || "";
                  const kebutuhan = item.kebutuhan?.jenis_kebutuhan || "";
                  const jenisTransaksi = item.jenis_transaksi || "";

                  return (
                    sumberNama.toLowerCase().includes(searchTerm) ||
                    kebutuhan.toLowerCase().includes(searchTerm) ||
                    jenisTransaksi.toLowerCase().includes(searchTerm)
                  );
                })
                .map((item, index) => {
                  const saldoItem = dataSaldo.find(
                    (s) => s.id === item.saldo_id
                  );
                  const sumberNama =
                    dataSumber.find((s) => s.id === saldoItem?.sumber_id)
                      ?.nama_sumber || "Tidak Diketahui";
                  const kebutuhan = item.kebutuhan?.jenis_kebutuhan || "-";
                  return (
                    <tr key={item.id}>
                      <td className="px-4 py-2 border-b">
                        {indexOfFirstItem + index + 1}
                      </td>
                      <td className="px-4 py-2 border-b">
                        {new Date(item.created_at).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-2 border-b">{sumberNama}</td>
                      <td className="px-4 py-2 border-b">
                        <div className="flex items-center gap-2 font-semibold">
                          {item.jenis_transaksi === "keluar" ? (
                            <>
                              <span className="text-red-600 capitalize">
                                keluar
                              </span>
                              <AiOutlineArrowUp className="text-red-600" />
                            </>
                          ) : (
                            <>
                              <span className="text-green-600 capitalize">
                                masuk
                              </span>
                              <AiOutlineArrowDown className="text-green-600" />
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-2 border-b capitalize">
                        {kebutuhan}
                      </td>
                      <td className="px-4 py-2 border-b">
                        Rp. {item.jumlah.toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-2 border-b">
                        <dialog id="edit_modal" className="modal">
                          <div className="modal-box">
                            <h3 className="font-bold text-lg mb-4">
                              Edit Transaksi
                            </h3>

                            {editData && (
                              <>
                                <label className="block mb-2">Jumlah</label>
                                <input
                                  type="number"
                                  className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                  value={editData.jumlah}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      jumlah: parseInt(e.target.value),
                                    })
                                  }
                                />

                                <label className="block mb-2 mt-4">
                                  Jenis Transaksi
                                </label>
                                <select
                                  className="select border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                  value={editData.jenis_transaksi}
                                  disabled
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      jenis_transaksi: e.target.value,
                                      kebutuhan:
                                        e.target.value === "masuk"
                                          ? null
                                          : editData.kebutuhan,
                                    })
                                  }
                                >
                                  <option value="masuk">Masuk</option>
                                  <option value="keluar">Keluar</option>
                                </select>

                                <label className="block mb-2 mt-4">
                                  Kebutuhan
                                </label>
                                <select
                                  className="select border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                  value={editData.kebutuhan || ""}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      kebutuhan: parseInt(e.target.value),
                                    })
                                  }
                                  disabled={
                                    editData.jenis_transaksi === "masuk"
                                  }
                                >
                                  <option value="">
                                    {editData.jenis_transaksi === "masuk"
                                      ? "-- Tidak diperlukan --"
                                      : "-- Pilih Kebutuhan --"}
                                  </option>
                                  {dataBudget.map((item) => (
                                    <option key={item.id} value={item.id}>
                                      {item.jenis_kebutuhan}
                                    </option>
                                  ))}
                                </select>

                                <div className="modal-action">
                                  <form method="dialog">
                                    <button className="btn">Tutup</button>
                                  </form>
                                  <button
                                    className="btn btn-primary"
                                    onClick={handleSimpanEdit}
                                  >
                                    Simpan Perubahan
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </dialog>

                        <div className="flex space-x-5">
                          <div
                            className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-1 text-white cursor-pointer transition duration-300"
                            onClick={() => handleEditClick(item)}
                          >
                            <FaRegEdit size={20} />
                          </div>

                          <div
                            className="bg-red-500 hover:bg-red-600 p-2 rounded-1 text-white cursor-pointer transition duration-300"
                            onClick={() => handleDelete(item)}
                          >
                            <RiDeleteBinLine size={20} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
         {totalPages > 1 && (
  <div className="flex justify-center items-center mt-6 space-x-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
    >
      <AiOutlineArrowLeft size={20} />
    </button>
    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 rounded ${
          currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        {i + 1}
      </button>
    ))}
    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
    >
      <AiOutlineArrowRight size={20} />
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
