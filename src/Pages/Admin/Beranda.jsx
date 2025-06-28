import { AiFillBank } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa";
import { MdReviews } from "react-icons/md";
import { CgUserList } from "react-icons/cg";
import { useState, useEffect } from "react";
import { sumberAPI } from "../../assets/services/sumberAPI";
import { userAPI } from "../../assets/services/userAPI";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
import { FAQAPI } from "../../assets/services/FAQAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";
import { PieChart, Pie, Cell as PieCell } from "recharts";

export default function Beranda() {
  const [jumlahSumber, setJumlahSumber] = useState(0);
  const [jumlahUser, setJumlahUser] = useState(0);
  const [jumlahFAQ, setJumlahFAQ] = useState(0);
  const [jumlahTestimoni, setJumlahTestimoni] = useState(0);
  const [jumlahBaru, setJumlahBaru] = useState(0);
  const [jumlahDitampilkan, setJumlahDitampilkan] = useState(0);
  const [jumlahDisembunyikan, setJumlahDisembunyikan] = useState(0);
  const [dataSumber, setDataSumber] = useState([]);
  const [jumlahFAQBaru, setJumlahFAQBaru] = useState(0);
  const [jumlahFAQDitampilkan, setJumlahFAQDitampilkan] = useState(0);
  const [jumlahFAQDisembunyikan, setJumlahFAQDisembunyikan] = useState(0);

  const dataBarFAQ = [
    { status: "Baru", value: jumlahFAQBaru },
    { status: "Ditampilkan", value: jumlahFAQDitampilkan },
    { status: "Disembunyikan", value: jumlahFAQDisembunyikan },
  ];
  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#6366F1",
    "#EC4899",
    "#F97316",
    "#22D3EE",
    "#14B8A6",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sumberList = await sumberAPI.fetchSumberList();
        setJumlahSumber(sumberList.length);
      } catch (error) {
        console.error("Gagal mengambil data sumber:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDataUser = async () => {
      try {
        const userList = await userAPI.fetchUser2();
        setJumlahUser(userList.length);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
      }
    };

    fetchDataUser();
  }, []);

  useEffect(() => {
    const fetchDataFAQ = async () => {
      try {
        const FAQList = await FAQAPI.fetchFAQ();
        setJumlahFAQ(FAQList.length);

        const baru = FAQList.filter((item) => item.status === "baru").length;
        const tampil = FAQList.filter(
          (item) => item.status === "ditampilkan"
        ).length;
        const sembunyi = FAQList.filter(
          (item) => item.status === "disembunyikan"
        ).length;

        setJumlahFAQBaru(baru);
        setJumlahFAQDitampilkan(tampil);
        setJumlahFAQDisembunyikan(sembunyi);
      } catch (error) {
        console.error("Gagal mengambil data FAQ:", error);
      }
    };

    fetchDataFAQ();
  }, []);

  useEffect(() => {
    const fetchTestimoniData = async () => {
      try {
        const data = await testimoniAPI.fetchTestimoni();
        setJumlahTestimoni(data.length);

        const baru = data.filter((item) => item.status === "baru").length;
        const tampil = data.filter(
          (item) => item.status === "ditampilkan"
        ).length;
        const sembunyi = data.filter(
          (item) => item.status === "disembunyikan"
        ).length;

        setJumlahBaru(baru);
        setJumlahDitampilkan(tampil);
        setJumlahDisembunyikan(sembunyi);
      } catch (error) {
        console.error("Gagal mengambil data testimoni:", error);
      }
    };

    fetchTestimoniData();
  }, []);

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
          nama_sumber: sumber.nama_sumber,
          jumlah: sumberCount[sumber.id] || 0,
        }));

        sumberWithUsage.sort((a, b) => b.jumlah - a.jumlah);

        setDataSumber(sumberWithUsage);
      } catch (err) {
        console.error("Gagal mengambil data:", err.message);
      }
    };

    getSumberWithUsage();
  }, []);

  const dataPieTestimoni = [
    { name: "Baru", value: jumlahBaru },
    { name: "Ditampilkan", value: jumlahDitampilkan },
    { name: "Disembunyikan", value: jumlahDisembunyikan },
  ];

  const pieColors = ["#F59E0B", "#10B981", "#EF4444"];

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[500px] mt-[-15px] p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[18px]  mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <AiFillBank size={60} className="min-w-[30px] text-yellow-400" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Sumber Dana Aktif</p>
            <p className="text-blue-500 font-bold text-[22px] text-left">
              {jumlahSumber}
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <CgUserList size={60} className="min-w-[30px] text-green-500" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">Pengguna Aktif</p>
            <p className="text-green-500 font-bold text-[22px] text-left">
              {jumlahUser}
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <MdReviews size={60} className="min-w-[30px] text-purple-400" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">
              Total Testimoni Pengguna
            </p>
            <p className="text-purple-500 font-bold text-[22px] text-left">
              {jumlahTestimoni}
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex items-center">
          <FaQuestion size={60} className="min-w-[30px] text-blue-400" />
          <div className="ml-8">
            <p className="text-gray-700 font-semibold">FAQ -Pertanyaan Umum</p>
            <p className="text-blue-400 font-bold text-[22px] text-left">
              {jumlahFAQ}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        <div className="bg-white rounded-xl shadow p-6 w-full lg:w-3/4 h-[670px] flex flex-col justify-between">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Grafik Penggunaan Sumber Dana
          </h2>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dataSumber}
                margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="nama_sumber"
                  interval={0}
                  tick={{ fontSize: 14 }}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="jumlah">
                  {dataSumber.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          {/* Pie Testimoni */}
          <div className="bg-white rounded-xl shadow p-6 w-full">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Kelola Testimoni
            </h2>
            <ResponsiveContainer width="80%" height={200}>
              <PieChart>
                <Pie
                  data={dataPieTestimoni}
                  cx="60%"
                  cy="50%"
                  outerRadius={80}               
                  label
                >
                  {dataPieTestimoni.map((entry, index) => (
                   <Cell
                      key={`faq-slice-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend Testimoni */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm" />
                <span>Baru</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm" />
                <span>Ditampilkan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                <span>Disembunyikan</span>
              </div>
            </div>
          </div>

          {/* Pie FAQ */}
          <div className="bg-white rounded-xl shadow p-6 w-full">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Status FAQ</h2>
            <ResponsiveContainer width="80%" height={200}>
              <PieChart>
                <Pie
                  data={dataBarFAQ}
                  cx="60%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  nameKey="status"
                  label
                >
                  {dataBarFAQ.map((entry, index) => (
                    <Cell
                      key={`faq-slice-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend FAQ */}
            <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-sm" />
                <span>Baru</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-sm" />
                <span>Ditampilkan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-sm" />
                <span>Disembunyikan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
