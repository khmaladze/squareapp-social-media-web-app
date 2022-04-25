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
import AddFriend from "./pages/AddFriend";
import UserProfile from "./pages/UserProfile";
import Public from "./pages/Public";
import Friend from "./pages/Friend";
import Message from "./pages/Message";
import NotFound from "./components/NotFound";

const Routing = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.value.user);
  // console.log("user", user);
  useEffect(() => {
    if (user !== null) {
      if (window.location.pathname === "/login") {
        navigate("/public");
      }
      if (window.location.pathname === "/register") {
        navigate("/public");
      }
      if (window.location.pathname === "/") {
        navigate("/public");
      }
      if (window.location.pathname === "/public") {
        navigate("/public");
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
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/settings" exact element={<Settings />} />
            <Route path="/addfriend" exact element={<AddFriend />} />
            <Route path="/profile/:profileId" exact element={<UserProfile />} />
            <Route path="/public" exact element={<Public />} />
            <Route path="/friend" exact element={<Friend />} />
            <Route path="/message" exact element={<Message />} />
            <Route path="*" exact element={<NotFound />} />
          </>
        )}
        {!user && (
          <>
            <Route path="/welcome" exact element={<WelcomePage />} />
            <Route path="/register" exact element={<Register />} />
            <Route path="/login" exact element={<Login />} />
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
