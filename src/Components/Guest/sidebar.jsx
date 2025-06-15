import { HiClipboardList } from "react-icons/hi"; 
import { GrTransaction } from "react-icons/gr"; 
import { BsCoin } from "react-icons/bs"; 
import { BiHome } from "react-icons/bi"; 
import { NavLink } from "react-router-dom";

export default function Sidebar({ isOpen }) {
    const menuClass = ({ isActive }) =>
        `flex items-center rounded-xl p-4 space-x-3 font-poppins text-[18px] cursor-pointer 
        ${isActive ? 
            "text-biru bg-blue-200 font-extrabold" : 
            "text-gray-600 hover:text-biru hover:bg-blue-200 hover:font-extrabold"
        }`;

    return (
        <div className={`h-full rounded-b-2xl bg-blue-50 shadow-lg transition-all duration-300 ${isOpen ? "w-80 p-6" : "w-23 p-4"}`}>
            <div id="sidebar-menu" className="w-full mt-5">
                <ul id="menu-list" className="space-y-8">
                    <li>
                        <NavLink id="menu-1" to="/Beranda" className={menuClass}>
                            <BiHome size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Beranda</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-2" to="/Saldo" className={menuClass}>
                            <BsCoin  size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Saldo</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-4" to="/Kelola-Budget" className={menuClass}>
                            <HiClipboardList size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Kelola Bugdet</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="/Transaksi" className={menuClass}>
                            <GrTransaction size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Transaksi</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}
