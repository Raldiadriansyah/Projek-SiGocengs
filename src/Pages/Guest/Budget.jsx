import { BudgetAPI } from "../../assets/services/budgetAPI"
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { FaRegEdit } from "react-icons/fa"; 
import { RiDeleteBinLine } from "react-icons/ri"; 
import { useState, useEffect } from "react"
import Swal from "sweetalert2";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Budget() {
  const [budgetData, setBudgetData] = useState([]);
  const [editData, setEditData] = useState(null);


  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          console.error("User belum login");
          return;
        }

        const response = await BudgetAPI.getAllByUser(userId);
        setBudgetData(response);
      } catch (error) {
        console.error("Gagal mengambil data budget:", error);
      }
    };

    fetchBudget();
  }, []);

const [transaksiData, setTransaksiData] = useState([]);

useEffect(() => {
  const fetchTransaksi = async () => {
    const result = await transaksiAPI.getTransaksi();

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const filtered = result.filter((item) => {
      const date = new Date(item.tanggal || item.created_at); 
      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    });

    setTransaksiData(filtered);
  };

  fetchTransaksi();
}, []);

  const hitungTotalKeluarByBudget = (budgetId) => {
  const transaksiKeluar = transaksiData.filter(
    (item) =>
      item.jenis_transaksi === "keluar" &&
      item.kebutuhan &&
      Number(item.kebutuhan.id) === Number(budgetId)
  );

  return transaksiKeluar.reduce((acc, curr) => acc + curr.jumlah, 0);
  };

  const [formData, setFormData] = useState({
    jenis_kebutuhan: "",
    anggaran: "",
  });

  const handleTambahBudget = async () => {
    const userId = localStorage.getItem("userID");

    if (!userId) {
      Swal.fire("Gagal", "User belum login", "error");
      return;
    }

    try {
      const dataBaru = {
        ...formData,
        anggaran: parseFloat(formData.anggaran),
        user_id: userId,
      };

      await BudgetAPI.create(dataBaru);

      const response = await BudgetAPI.getAllByUser(userId);
      setBudgetData(response);

      setFormData({ jenis_kebutuhan: "", anggaran: "" });

      document.getElementById("my_modal_1").close(); 
      Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data berhasil disimpan!",
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      window.location.reload();
    });
    } catch (error) {
      Swal.fire("Gagal", "Gagal menambahkan budget", "error");
      console.error("Gagal menambah budget:", error);
    }
  };
  const totalAnggaran = budgetData.reduce((sum, item) => sum + item.anggaran, 0);
  const totalKeluar = budgetData.reduce((sum, item) => {
    const keluar = hitungTotalKeluarByBudget(item.id);
    return sum + keluar;
  }, 0);

  const sisaAnggaran = totalAnggaran - totalKeluar;

  const dataDonat = [
    { name: "Sisa", value: sisaAnggaran },
    { name: "Terpakai", value: totalKeluar },
  ];

  const COLORS = ["#4ade80", "#f87171"];

 const handleDeleteKebutuhan = async (id) => {
  const confirm = await Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data kebutuhan ini akan dihapus secara permanen.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (confirm.isConfirmed) {
    try {
      await BudgetAPI.deleteBudget(id); 
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Budget berhasil dihapus",
        timer: 2000,
        showConfirmButton: false,
      });

      const userId = localStorage.getItem("userID");
      const refreshed = await BudgetAPI.getAllByUser(userId);
      setBudgetData(refreshed);
    } catch (error) {
      console.error("Gagal hapus Budget:", error);
      Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
    }
  }
};

  const handleEditClick = (item) => {
    setEditData({ ...item });
    document.getElementById("edit_modal_budget").showModal();
  };

  const handleSimpanEditBudget = async () => {
    try {
      await BudgetAPI.updateBudget(editData.id, {
        jenis_kebutuhan: editData.jenis_kebutuhan,
        anggaran: parseFloat(editData.anggaran),
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil diperbarui!",
        timer: 2000,
        showConfirmButton: false,
      });

      document.getElementById("edit_modal_budget").close();

      // Refresh data
      const userId = localStorage.getItem("userID");
      const refreshed = await BudgetAPI.getAllByUser(userId);
      setBudgetData(refreshed);
    } catch (error) {
      console.error("Gagal update budget:", error);
      Swal.fire("Gagal", "Gagal menyimpan perubahan", "error");
    }
  };




  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full mt-[-15px]">
     <div className="bg-blue-500 shadow-md border-r border-gray-300 rounded-r-3xl lg:w-1/2 h-auto p-6 w-full max-w-[600px] z-10 flex flex-col items-center justify-center">
      <h3 className="text-white text-[28px] font-semibold mb-4">Grafik Budget</h3>
      <p className="text-white mt-2 text-[20px]">
        Total Budget Anda : Rp. {totalAnggaran.toLocaleString("id-ID")}
      </p>
      <PieChart width={500} height={480}>
        <Pie
          data={dataDonat}
          cx="50%"
          cy="50%"
          outerRadius={150}
          fill="#8884d8"
          paddingAngle={2}
          dataKey="value"
          label={({ name, value, x, y, fill }) => (
          <text
            x={x}
            y={y}
            fill={fill}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={16}
          >
            {value.toLocaleString("id-ID")}
          </text>
        )}
        >
          {dataDonat.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `Rp. ${value.toLocaleString("id-ID")}`} />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>

    </div>


     <div className="bg-blue-50 rounded-r-xl shadow-lg h-auto flex-1 p-6 ml-[-50px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-700 ml-10">Daftar Budget</h2>
        <button
        className="btn mr-4 bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition duration-300"
        onClick={() => document.getElementById('my_modal_1').showModal()}
      >
        Tambah Budget
      </button>

          <dialog id="my_modal_1" className="modal">
            <div className="modal-box">
              <h3 className="font-bold text-lg mb-5">Tambah Budget</h3>

              <div className="form-control mb-4">
                <label className="label">Jenis Kebutuhan</label>
                <input
                  type="text"
                  className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.jenis_kebutuhan}
                  onChange={(e) => setFormData({ ...formData, jenis_kebutuhan: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">Anggaran (Rp)</label>
                <input
                  type="number"
                  className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={formData.anggaran}
                  onChange={(e) => setFormData({ ...formData, anggaran: e.target.value })}
                />
              </div>

              <div className="modal-action flex justify-end gap-2">
                <form method="dialog">
                  <button className="btn ">Tutup</button>
                </form>
                <button className="btn btn-primary" onClick={handleTambahBudget}>
                  Simpan
                </button>
              </div>
            </div>
          </dialog>

      </div>

        {budgetData.length === 0 ? (
        <p className="text-gray-600 ml-20">Tidak ada data budget.</p>
          ) : (
            <div className="ml-10">
              <div className="max-h-[720px] overflow-y-auto pr-2 space-y-6">
               {[...budgetData]
              .sort((a, b) => b.anggaran - a.anggaran)
              .map((item) => {
                  const totalKeluar = hitungTotalKeluarByBudget(item.id);
                  const sisaAnggaran = item.anggaran - totalKeluar;

                  return (
                    <div
                      key={item.id}
                      className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex items-center justify-between"
                    >
                     
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{item.jenis_kebutuhan}</h3>
                        <p className="text-sm text-gray-500">
                          Anggaran: Rp. {item.anggaran.toLocaleString("id-ID")}
                        </p>
                      </div>

                     
                      <div className="flex flex-col items-end mr-4">
                        <p className="text-sm font-semibold">Sisa</p>
                        <p
                          className={`text-base font-semibold ${
                            sisaAnggaran < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          Rp. {sisaAnggaran.toLocaleString("id-ID")}
                        </p>
                      </div>

                      
                      <div className="h-12 border-l-4 border-blue-500 mx-4" />

                   
                      <div className="flex space-x-4">
                        <div className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded text-white cursor-pointer transition duration-300"
                        onClick={() => handleEditClick(item)}>
                          <FaRegEdit size={20} />
                        </div>

                        <div className="bg-red-500 hover:bg-red-600 p-2 rounded text-white cursor-pointer transition duration-300"
                        onClick={() => handleDeleteKebutuhan(item.id)}>
                          <RiDeleteBinLine size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

      </div>
      <dialog id="edit_modal_budget" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Edit Kebutuhan</h3>

          {editData && (
            <>
              <label className="block mb-2">Jenis Kebutuhan</label>
              <input
                type="text"
                className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={editData.jenis_kebutuhan}
                onChange={(e) =>
                  setEditData({ ...editData, jenis_kebutuhan: e.target.value })
                }
              />

              <label className="block mb-2 mt-4">Anggaran</label>
              <input
                type="number"
                className="input border-blue-400 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition "
                value={editData.anggaran}
                onChange={(e) =>
                  setEditData({ ...editData, anggaran: parseFloat(e.target.value) })
                }
              />

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn">Tutup</button>
                </form>
                <button className="btn btn-primary" onClick={handleSimpanEditBudget}>
                  Simpan Perubahan
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>

    </div>
  );
}
