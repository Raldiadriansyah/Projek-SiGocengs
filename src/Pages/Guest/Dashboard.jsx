import { AiOutlineArrowUp } from "react-icons/ai";
import { AiOutlineArrowDown } from "react-icons/ai";
import { useEffect, useState } from "react";
import { BsCoin } from "react-icons/bs";
import { HiClipboardList } from "react-icons/hi";
import { BudgetAPI } from "../../assets/services/budgetAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { sumberAPI } from "../../assets/services/sumberAPI";
import { userAPI } from "../../assets/services/userAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jumlahSumber, setJumlahSumber] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);
  const [sumberData, setSumberData] = useState([]);
  const [trendData, setTrendData] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) {
        console.error("User belum login");
        return;
      }

      const [saldoUser, budgetData, transaksiCounts] = await Promise.all([
        saldoAPI.fetchSaldoByUser(userId),
        BudgetAPI.getAll(),
        transaksiAPI.getAll2(), 
      ]);

      const sumberUnik = [...new Set(saldoUser.map((s) => s.sumber_id))];
      setJumlahSumber(sumberUnik.length);

      const budgetUser = budgetData.filter(
        (b) => String(b.user_id) === userId
      );
      setTotalBudget(budgetUser.length);

 const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const isCurrentMonth = (createdAt) => {
  const date = new Date(createdAt);
  return (
    date.getMonth() === currentMonth &&
    date.getFullYear() === currentYear
  );
};

const totalMasuk = transaksiCounts.masukData.filter((t) =>
  isCurrentMonth(t.created_at)
).length;

const totalKeluar = transaksiCounts.keluarData.filter((t) =>
  isCurrentMonth(t.created_at)
).length;

setTotalMasuk(totalMasuk);
setTotalKeluar(totalKeluar);

    } catch (error) {
      console.error(
        "Gagal mengambil data dashboard:",
        error.response?.data || error.message || error
      );
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    const fetchSumberChart = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) return;

        const [saldoData, sumberList] = await Promise.all([
          saldoAPI.fetchSaldoByUser(userId),
          sumberAPI.getAll(),
        ]);

        const sumberGrouped = saldoData.reduce((acc, curr) => {
          const sumber = sumberList.find((s) => s.id === curr.sumber_id);
          const nama = sumber?.nama_sumber || "Lainnya";
          const jumlah = parseFloat(curr.saldo) || 0; 
          acc[nama] = (acc[nama] || 0) + jumlah;
          return acc;
        }, {});

        const chartData = Object.entries(sumberGrouped).map(([key, value]) => ({
          nama: key,
          jumlah: value,
        }));

        setSumberData(chartData);
      } catch (error) {
        console.error(
          "Gagal memuat data grafik sumber:",
          error.response?.data || error.message
        );
      }
    };

    fetchSumberChart();
  }, []);

 useEffect(() => {
  const fetchTrendData = async () => {
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) return;

      const trend = await transaksiAPI.getRekapBulanan(userId);

      // Ambil bulan & tahun saat ini
      const now = new Date();
      const currentMonth = now.toLocaleString("id-ID", { month: "short" });
      const currentYear = now.getFullYear();

      // Filter hanya data bulan sekarang
      const filteredTrend = trend.filter((item) =>
        item.bulan === `${currentMonth} ${currentYear}`
      );

      setTrendData(filteredTrend);
    } catch (error) {
      console.error("Gagal mengambil trend transaksi:", error.message);
    }
  };

  fetchTrendData();
}, []);


  const COLORS = [
    "#3B82F6", // biru
    "#10B981", // hijau
    "#F59E0B", // kuning
    "#EF4444", // merah
    "#8B5CF6", // ungu
    "#EC4899", // pink
    "#6366F1", // indigo
    "#14B8A6", // teal
  ];

  const formatNumber = (value) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[18px] mt-10 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <BsCoin size={60} className="text-yellow-600" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Sumber Dana Anda</p>
            <p className="text-yellow-500 font-bold text-lg">
              {jumlahSumber} sumber
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <HiClipboardList size={60} className="text-blue-600" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Daftar Budget Anda</p>
            <p className="text-blue-500 font-bold text-lg">
              {totalBudget} item
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <AiOutlineArrowDown size={60} className="text-green-600" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Transaksi Masuk / Bulan</p>
            <p className="text-green-500 font-bold text-lg">{totalMasuk}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <AiOutlineArrowUp size={60} className="text-red-600" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Transaksi Keluar / Bulan</p>
            <p className="text-red-500 font-bold text-lg">{totalKeluar}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Grafik Sumber Dana */}
        <div className="bg-white rounded-xl shadow p-6 w-full lg:basis-1/2 h-[600px]">
          <h2 className="text-xl font-bold text-gray-700 mb-10 mt-5">
            Grafik Sumber Dana & Saldo
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={sumberData}
              margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nama" />
              <YAxis tickFormatter={formatNumber} width={80} />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="jumlah">
                {sumberData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Grafik Tren Transaksi */}
        <div className="bg-white rounded-xl shadow p-6 w-full lg:basis-1/2 h-[600px]">
          <h2 className="text-xl font-bold text-gray-700 mb-10 mt-5">
            Total Transaksi Masuk & Keluar -- bulan ini 
          </h2>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart
              data={[
                {
                  jenis: "masuk",
                  jumlah: trendData.reduce((a, b) => a + (b.masuk || 0), 0),
                },
                {
                  jenis: "keluar",
                  jumlah: trendData.reduce((a, b) => a + (b.keluar || 0), 0),
                },
              ]}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={formatNumber} />
              <YAxis dataKey="jenis" type="category" />
              <Tooltip formatter={(value) => formatNumber(value)} />
              <Bar dataKey="jumlah" barSize={24}>
                <Cell fill="#10B981" />
                <Cell fill="#EF4444" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
