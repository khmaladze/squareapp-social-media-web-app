import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Public from "../components/main/public/Public";

const Main = () => {
  const [page, setPage] = useState("Public");
  return (
    <MainPage>
      <NavBarContainer>
        <Link to={"/"}>
          <Item onClick={() => setPage("Public")}>Public</Item>
        </Link>
        <Link to={"/"}>
          <Item onClick={() => setPage("friend")}>friend</Item>
        </Link>
        <Link to={"/message"}>
          <Item>Message</Item>
        </Link>
        <Link to={"/addfriend"}>
          <Item>Add Friend</Item>
        </Link>
      </NavBarContainer>
      <div style={{ height: "150px" }}></div>
      {page == "Public" && <Public />}
      {page == "friend" && "friend"}
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
  height: 150px;
  max-width: 1200px;
  width: 100%;
  background: #f7f7f7;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  position: fixed;
  z-index: 1000;
  a {
    font-family: "Raleway", sans-serif;
    color: white;
    width: 100%;
    max-width: 150px;
  }
`;

const Item = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  height: 50px;
  width: 100%;
  max-width: 150px;
  background: #1237fd;
  color: white;
  text-align: center;
  //   :nth-child(1) {
  // background: ;
  //   }
`;

export default Main;
