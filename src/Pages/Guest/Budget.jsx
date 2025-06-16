import { BudgetAPI } from "../../assets/services/budgetAPI"
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { useState, useEffect } from "react"
import Swal from "sweetalert2";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Budget() {
  const [budgetData, setBudgetData] = useState([]);

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
      const result = await transaksiAPI.getAll();
      setTransaksiData(result);
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

    // Refresh data
    const response = await BudgetAPI.getAllByUser(userId);
    setBudgetData(response);

    // Reset form
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
  { name: "Total Budget", value: totalAnggaran },
  { name: "Terpakai", value: totalKeluar },
];

const COLORS = ["#34d399", "#f87171"]; 


  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full w-full mt-[-15px]">
     <div className="bg-blue-500 shadow-md border-r border-gray-300 rounded-r-3xl lg:w-1/2 h-auto p-6 w-full max-w-[600px] z-10 flex flex-col items-center justify-center">
      <h3 className="text-white text-xl font-semibold mb-4">Grafik Budget</h3>
      <PieChart width={320} height={280}>
        <Pie
          data={dataDonat}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {dataDonat.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
      <p className="text-white mt-2">
        Sisa Budget Anda : Rp. {sisaAnggaran.toLocaleString("id-ID")}
      </p>
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
              <h3 className="font-bold text-lg">Tambah Budget</h3>

              <div className="form-control mb-4">
                <label className="label">Jenis Kebutuhan</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.jenis_kebutuhan}
                  onChange={(e) => setFormData({ ...formData, jenis_kebutuhan: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">Anggaran (Rp)</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={formData.anggaran}
                  onChange={(e) => setFormData({ ...formData, anggaran: e.target.value })}
                />
              </div>

              <div className="modal-action flex justify-end gap-2">
                <form method="dialog">
                  <button className="btn btn-outline">Tutup</button>
                </form>
                <button className="btn btn-primary" onClick={handleTambahBudget}>
                  Simpan
                </button>
              </div>
            </div>
          </dialog>

      </div>

        {budgetData.length === 0 ? (
          <p className="text-gray-600">Tidak ada data budget.</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 ml-10">
             {budgetData.map((item) => {
                const totalKeluar = hitungTotalKeluarByBudget(item.id);
                const sisaAnggaran = item.anggaran - totalKeluar;

                return (
                  <div key={item.id} className="bg-white shadow-md rounded-xl p-4 border border-gray-200 flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{item.jenis_kebutuhan}</h3>
                      <p className="text-sm text-gray-500">
                        Anggaran: Rp. {item.anggaran.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className={`text-right font-semibold ${sisaAnggaran < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                      <p className="text-sm">Sisa</p>
                      <p className="text-base">
                        Rp. {sisaAnggaran.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
