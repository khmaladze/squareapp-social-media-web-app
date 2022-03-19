import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthRouting } from "./components/AuthRouting";
import { MainPage } from "./pages/MainPage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";

const App = () => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (auth) {
      if (window.location.pathname === "/login") {
        navigate("/");
      }
      if (window.location.pathname === "/register") {
        navigate("/");
      }
    }
    if (!auth) {
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
        navigate("/");
      }
    }
  }, [auth]);

  const Routing = () => {
    return (
      <Routes>
        {!auth && (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    );
  };

  return (
    <>
      {auth && <AuthRouting />}
      {!auth && <Routing />}
    </>
  );
};

export default App;
