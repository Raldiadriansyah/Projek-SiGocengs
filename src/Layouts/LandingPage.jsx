import { Outlet } from "react-router-dom";
import Header from "../Pages/LandingPage/Header";

export default function LandingPage(){
    return(
        <div id="app-container" className="bg-gray-100 min-h-screen">
            <div id="layout-wrapper">
                <div id="main-content" className="p-4">
                    <div id="home">
                        <Header/>
                    </div>
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}