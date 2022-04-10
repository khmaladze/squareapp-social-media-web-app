import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const MainNavBar = () => {
  return (
    <NavBarContainer>
      <Item>
        <Link to={"/friend"}>friend</Link>
      </Item>
      <Item>
        <Link to={"/public"}>Public</Link>
      </Item>
      <Item>
        <Link to={"/message"}>Message</Link>
      </Item>
      <Item>
        <Link to={"/addfriend"}>Add Friend</Link>
      </Item>
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
  a {
    font-family: "Raleway", sans-serif;
    color: white;
  }
  //   :nth-child(1) {
  // background: ;
  //   }
`;

export default MainNavBar;
