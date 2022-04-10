import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MainNavBar = () => {
  return (
    <NavBarContainer>
      <Link to={"/friend"}>
        <Item>friend</Item>
      </Link>
      <Link to={"/public"}>
        <Item>Public</Item>
      </Link>
      <Link to={"/message"}>
        <Item>Message</Item>
      </Link>
      <Link to={"/addfriend"}>
        <Item>Add Friend</Item>
      </Link>
    </NavBarContainer>
  );
};

const NavBarContainer = styled.div`
  height: 100%;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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

export default MainNavBar;
