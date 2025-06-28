import { BiTrash } from "react-icons/bi"; 
import { saldoAPI } from "../../assets/services/saldoAPI";
import { sumberAPI } from "../../assets/services/sumberAPI";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
export default function Saldo() {
 const [dataSaldo, setDataSaldo] = useState([]);
 const [totalSaldo, setTotalSaldo] = useState(0);
 const [selectedSourceId, setSelectedSourceId] = useState(null);
 const [selectedSourceName, setSelectedSourceName] = useState(""); 
 const [selectedSource, setSelectedSource] = useState("");
 const [saldo, setSaldo] = useState("");
 const [nominalBaru, setNominalBaru] = useState("");
 const [sumberList, setSumberList] = useState([]);

  useEffect(() => {
    const loadSumber = async () => {
      const result = await sumberAPI.fetchSumberList();
      setSumberList(result);
    };
    loadSumber();
  }, []);

  useEffect(() => {
  const fetchSaldoBySource = async () => {
    if (!selectedSource) return;

    try {
      const userId = localStorage.getItem("userID");
      const response = await saldoAPI.fetchSaldoByUser(userId);
      const selected = response.find((item) => item.sumber_id === selectedSource);
      if (selected) {
        setSaldo(selected.saldo);
      } else {
        setSaldo("0");
      }
    } catch (err) {
      console.error("Gagal ambil saldo:", err.message);
    }
  };

  fetchSaldoBySource();
}, [selectedSource]);

useEffect(() => {
  const getSaldo = async () => {
    try {
      const userId = localStorage.getItem("userID");
      if (!userId) return;

      const saldoData = await saldoAPI.fetchSaldoByUser(userId); 
      const sumberData = await sumberAPI.fetchSumberList();

      const combined = saldoData.map((item) => {
        const sumberMatch = sumberData.find((s) => s.id === item.sumber_id);
        return {
          ...item,
          nama_sumber: sumberMatch?.nama_sumber || "Tidak Diketahui",
          Gambar: sumberMatch?.Gambar || "",
        };
      });

      setDataSaldo(combined);

      const total = combined.reduce((acc, item) => acc + (item.saldo || 0), 0);
      setTotalSaldo(total);
    } catch (err) {
      console.error("Gagal mengambil data saldo:", err.message);
    }
  };

  getSaldo();
}, []);

  const handleDelete = (id) => {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data ini akan dihapus secara permanen!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await saldoAPI.deleteSaldo(id);
        Swal.fire("Terhapus!", "Data telah dihapus.", "success");
        window.location.reload(); 
      } catch (err) {
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus", "error");
      }
    }
  });
};

  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[300px] mt-[-15px]">
      <div className="font-poppins text-white text-center pt-8">
        <div className="text-[28px] font-semibold">Total Saldo</div>
        <div className="text-[48px] font-extrabold mt-1">Rp {totalSaldo.toLocaleString()}</div>
      </div>

      <div className="absolute top-[180px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[160px] z-10">
          <div
            className="grid gap-7 mx-auto justify-center mt-8"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`,
              maxWidth: `${Math.min(dataSaldo.length, 5) * 270}px`,
            }}
          >
            {dataSaldo.map((item, index) => (
            <div
              key={index}
              className="relative group bg-white p-4 rounded-lg shadow flex items-center gap-6 min-w-[230px] h-[100px]"
            >
              <img
                src={item.Gambar}
                alt={item.nama_sumber}
                className="w-14 h-14 object-contain"
              />
              <div>
                <h3 className="text-blue-600 font-bold text-[20px]">{item.nama_sumber}</h3>
                <p className="text-gray-700 text-[18px]">
                  Rp {item.saldo.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hidden group-hover:block"
                title="Hapus"
              >
                <BiTrash size={30} />
              </button>
            </div>
          ))}

          </div>
      </div>
     <div className="relative bg-white-500 shadow-md border-b border-gray-300 w-full rounded-3xl h-[600px] mt-[105px] items-center mx-auto">
            <div className="font-poppins text-blue-600 text-left pt-8">
              <div className="text-[28px] font-semibold mt-20 ml-10">Tambahkan Sumber Dana Anda </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const userId = localStorage.getItem("userID");

                if (!selectedSourceId || !nominalBaru || parseInt(nominalBaru) < 0) {
                  Swal.fire({
                    icon: "warning",
                    title: "Data tidak valid",
                    text: "Pilih sumber dan masukkan nominal yang benar!",
                  });
                  return;
                }

                const isDuplicate = dataSaldo.some(item => item.sumber_id === selectedSourceId);
                if (isDuplicate) {
                  Swal.fire({
                    icon: "info",
                    title: "Sumber Sudah Tersedia",
                    text: `Data untuk sumber ${selectedSourceName} sudah ada.`,
                  });
                  return;
                }


                    try {
                      const newEntry = {
                        user_id: userId,
                        sumber_id: selectedSourceId,
                        saldo: parseInt(nominalBaru),
                      };
                      await saldoAPI.createSaldo(newEntry);

                      Swal.fire({
                        icon: "success",
                        title: "Berhasil",
                        text: "Data berhasil disimpan!",
                        timer: 2000,
                        showConfirmButton: false,
                      }).then(() => {
                        window.location.reload(); 
                      });

                      setNominalBaru("");
                      setSelectedSource("");
                      setSaldo("");
                    } catch (err) {
                      console.error("Gagal menyimpan data:", err.message);
                      Swal.fire({
                        icon: "error",
                        title: "Gagal",
                        text: "Gagal menyimpan data!",
                      });
                    }
                  }}
                >
                    <p className="text-black ml-25 mt-6 text-[18px] font-semibold">Pilih Sumber Dana :</p>

                    <div
                      className="grid gap-6 mx-auto justify-center mt-8"
                      style={{
                        gridTemplateColumns: `repeat(auto-fit, minmax(160px, 1fr))`,
                        maxWidth: `${Math.min(sumberList.length, 5) * 240}px`, 
                      }}
                    >
                    { sumberList.map((item, index) => (
                      <label
                        key={index}
                        className={`cursor-pointer flex flex-col items-center border p-3 rounded-lg shadow-sm hover:shadow-md transition-all ${
                          selectedSourceId === item.id ? "border-blue-500 bg-blue-50" : "border-gray-200"
                        }`}
                        onClick={() => {
                          setSelectedSourceId(item.id);
                          setSelectedSourceName(item.nama_sumber);
                        }}
                      >
                        <input
                          type="radio"
                          name="sumber"
                          value={item.id}
                          className="hidden"
                          checked={selectedSourceId === item.id}
                          readOnly
                        />
                        <img
                          src={item.Gambar}
                          alt={item.nama_sumber}
                          className="w-16 h-16 object-contain mb-2"
                        />
                        <span className="text-[16px] font-medium text-black">{item.nama_sumber}</span>
                      </label>
                    ))}

                    </div>
                    <input type="hidden" name="sumber_id" value={selectedSourceId} />


                     <p className="text-black text-[18px] font-semibold mt-10 mb-2 ml-26">
                      Masukkan Nominal Saat Ini :
                      <input
                        type="number"
                        value={nominalBaru ?? ""} 
                        onChange={(e) => setNominalBaru(e.target.value ?? "")} 
                        className="border-2 border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition rounded px-4 py-2 w-[1000px] mb-4 ml-13 text-blue-500"
                      />
                    </p>
                    <br />
                   <div className="flex justify-center mt-2">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Simpan
                    </button>
                  </div>
                  </form>

            </div>
        </div>
    </div>
  );
}
