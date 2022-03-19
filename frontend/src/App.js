import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";

const Routing = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      if (window.location.pathname === "/login") {
        navigate("/");
      }
      if (window.location.pathname === "/register") {
        navigate("/");
      }
      if (window.location.pathname === "/") {
        navigate("/");
      }
    }
    if (!user) {
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
      ) {
        if (window.location.pathname === "/register") {
          navigate("/register");
        }
        if (window.location.pathname === "/login") {
          navigate("/login");
        }
      } else {
        navigate("/welcome");
      }
    }
  }, []);
  return (
    <Routes>
      {user && <Route path="/" element={<Home />} />}
      {!user && (
        <>
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </>
      )}
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
