import { saldoAPI } from "../../assets/services/saldoAPI";
import { useState, useEffect } from "react";
export default function Saldo() {
 const [dataSaldo, setDataSaldo] = useState([]);

  useEffect(() => {
    const getSaldo = async () => {
      try {
      const userId = localStorage.getItem("userID"); 
        if (!userId) return;

        const data = await saldoAPI.fetchSaldoByUser(userId);
        localStorage.setItem("dataSaldo", JSON.stringify(data));
        setDataSaldo(data);
      } catch (err) {
        console.error("Gagal mengambil data saldo:", err.message);
      }
    };

    getSaldo();
  }, []);
  return (
    <div className="relative bg-blue-500 shadow-md border-b border-gray-300 w-full rounded-b-3xl h-[300px] mt-[-15px]">
      <div className="font-poppins text-white text-center pt-8">
        <div className="text-[24px] font-semibold">Total Saldo</div>
        <div className="text-[48px] font-extrabold mt-1">Rp 1.000.000.000</div>
      </div>

      <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[90%] bg-blue-50 rounded-xl shadow-lg h-[180px] z-10">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-30 mt-5">
               {dataSaldo.map((item, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow text-center">
                    <h3 className="text-blue-600 font-bold text-xl">{item.sumber}</h3>
                    <p className="text-gray-700 text-lg mt-2">Rp {item.saldo.toLocaleString()}</p>
                  </div>
                ))}
          </div> 
      </div>
    </div>
  );
}
