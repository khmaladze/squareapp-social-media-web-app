import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { WelcomePage } from "./pages/WelcomePage";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { useSelector } from "react-redux";
import { Navbar } from "./components/Navbar";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Main from "./pages/Main";
import AddFriend from "./components/addfriend/AddFriend";
import UserProfile from "./pages/UserProfile";

const Routing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.value.user);
  console.log("user", user);
  useEffect(() => {
    if (user !== null) {
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
    if (user == null) {
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
    <>
      {user && (
        <>
          <Navbar />
          <div style={{ height: "80px" }}></div>
        </>
      )}
      <Routes>
        {user && (
          <>
            <Route path="/" element={<Main />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/addfriend" element={<AddFriend />} />
            <Route path="/profile/:profileId" element={<UserProfile />} />
          </>
        )}
        {!user && (
          <>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </>
        )}
      </Routes>
    </>
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
