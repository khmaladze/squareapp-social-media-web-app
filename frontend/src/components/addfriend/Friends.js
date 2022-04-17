import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";

const Friends = ({ friends }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const token = useSelector((state) => state.auth.value.user.token);
  const getFriendDetail = async () => {
    try {
      const res = await axios.get("/api/user/friend", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setUserData(res.data.friend);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData == "") {
      getFriendDetail();
    }
  }, []);
  const handleClick = (id) => {
    navigate(`/profile/${id}`);
  };
  return (
    <div
      style={{ background: "white", margin: "0 auto", borderTop: "1px solid" }}
    >
      <FriendContainer>
        {userData !== "" ? (
          userData.slice(0, 6).map((item) => {
            return (
              <FriendProfile
                onClick={() => handleClick(item._id)}
                key={item._id}
                img={
                  item.profileImage === ""
                    ? "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
                    : item.profileImage
                }
              >
                <h4>{item.userName}</h4>
              </FriendProfile>
            );
          })
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              marginTop: "10px",
              marginBottom: "10px",
            }}
          >
            <CircularProgress />
          </div>
        )}
      </FriendContainer>
    </div>
  );
};

export default Friends;

const FriendContainer = styled.div`
  height: 100%;
  width: 100%;
  max-width: 550px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const FriendProfile = styled.div`
  margin: 10px auto;
  height: 150px;
  width: 100%;
  max-width: 150px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  cursor: pointer;

  h4 {
    text-align: center;
    background: white;
    color: black;
    border: 1px solid;
  }
`;
