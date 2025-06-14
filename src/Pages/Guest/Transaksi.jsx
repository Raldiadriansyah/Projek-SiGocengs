import { AiOutlineArrowUp } from "react-icons/ai"; 
import { AiOutlineArrowDown } from "react-icons/ai"; 
import { useEffect, useState } from "react";
import { transaksiAPI } from "../../assets/services/transaksiAPI";
import { saldoAPI } from "../../assets/services/saldoAPI";
export default function Transaksi(){
    const [data, setData] = useState([]);
    const [newTransaksi, setNewTransaksi] = useState({
    saldo_id: "",
    jenis_transaksi: "masuk",
    jumlah: 0,
    });

    useEffect(() => {
    const fetchData = async () => {
        const result = await transaksiAPI.getAll();

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const filtered = result.filter(item => {
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
    const stored = localStorage.getItem("dataSaldo");
    if (stored) {
        setDataSaldo(JSON.parse(stored));
    }
    }, []);

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

                 <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>Tambah Transaksi</button>
               <dialog id="my_modal_1" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Tambah Transaksi</h3>

                        <label className="block mb-2">Pilih Sumber</label>
                        <select
                        className="select select-bordered w-full mb-4"
                        value={newTransaksi.saldo_id}
                        onChange={(e) => setNewTransaksi({ ...newTransaksi, saldo_id: parseInt(e.target.value) })}
                        >
                        <option value="">-- Pilih Sumber --</option>
                        {dataSaldo.map((s) => (
                            <option key={s.id} value={s.id}>{s.sumber}</option>
                        ))}
                        </select>

                        <label className="block mb-2">Jenis Transaksi</label>
                        <select
                        className="select select-bordered w-full mb-4"
                        value={newTransaksi.jenis_transaksi}
                        onChange={(e) =>
                        setNewTransaksi({
                            ...newTransaksi,
                            jenis_transaksi: e.target.value,
                        })
                        }

                        >
                        <option value="masuk">Masuk</option>
                        <option value="keluar">Keluar</option>
                        </select>

                        <label className="block mb-2">Jumlah</label>
                        <input
                        type="number"
                        className="input input-bordered w-full mb-4"
                        value={newTransaksi.jumlah}
                        onChange={(e) => setNewTransaksi({ ...newTransaksi, jumlah: parseInt(e.target.value) })}
                        />

                        <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn">Close</button>
                           <button
                                type="button"
                                className="btn btn-primary"
                                onClick={async () => {
                                    try {
                                    const userId = localStorage.getItem("userID");
                                   if (!userId || !newTransaksi.saldo_id || newTransaksi.jumlah <= 0) {
                                    alert("Lengkapi data terlebih dahulu!");
                                    return;
                                    }

                                    // 1. Tambah transaksi
                                    await transaksiAPI.createTransaksi({
                                        saldo_id: newTransaksi.saldo_id,
                                        jenis_transaksi: newTransaksi.jenis_transaksi,
                                        jumlah: newTransaksi.jumlah,
                                        created_at: new Date().toISOString(),
                                    });

                                    // 2. Cari saldo dan update nilainya
                                    const saldoItem = dataSaldo.find(s => s.id === newTransaksi.saldo_id);
                                    if (!saldoItem) {
                                        alert("Saldo tidak ditemukan");
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

                                    // 3. Reset form dan reload
                                    setNewTransaksi({
                                        saldo_id: "",
                                        jenis_transaksi: "masuk",
                                        jumlah: 0,
                                    });

                                    document.getElementById("my_modal_1").close(); // tutup modal
                                    window.location.reload(); // atau kamu bisa panggil fetchData()

                                    } catch (error) {
                                    console.error("Gagal menyimpan transaksi:", error);
                                    alert("Terjadi kesalahan saat menyimpan transaksi.");
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
                        <th className="px-4 py-2 border-b">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => {
                            const sumber = dataSaldo.find(s => s.id === item.saldo_id)?.sumber || "Tidak Diketahui";

                            return (
                                <tr key={item.id}>
                                <td className="px-4 py-2 border-b">{index + 1}</td>
                                <td className="px-4 py-2 border-b">
                                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                                </td>
                                <td className="px-4 py-2 border-b">{sumber}</td>
                                <td className="px-4 py-2 border-b capitalize">{item.jenis_transaksi}</td>
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