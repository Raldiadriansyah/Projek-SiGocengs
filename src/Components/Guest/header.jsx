import { AiOutlineMenu } from "react-icons/ai"; 
import { useState } from "react";
export default function header({ toggleSidebar }){
    
    return(
        <header className="bg-blue-50 shadow-md border-b border-gray-300 w-full">
            <div className="flex  items-center px-10 py-3 text-sm text-gray-600  h-[100px]">
                <button onClick={toggleSidebar}>
                    <AiOutlineMenu
                        size={28}
                        className="text-gray-600 hover:text-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer"
                    />
                </button>

                <h1 className="ml-20 font-poppins-extrabold font-[1000] text-[28px] text-blue-600">SiGocengs</h1>
            </div>
        </header>
    );
}