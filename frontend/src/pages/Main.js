import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Public from "../components/main/public/Public";
import Friend from "../components/main/friend/Friend";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
// import AddFriend from "../components/addfriend/AddFriend";
const Main = () => {
  const [page, setPage] = useState("Public");
  return (
    <MainPage>
      <NavBarContainer>
        <Link to={"/"}>
          <Item onClick={() => setPage("Public")}>
            {/* Public */}
            <PublicIcon />
          </Item>
        </Link>
        <Link to={"/"}>
          <Item onClick={() => setPage("friend")}>
            {/* friend  */}
            <PeopleIcon />
          </Item>
        </Link>
        <Link to={"/message"}>
          <Item>
            {/* Message */}
            <MessageIcon />
          </Item>
        </Link>
        <Link to={"/addfriend"}>
          {/* <Link to={"/"}> */}
          <Item onClick={() => setPage("addfriend")}>
            {/* Add Friend */}
            <GroupAddIcon />
          </Item>
        </Link>
      </NavBarContainer>
      <div style={{ height: "70px" }}></div>
      {page == "Public" && <Public />}
      {page == "friend" && <Friend />}
      {/* {page == "addfriend" && <AddFriend />} */}
    </MainPage>
  );
};

const MainPage = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const NavBarContainer = styled.div`
  height: 50px;
  max-width: 1200px;
  width: 100%;
  background: #f7f7f7;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  // flex-wrap: wrap;
  position: fixed;
  z-index: 1000;
  a {
    font-family: "Raleway", sans-serif;
    color: white;
    width: 25%;
    // max-width: 150px;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  height: 50px;
  width: 100%;
  // max-width: 150px;
  // background: #1237fd;
  border: 0.5px solid black;
  color: #1237fd;
  // color: #1237fd;
  // color: white;
  text-align: center;
  //   :nth-child(1) {
  // background: ;
  //   }
`;

export default Main;
