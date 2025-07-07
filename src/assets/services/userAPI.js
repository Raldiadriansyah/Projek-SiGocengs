import axios from "axios";

const API_URL = "https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelUser"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZnd6eG9jcmd5eGRnZm5jZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk0NTIsImV4cCI6MjA2NTIwNTQ1Mn0.9ArDHoEfESVxGTbDuuZSW7-gJzQ5601Xo_XD-5_SuJI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const userAPI = {
    async fetchUser(){
        const response = await axios.get(API_URL, {headers})
        return response.data
    },
    async createUser(data){
        const response = await axios.post(API_URL, data, {headers})
        return response.data
    },
    async fetchUser2() {
    const response = await axios.get(`${API_URL}?role=eq.user`, { headers });
    return response.data;
    },
    deleteUser: async (userId) => {
    return await axios.delete(`${API_URL}?id=eq.${userId}`, {
        headers,
    });
    },
    async checkEmail(email) {
    const response = await axios.get(`${API_URL}?email=eq.${email}`, { headers });
    const data = response.data;
    return { exists: data.length > 0 };
  },

  async updatePassword(email, newPassword) {
    const response = await axios.patch(
      `${API_URL}?email=eq.${email}`,
      { password: newPassword },
      { headers }
    );
    return { success: response.status === 204 }; 
  },
}