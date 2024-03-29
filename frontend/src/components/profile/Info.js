import React from "react";
import styled from "styled-components";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import AccessibilityIcon from "@mui/icons-material/Accessibility";

const Info = ({ text, username, user, place, hobby }) => {
  return (
    <>
      <InfoBackground>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <h2>{user[0]}</h2>
          <div style={{ width: "30px" }}></div>
          <h2>{user[1]}</h2>
        </div>
        <h4>biography: {text}</h4>
        <IconContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              margin: "5px",
              marginTop: "10px",
              padding: "5px",
              minWidth: "200px",
              width: "95%",
              fontSize: "20px",
            }}
          >
            <AccountBoxIcon />
            <h4>username: {username}</h4>
          </div>
        </IconContainer>
        <IconContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "5px",
              margin: "5px",
              minWidth: "200px",
              width: "95%",
              fontSize: "20px",
            }}
          >
            <HomeIcon />
            <h4>lives in: {place === "" ? "add city" : place}</h4>
          </div>
        </IconContainer>
        <IconContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "5px",
              margin: "5px",
              minWidth: "200px",
              width: "95%",
              fontSize: "20px",
            }}
          >
            <AccessibilityIcon />
            <h4>hobby: {hobby === "" ? "add hobby" : <>{hobby}</>}</h4>
          </div>
        </IconContainer>
      </InfoBackground>
    </>
  );
};

const InfoBackground = styled.div`
  background-color: #ffffff;
  height: 100%;
  width: 100%;
  padding-top: 135px;
  padding-bottom: 5px;
  text-align: center;
`;

const IconContainer = styled.div`
  height: 50px;
  width: 100%;
  display: block;
`;

export default Info;
