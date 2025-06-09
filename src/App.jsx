import "./assets/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./Components/Loading";
const Dashboard = React.lazy(() => import("./Pages/LandingPage/Hero"));
const LandingPage = React.lazy(() => import("./Layouts/LandingPage"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<LandingPage />}>
            <Route path="/" element={<Dashboard/>}/>
        </Route>
      </Routes>
    </Suspense>
  )
}

export default App
