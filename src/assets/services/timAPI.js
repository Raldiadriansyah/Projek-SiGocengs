import axios from "axios";

const API_URL = "https://usfwzxocrgyxdgfncgzp.supabase.co/rest/v1/TabelTim"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzZnd6eG9jcmd5eGRnZm5jZ3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2Mjk0NTIsImV4cCI6MjA2NTIwNTQ1Mn0.9ArDHoEfESVxGTbDuuZSW7-gJzQ5601Xo_XD-5_SuJI"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const timAPI = {
    async fetchTim(){
        const response = await axios.get(API_URL, {headers})
        return response.data
    }, 

   async updateTim(id, data) {
    const response = await axios.patch(`${API_URL}?id=eq.${id}`, data, {
      headers,
    });
    return response.data;
  },

}