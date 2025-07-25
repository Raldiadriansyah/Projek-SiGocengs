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

    // Ambil semua saldo milik user
    const saldoResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/Tabelsaldo", {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        select: "id",
        user_id: `eq.${userId}`,
      },
    });

    const saldoIds = saldoResponse.data.map((s) => s.id);
    if (saldoIds.length === 0) return [];

    // Buat filter saldo_id secara or
    const orFilter = saldoIds.map(id => `saldo_id.eq.${id}`).join(",");

    // Ambil transaksi berdasarkan saldo_id milik user
    const response = await axios.get(API_URL, {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        select: `
          *,
          saldo (
            id,
            sumber_id,
            sumber (
              id,
              nama_sumber
            )
          ),
          kebutuhan (
            id,
            jenis_kebutuhan
          )
        `,
        or: `(${orFilter})`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
    return [];
  }
},


  getTransaksi: async () => {
  try {
    const userId = localStorage.getItem("userID");
    if (!userId) throw new Error("User belum login");

    // Ambil saldo milik user
    const saldoResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/Tabelsaldo", {
      headers,
      params: {
        select: "id",
        user_id: `eq.${userId}`,
      },
    });

    const saldoIds = saldoResponse.data.map(s => s.id);
    if (saldoIds.length === 0) return [];

    // Buat filter saldo_id
    const orFilter = saldoIds.map(id => `saldo_id.eq.${id}`).join(",");

    // Ambil transaksi + relasi ke TabelBudget (melalui foreign key `kebutuhan`)
    const response = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelTransaksi", {
      headers,
      params: {
        select: "*, kebutuhan: TabelBudget(id, jenis_kebutuhan)", // JOIN ke TabelBudget
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
    console.log("Data yang dikirim:", data);
    const response = await axios.post(API_URL, data, { headers }); 
  } catch (error) {
    console.error("Gagal membuat transaksi:", error.response?.data || error.message);
    throw error;
  }
},

deleteTransaksi: async (id) => {
  return await axios.delete(`${API_URL}?id=eq.${id}`, {
    headers: {
      apikey: API_KEY,
      Authorization: `Bearer ${API_KEY}`,
    },
  });
},
updateTransaksi: async (id, data) => {
  return await axios.patch(`${API_URL}?id=eq.${id}`, data, { headers });
},
fetchAllTransaksi: async () => {
    const response = await axios.get(API_URL, { headers });
    return response.data;
  },
   deleteBySaldoId: async (saldoId) => {
    const res = await axios.delete(`${API_URL}?saldo_id=eq.${saldoId}`, { headers });
    return res.data;
  },

getAll2: async () => {
  try {
    const userId = localStorage.getItem("userID");
    if (!userId) throw new Error("User belum login");

    // Ambil saldo_id milik user
    const saldoResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/Tabelsaldo", {
      headers,
      params: {
        select: "id",
        user_id: `eq.${userId}`,
      },
    });

    const saldoIds = saldoResponse.data.map((s) => s.id);
    if (saldoIds.length === 0) return { masukData: [], keluarData: [] };

    // Filter transaksi berdasarkan saldo_id
    const orFilter = saldoIds.map(id => `saldo_id.eq.${id}`).join(",");

    const transaksiResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelTransaksi", {
      headers,
      params: {
        select: "id, jenis_transaksi, saldo_id, created_at",
        or: `(${orFilter})`,
      },
    });

    const transaksi = transaksiResponse.data;

    // Bagi data masuk dan keluar
    const masukData = transaksi.filter((t) => t.jenis_transaksi === "masuk");
    const keluarData = transaksi.filter((t) => t.jenis_transaksi === "keluar");

    return { masukData, keluarData };
  } catch (error) {
    console.error("Gagal mengambil transaksi:", error?.response?.data || error.message);
    return { masukData: [], keluarData: [] };
  }
},


getRekapBulanan: async (userId) => {
  try {
    // 1. Ambil semua saldo milik user
    const saldoResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/Tabelsaldo", {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        select: "id",
        user_id: `eq.${userId}`,
      },
    });

    const saldoIds = saldoResponse.data.map(s => s.id);
    if (saldoIds.length === 0) return [];

    // 2. Buat filter saldo_id
    const orFilter = saldoIds.map(id => `saldo_id.eq.${id}`).join(",");

    // 3. Ambil transaksi berdasarkan saldo_id milik user
    const transaksiResponse = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelTransaksi", {
      headers: {
        apikey: API_KEY,
        Authorization: `Bearer ${API_KEY}`,
      },
      params: {
        select: "jenis_transaksi,jumlah,created_at,saldo_id",
        or: `(${orFilter})`,
      },
    });

    const data = transaksiResponse.data;

    // 4. Konversi dan agregasi per bulan
    const rekap = {};

    data.forEach((t) => {
      const date = new Date(t.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; // contoh: "2025-07"
      const label = date.toLocaleString("id-ID", { month: "short", year: "numeric" }); // contoh: "Jul 2025"

      if (!rekap[key]) {
        rekap[key] = { bulan: label, masuk: 0, keluar: 0 };
      }

      const jumlah = parseFloat(t.jumlah) || 0;
      if (t.jenis_transaksi === "masuk") {
        rekap[key].masuk += jumlah;
      } else if (t.jenis_transaksi === "keluar") {
        rekap[key].keluar += jumlah;
      }
    });

    // 5. Return hasil dalam array terurut berdasarkan kunci YYYY-MM
    return Object.entries(rekap)
      .sort(([a], [b]) => new Date(a + '-01') - new Date(b + '-01'))
      .map(([_, value]) => value);
      
  } catch (error) {
    console.error("Gagal mengambil rekap bulanan:", error.response?.data || error.message);
    return [];
  }
}



}