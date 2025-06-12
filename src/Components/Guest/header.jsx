import { CgProfile } from "react-icons/cg"; 
import { AiOutlineMenu } from "react-icons/ai"; 
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

                <div className="flex justify-end text-right w-full">
                    <div className="mr-5 mt-1">
                        <h1 className="font-poppins-extrabold font-[700] text-[18px]">{userName}</h1>
                    </div>
                    <CgProfile size={32} className="text-gray-600 hover:text-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"/>
                </div>
            </div>
        </header>
    );
}