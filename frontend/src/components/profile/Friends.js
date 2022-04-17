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
                    ? "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
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
  background-position: center;
  background-size: cover;
  cursor: pointer;

  h4 {
    text-align: center;
    background: white;
    color: black;
    border: 1px solid;
  }
`;
