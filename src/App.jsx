import "./assets/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./Components/Loading";
import Transaksi from "./Pages/Guest/Transaksi";
import Budget from "./Pages/Guest/Budget";
const AuthLayout = React.lazy(() => import("./Layouts/AuthLayout"));
const Login = React.lazy(() => import("./Pages/Auth/Login"));
const Forgot = React.lazy(() => import("./Pages/Auth/Forgot"));
const Register = React.lazy(() => import("./Pages/Auth/Register"));
const Home = React.lazy(() => import("./Pages/LandingPage/Hero"));
const LandingPage = React.lazy(() => import("./Layouts/LandingPage"));
const Dashboard = React.lazy(() => import("./Pages/Guest/Dashboard"));
const Saldo = React.lazy(() => import("./Pages/Guest/Saldo"));
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
            <Route path="/Saldo" element={<Saldo/>}/>
            <Route path="/Transaksi" element={<Transaksi/>}/>
            <Route path="/Budget" element={<Budget/>}/>
        </Route>
      </Routes>

    </Suspense>
  )
}

export default App