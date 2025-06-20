import axios from "axios";

const API_URL = "https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/Tabelsaldo"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZnd6eG9jcmd5eGRnZm5jZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk0NTIsImV4cCI6MjA2NTIwNTQ1Mn0.9ArDHoEfESVxGTbDuuZSW7-gJzQ5601Xo_XD-5_SuJI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const saldoAPI = {
    async fetchSaldoByUser(userId) {
    const response = await axios.get(`${API_URL}?user_id=eq.${userId}`, { headers });
    return response.data;
    }
    ,
    async createSaldo(data) {
        return await axios.post(API_URL, data, { headers });
    },

    deleteSaldo: async (id) => {
    const response = await axios.delete(`${API_URL}?id=eq.${id}`, {
        headers,
    });
    return response.data;
    },

   updateSaldo: async (id, updatedData) => {
    return await axios.patch(`${API_URL}?id=eq.${id}`, updatedData, {
        headers,
    });
    },  

    fetchAllSaldo: async () => {
    const response = await axios.get(API_URL, { headers });
    return response.data;
    },
    deleteByUserId: async (userId) => {
    const res = await axios.delete(`${API_URL}?user_id=eq.${userId}`, { headers });
    return res.data;
  },
}