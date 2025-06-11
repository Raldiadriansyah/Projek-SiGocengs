import "./assets/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import AuthLayout from "./Layouts/AuthLayout";
import Loading from "./Components/Loading";
import Login from "./Pages/Auth/Login";
import Forgot from "./Pages/Auth/Forgot";
import Register from "./Pages/Auth/Register";
const Home = React.lazy(() => import("./Pages/LandingPage/Hero"));
const LandingPage = React.lazy(() => import("./Layouts/LandingPage"));
const Dashboard = React.lazy(() => import("./Pages/Guest/Dashboard"));
const Guest = React.lazy(() => import("./Layouts/Guest"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<LandingPage />}>
            <Route path="/" element={<Home/>}/>
        </Route>
                <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot" element={<Forgot/>}/>
        </Route>
        <Route element={<Guest />}>
            <Route path="/guest" element={<Dashboard/>}/>
        </Route>
      </Routes>

    </Suspense>
  )
}

export default App