import "./assets/tailwind.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Loading from "./Components/Loading";

const Dashboard = React.lazy(() => import("./Pages/LandingPage/Hero"));
const LandingPage = React.lazy(() => import("./Layouts/LandingPage"));
const AuthLayout = React.lazy(() => import("./Layouts/AuthLayout"));
import Login from "./Pages/auth/login";
import Register from "./Pages/auth/Register";
import Forgot from "./Pages/auth/Forgot";

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route element={<LandingPage />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>
      </Routes>

    </Suspense>
  )
}

export default App
