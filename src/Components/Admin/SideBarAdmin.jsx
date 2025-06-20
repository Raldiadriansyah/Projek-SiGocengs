import { BsMicrosoftTeams } from "react-icons/bs"; 
import { FaQuestion } from "react-icons/fa"; 
import { MdReviews } from "react-icons/md"; 
import { CgUserList } from "react-icons/cg"; 
import { HiClipboardList } from "react-icons/hi"; 
import { GrTransaction } from "react-icons/gr"; 
import { BsCoin } from "react-icons/bs"; 
import { BiHome } from "react-icons/bi"; 
import { NavLink } from "react-router-dom";

export default function SidebarAdmin({ isOpen }) {
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
                        <NavLink id="menu-1" to="/BerandaAdmin" className={menuClass}>
                            <BiHome size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Beranda</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-2" to="ManajemenSumber" className={menuClass}>
                            <BsCoin  size={30} className="min-w-[30px]" />
                            {isOpen && <span className="ml-5">Manajemen Sumber</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="ManajemenTim" className={menuClass}>
                          <BsMicrosoftTeams size={30} className="min-w-[30px]"/>
                            {isOpen && <span className="ml-5">Manajemen Tim</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-4" to="ManajemenUser" className={menuClass}>
                            <CgUserList size={30} className="min-w-[30px]"/>
                            {isOpen && <span className="ml-5">Manajemen User</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="ManajemenTestimoni" className={menuClass}>
                           <MdReviews size={30} className="min-w-[30px]"/>
                            {isOpen && <span className="ml-5">Manajemen Testimoni</span>}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink id="menu-3" to="ManajemenFAQ" className={menuClass}>
                           <FaQuestion size={30} className="min-w-[30px]"/>
                            {isOpen && <span className="ml-5">Manajemen FAQ</span>}
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}
