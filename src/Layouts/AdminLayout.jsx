import { Outlet } from "react-router-dom"
import Header from "../Components/Admin/headerAdmin"
import Sidebar from "../Components/Admin/SideBarAdmin"
import { useState } from "react";
export default function Guest(){
    const [isSidebarHovered, setSidebarHovered] = useState(false);
    const [isSidebarToggled, setSidebarToggled] = useState(false);

    const toggleSidebar = () => {
        setSidebarToggled(prev => !prev);
    };
    const isSidebarOpen = isSidebarHovered || isSidebarToggled;

    return (
    <div id="app-container" className="bg-gray-100 min-h-screen flex flex-col">     
        <Header toggleSidebar={toggleSidebar}/>
            <div id="layout-wrapper" className="flex flex-row flex-1">
                <div
                    onMouseEnter={() => setSidebarHovered(true)}
                    onMouseLeave={() => setSidebarHovered(false)}
                >
                    <Sidebar isOpen={isSidebarOpen} />
                </div>
                    <div id="main-content" className="flex-1 p-4 bg-white-200">
                        <Outlet />
                    </div>
            </div>
    </div>
    )
}