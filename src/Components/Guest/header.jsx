import { MdLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { AiOutlineMenu } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { testimoniAPI } from "../../assets/services/testimoniAPI";
export default function header({ toggleSidebar }) {
  const [showModal, setShowModal] = useState(false);
  const [testimoniInput, setTestimoniInput] = useState("");
  const [hasSubmittedTestimoni, setHasSubmittedTestimoni] = useState(false);
  const [userName, setUserName] = useState("");
  const [userMail, setUserMail] = useState("");
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];

  const pageNames = {
    Beranda: "Beranda",
    Saldo: "Saldo",
    Transaksi: "Transaksi",
    "Kelola-Budget": "Kelola Budget",
  };

  const pageTitle =
    pageNames[currentPath] ||
    currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const mail = localStorage.getItem("userMail");
    const id = localStorage.getItem("userID");

    setUserName(name || "User");
    setUserMail(mail || "Email");

    const checkExistingTestimoni = async () => {
      try {
        const allTestimoni = await testimoniAPI.fetchTestimoni();
        const sudahAda = allTestimoni.some(
          (item) => Number(item.user_id) === Number(id)
        );
        setHasSubmittedTestimoni(sudahAda);
      } catch (error) {
        console.error("Gagal memeriksa testimoni user:", error);
      }
    };

    if (id) checkExistingTestimoni();
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();

    navigate("/");
  };

  const handleSubmitTestimoni = async () => {
    const userID = localStorage.getItem("userID");
    const testimoniText = testimoniInput.trim();

    // Cek jumlah kata maksimal 20
    const wordCount = testimoniText.split(/\s+/).length;
    if (wordCount > 20) {
      Swal.fire({
        icon: "warning",
        title: "Terlalu Panjang",
        text: "Testimoni maksimal 20 kata.",
      });
      return;
    }

    try {
      await testimoniAPI.createTestimoni({
        user_id: Number(userID),
        testimoni: testimoniText,
        status: "baru",
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Testimoni berhasil dikirim",
        timer: 2000,
        showConfirmButton: false,
         }).then(() => {
            window.location.reload();
        })

      setTestimoniInput("");
      setShowModal(false);
    } catch (err) {
      console.error("Gagal kirim testimoni:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal mengirim",
        text: "Terjadi kesalahan saat menyimpan testimoni.",
      });
    }
  };

  return (
    <header className="bg-blue-50 shadow-md border-b border-gray-300 w-full ">
      <div className="flex  items-center px-10 py-3 text-sm text-gray-600  h-[100px]">
        <button onClick={toggleSidebar}>
          <AiOutlineMenu
            size={28}
            className="text-gray-600 hover:text-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"
          />
        </button>
        <h1 className="ml-20 font-poppins-extrabold font-[1000] text-[28px] text-blue-600">
          SiGocengs{" "}
        </h1>
        <div className="flex items-center ml-5 mt-2 space-x-2">
          <h1 className="text-[28px]">/</h1>
          <p className="text-xl font-bold whitespace-nowrap">{pageTitle}</p>
        </div>

        <div className="relative flex justify-end items-center w-full dropdown dropdown-bottom dropdown-end">
          {/* Nama Pengguna */}
          <div className="mr-3 text-right">
            <h1 className="font-poppins font-semibold text-[18px]">
              {userName}
            </h1>
          </div>
          <CgProfile
            size={32}
            tabIndex={0}
            role="button"
            className="text-gray-600 hover:text-blue-500 transition duration-300 cursor-pointer"
          />
          <div
            className={`dropdown-content bg-white rounded-xl shadow-lg w-full max-w-70 mt-2 p-4 z-50 ${
              showModal ? "hidden" : ""
            }`}
          >
            <div className="text-center border-b pb-3 text-[16px]">
              <p className="text-sm text-gray-500">Anda Login sebagai</p>
              <h1 className="text-base font-semibold">{userName}</h1>
              <h1 className="text-base font-semibold">{userMail}</h1>
            </div>
            <div className="mt-3">
              <button
                onClick={() => setShowModal(true)}
                disabled={hasSubmittedTestimoni}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-md transition duration-200 ${
                  hasSubmittedTestimoni
                    ? "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
                    : "text-blue-500 border-blue-300 hover:bg-blue-100"
                }`}
              >
                Beri Ulasan
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex mt-3 items-center justify-center gap-2 px-4 py-2 text-red-500 border border-red-300 rounded-md hover:bg-red-100 transition duration-200"
              >
                <MdLogout size={20} />
                Keluar
              </button>
            </div>
          </div>
          {showModal && (
            <div className="absolute mt-66 ml-20 right-4 w-80 z-50 bg-white border border-gray-300 rounded-xl shadow-xl p-5 animate-fade-in">
              <h3 className="font-bold text-lg mb-2">Tulis Testimoni</h3>
              <textarea
                value={testimoniInput}
                onChange={(e) => {
                  const words = e.target.value.trim().split(/\s+/);
                  if (words.length <= 20) {
                    setTestimoniInput(e.target.value);
                  }
                }}
                className="textarea textarea-bordered w-full mb-4"
                rows={4}
                placeholder="Tulis ulasan Anda... (maks. 20 kata)"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="btn btn-sm btn-ghost"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitTestimoni}
                  className="btn btn-sm btn-primary"
                >
                  Kirim
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
