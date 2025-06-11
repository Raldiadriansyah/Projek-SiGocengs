import { useEffect, useState } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    setUserName(name || "User");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          Selamat Datang, {userName} 👋
        </h1>
        <p className="text-lg text-gray-700">Ajak bapak KW main bola ⚽</p>
      </div>
    </div>
  );
}