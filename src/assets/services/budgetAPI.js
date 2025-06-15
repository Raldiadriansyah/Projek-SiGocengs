import axios from "axios";

const API_URL = "https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelBudget"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZnd6eG9jcmd5eGRnZm5jZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk0NTIsImV4cCI6MjA2NTIwNTQ1Mn0.9ArDHoEfESVxGTbDuuZSW7-gJzQ5601Xo_XD-5_SuJI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const BudgetAPI = {
    async getAll() {
    const response = await axios.get(API_URL, { headers });
    return response.data;
    },
    
    create: async (data) => {
    try {
      const response = await axios.post(API_URL, data, { headers });
      return response.data;
    } catch (error) {
      console.error("Gagal membuat budget:", error);
      throw error;
    }
  },

    getAllByUser: async (userId) => {
    try {
      const response = await axios.get("https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelBudget", {
        headers,
        params: {
          select: "*",
          user_id: `eq.${userId}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Gagal mengambil budget:", error);
      return [];
    }
  },
 

}