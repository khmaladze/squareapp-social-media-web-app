import React from "react";
import styled from "styled-components";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import HomeIcon from "@mui/icons-material/Home";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import PeopleIcon from "@mui/icons-material/People";
import Button from "@mui/material/Button";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import axios from "axios";

const Info = ({
  text,
  username,
  user,
  place,
  hobby,
  isFriend,
  userId,
  userToken,
  isSender,
  isReciver,
}) => {
  const addFriendRequest = async (id) => {
    try {
      console.log(id);
      const res = await axios.post(
        `/api/friend/add`,
        { reciver: id },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
        }
      );
      console.log(res);

      if (res.data.success) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };
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
        <div style={{ height: "25px" }}></div>
        {isFriend && (
          <Button
            variant="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              maxWidth: "200px",
              margin: "0 auto",
            }}
          >
            Already Friends <PeopleIcon />
          </Button>
        )}
        {!isFriend && !isSender && !isReciver && (
          <Button
            onClick={() => addFriendRequest(userId)}
            variant="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              maxWidth: "200px",
              margin: "0 auto",
            }}
          >
            Add Friend <GroupAddIcon />
          </Button>
        )}
        {!isFriend && !isReciver && isSender && (
          <Button
            onClick={() => addFriendRequest(userId)}
            variant="contained"
            style={{
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              maxWidth: "200px",
              margin: "0 auto",
            }}
          >
            Remove Request
          </Button>
        )}

        {!isFriend && isReciver && !isSender && (
          <>
            <Button
              onClick={() => addFriendRequest(userId)}
              variant="contained"
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                maxWidth: "200px",
                margin: "0 auto",
              }}
            >
              Accept Request
            </Button>
            <Button
              onClick={() => addFriendRequest(userId)}
              variant="contained"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                maxWidth: "200px",
                margin: "0 auto",
                background: "black",
              }}
            >
              Remove Request
            </Button>
          </>
        )}
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
            <h4>lives in: {place === "" ? "" : place}</h4>
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
            <h4>hobby: {hobby === "" ? "" : <>{hobby}</>}</h4>
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
