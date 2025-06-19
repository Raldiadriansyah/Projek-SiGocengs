import { AiOutlineArrowUp } from "react-icons/ai"; 
import { AiOutlineArrowDown } from "react-icons/ai"; 
import { useEffect, useState } from "react";
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
import { BudgetAPI } from "../../assets/services/budgetAPI";
import { sumberAPI } from "../../assets/services/sumberAPI";
import Swal from "sweetalert2";
export default function Transaksi(){
    const [data, setData] = useState([]);
    const [dataSumber, setDataSumber] = useState([]);
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
        const budgetList = await BudgetAPI.getAllByUser(localStorage.getItem("userID"));

        // Gabungkan data relasi manual
        const enriched = result.map((item) => {
        const saldo = saldoList.find((s) => s.id === item.saldo_id);
        const kebutuhan = budgetList.find((b) => b.id === item.kebutuhan);
        return { ...item, saldo, kebutuhan };
        });

        const filtered = enriched.filter((item) => {
        const date = new Date(item.created_at);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
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

    const [dataSaldo, setDataSaldo] = useState([]);

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




    return(
         <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[300px] mt-[-15px]">
            <div className="flex justify-center font-poppins text-center pt-8 space-x-90 ">
                <div className="text-[36px] font-semibold text-white leading-tight">
                    <h1 className="flex items-center gap-2 justify-center ml-4">
                        Masuk <AiOutlineArrowDown  className="text-green-300"/>
                    </h1>
                     <p>Rp. {totalMasuk.toLocaleString("id-ID")}</p>
                    </div>  
                <div className="border-l-4 border-white h-30 my-auto"></div>                           
                <div className="text-[36px] font-semibold text-white leading-tight">
                    <h1 className="flex items-center gap-2 justify-center ml-4">
                        Keluar <AiOutlineArrowUp className="text-red-500"/>
                    </h1>
                    <p>Rp. {totalKeluar.toLocaleString("id-ID")}</p>
                    </div>
            </div>
             <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[680px] z-10">

                 <button className="btn bg-blue-400 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded transition duration-300 ml-10 mt-5" onClick={()=>document.getElementById('my_modal_1').showModal()}>Tambah Transaksi</button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Tambah Transaksi</h3>

                    {/* Pilih Sumber */}
                    <label className="block mb-2">Pilih Sumber</label>             
                    <select
                    className="select select-bordered w-full mb-4"
                    value={newTransaksi.saldo_id}
                    onChange={(e) =>
                        setNewTransaksi({ ...newTransaksi, saldo_id: parseInt(e.target.value) })
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
                    <label className="block mb-2">Jenis Transaksi</label>
                    <select
                    className="select select-bordered w-full mb-4"
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
                    <label className="block mb-2">Jumlah</label>
                    <input
                    type="number"
                    className="input input-bordered w-full mb-4"
                    value={newTransaksi.jumlah}
                    onChange={(e) =>
                        setNewTransaksi({
                        ...newTransaksi,
                        jumlah: parseInt(e.target.value),
                        })
                    }
                    />

                    {/* Pilih Kebutuhan */}
                <select
                className="select select-bordered w-full mb-4"
                value={newTransaksi.kebutuhan || ""}
                onChange={(e) =>
                    setNewTransaksi({ ...newTransaksi, kebutuhan: parseInt(e.target.value) })
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
        <button className="btn">Close</button>
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
                        (newTransaksi.jenis_transaksi === "keluar" && !newTransaksi.kebutuhan)
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
                        kebutuhan: newTransaksi.jenis_transaksi === "masuk" ? null : newTransaksi.kebutuhan,
                        created_at: new Date().toISOString(),
                        });
        
                        const saldoItem = await saldoAPI.fetchSaldoByUser(localStorage.getItem("userID"))
                         .then((list) => list.find((s) => s.id === newTransaksi.saldo_id));

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



               <div className="overflow-auto w-full px-4 mt-6">
                    <table className="min-w-[400px] w-full border border-gray-300 text-left text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                        <th className="px-4 py-2 border-b">No</th>
                        <th className="px-4 py-2 border-b">Tanggal</th>
                        <th className="px-4 py-2 border-b">Sumber</th>
                        <th className="px-4 py-2 border-b">Transaksi</th>
                        <th className="px-4 py-2 border-b">Kebutuhan</th>
                        <th className="px-4 py-2 border-b">Jumlah</th>
                        <th className="px-4 py-2 border-b">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const sumber = dataSaldo.find(s => s.id === item.saldo_id)?.sumber || "Tidak Diketahui";
                            const kebutuhan = item.kebutuhan?.jenis_kebutuhan || "-";
                            const saldoItem = dataSaldo.find(s => s.id === item.saldo_id);
                            const sumberId = saldoItem?.sumber_id;
                            const sumberNama = dataSumber.find(s => s.id === sumberId)?.nama_sumber || "Tidak Diketahui";

                            return (
                                <tr key={item.id}>
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">
                                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-2 border-b">{sumberNama}</td>
                                <td className="px-4 py-2 border-b capitalize">{item.jenis_transaksi}</td>
                                <td className="px-4 py-2 border-b capitalize">{kebutuhan}</td>
                                <td className="px-4 py-2 border-b">Rp. {item.jumlah.toLocaleString("id-ID")}</td>
                                </tr>
                            );
                            })}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    )
}