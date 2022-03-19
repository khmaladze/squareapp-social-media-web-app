import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthRouting } from "./components/AuthRouting";
import { MainPage } from "./pages/MainPage";

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
      if (window.location.pathname.startsWith("/")) {
        navigate("/");
      }
      navigate("/");
    }
  }, [auth]);

  const Routing = () => {
    return (
      <Routes>
        {!auth && (
          <>
            <Route path="/" element={<MainPage />} />
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
