import "./assets/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./Components/Loading";
const Home = React.lazy(() => import("./Pages/LandingPage/Hero"));
const Dashboard = React.lazy(() => import("./Pages/Guest/Dashboard"));
const LandingPage = React.lazy(() => import("./Layouts/LandingPage"));
const Guest = React.lazy(() => import("./Layouts/Guest"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<LandingPage />}>
            <Route path="/" element={<Home/>}/>
        </Route>
        <Route element={<Guest />}>
            <Route path="/guest" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
