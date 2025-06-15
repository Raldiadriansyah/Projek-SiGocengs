import axios from "axios";

const API_URL = "https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelTransaksi"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZnd6eG9jcmd5eGRnZm5jZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk0NTIsImV4cCI6MjA2NTIwNTQ1Mn0.9ArDHoEfESVxGTbDuuZSW7-gJzQ5601Xo_XD-5_SuJI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const transaksiAPI = {
getAll: async () => {
  try {
    const userId = localStorage.getItem("userID");
    if (!userId) throw new Error("User belum login");

    const saldoResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelSaldo", {
      headers,
      params: {
        select: "id",
        user_id: `eq.${userId}`,
      },
    });

    const saldoIds = saldoResponse.data.map(s => s.id);

    if (saldoIds.length === 0) return []; // user tidak punya saldo = tidak ada transaksi

    // Ambil semua transaksi yang saldo_id-nya ada dalam daftar saldoIds
    const orFilter = saldoIds.map(id => `saldo_id.eq.${id}`).join(",");
    const response = await axios.get(API_URL, {
      headers,
      params: {
        select: "*",
        or: `(${orFilter})`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
    return [];
  }
},


  createTransaksi: async (data) => {
    try {
      const response = await axios.post(API_URL, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("Gagal membuat transaksi:", error);
      throw error;
    }
  },
}