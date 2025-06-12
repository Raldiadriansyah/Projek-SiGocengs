import { MdLogout } from "react-icons/md"; 
import { CgProfile } from "react-icons/cg"; 
import { AiOutlineMenu } from "react-icons/ai"; 
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
export default function header({ toggleSidebar }){
    const [userName, setUserName] = useState("");
    const location = useLocation();
    const currentPath = location.pathname.split("/")[1];

    const pageNames = {
        "Beranda" : "Beranda",
        "Saldo" : "Saldo",
        "Transaksi" : "Transaksi",
        "Kelola-Budget" : "Kelola Budget",
    };

    const pageTitle = pageNames[currentPath] || currentPath.charAt(0).toUpperCase() + currentPath.slice(1);


    useEffect(() => {
        const name = localStorage.getItem("userName");
        setUserName(name || "User");
    }, []);

    const navigate = useNavigate();

    const handleLogout = () => {
    
    localStorage.clear();

    navigate("/login");
    };

    return(
        <header className="bg-blue-50 shadow-md border-b border-gray-300 w-full ">
            <div className="flex  items-center px-10 py-3 text-sm text-gray-600  h-[100px]">
                <button onClick={toggleSidebar}>
                    <AiOutlineMenu
                        size={28}
                        className="text-gray-600 hover:text-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"
                    />
                </button>
                <h1 className="ml-20 font-poppins-extrabold font-[1000] text-[28px] text-blue-600">SiGocengs </h1>
                <div className="flex items-center ml-5 mt-2 space-x-2">
                    <h1 className="text-[28px]">/</h1>
                    <p className="ml-3 text-[20px] mt-1">{pageTitle}</p>
                </div>

                <div className="flex justify-end text-right w-full dropdown dropdown-bottom dropdown-end">
                    <div className="mr-5 mt-1">
                        <h1 className="font-poppins-extrabold font-[700] text-[18px]">{userName}</h1>
                    </div>
                    <CgProfile size={32} tabIndex={0} role="button" className="text-gray-600 hover:text-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"/>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-10 w-42 p-2 shadow-sm">
                     <li>
                        <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 border border-blue-300 rounded text-center text-[18px] justify-center font-medium hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                        >
                        <MdLogout size={20} /> Keluar
                        </button>
                    </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}