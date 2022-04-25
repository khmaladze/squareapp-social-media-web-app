import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";
import MessageIcon from "@mui/icons-material/Message";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

export const MainNav = () => {
  const navigate = useNavigate();
  const reload = async (page = "") => {
    if (window.location.pathname == "/message") {
      if (page.length > 0) {
        await navigate(page);
      }
      window.location.reload();
    } else {
      if (page.length > 0) {
        await navigate(page);
      }
    }
  };
  return (
    <MainPage>
      <NavBarContainer>
        <Link to={"/public"} onClick={() => reload("/public")}>
          <Item>
            {/* Public */}
            <PublicIcon />
          </Item>
        </Link>
        <Link to={"/friend"} onClick={() => reload("/friend")}>
          <Item>
            {/* friend  */}
            <PeopleIcon />
          </Item>
        </Link>
        <Link to={"/message"} onClick={() => reload()}>
          <Item>
            {/* Message */}
            <MessageIcon />
          </Item>
        </Link>
        <Link to={"/addfriend"} onClick={() => reload("/addfriend")}>
          <Item>
            {/* Add Friend */}
            <GroupAddIcon />
          </Item>
        </Link>
      </NavBarContainer>
      <div style={{ height: "70px" }}></div>
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

export default MainNav;
