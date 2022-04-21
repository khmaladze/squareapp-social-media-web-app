import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import MainNav from "../components/MainNav";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const Message = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const token = useSelector((state) => state.auth.value.user.token);
  const user = useSelector((state) => state.auth.value.user);
  const [chatSelected, setChatSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userId, setUserId] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [conversation, setConversation] = useState("");
  const [messages, setMessages] = useState([]);
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

  const getConversation = async () => {
    try {
      console.log(userId);
      console.log(userId);
      const res = await axios.get(`/api/messenger/get/conversation/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const messageUser = async (id, image, username) => {
    try {
      setUserId(id);
      setProfileImage(image);
      setUsername(username);
      setChatSelected(true);
      getConversation();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
    console.log(userId);
    if (userId) {
      getConversation();
    }
  }, []);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <MainNav />
      {!chatSelected && (
        <>
          <h1
            style={{
              textAlign: "center",
              marginTop: "20px",
              marginBottom: "10px",
            }}
          >
            Welcome to Message
          </h1>
          <div
            style={{
              background: "white",
              paddingTop: "30px",
              margin: "0 auto",
              borderTop: "1px solid",
            }}
          >
            <FriendContainer>
              {userData !== "" ? (
                userData.slice(0, 6).map((item) => {
                  return (
                    <FriendContainer key={item._id}>
                      <FriendProfile
                        onClick={() => handleClick(item._id)}
                        img={
                          item.profileImage === ""
                            ? "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
                            : item.profileImage
                        }
                      >
                        <h4>{item.userName}</h4>
                      </FriendProfile>

                      <Button
                        style={{
                          minWidth: "150px",
                          maxWidth: "350px",
                          margin: "0 auto",
                        }}
                        variant="contained"
                        onClick={() =>
                          messageUser(
                            item._id,
                            item.profileImage === ""
                              ? "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
                              : item.profileImage,
                            item.userName
                          )
                        }
                      >
                        message {item.userName}
                      </Button>
                    </FriendContainer>
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
        </>
      )}
      {chatSelected && (
        <div style={{ border: "1px solid" }}>
          <div
            style={{
              maxWidth: "1200px",
              background: "white",
              borderBottom: "1px solid",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              margin: "0 auto",
              paddingLeft: "5px",
              paddingRight: "5px",
            }}
          >
            <div
              style={{
                maxWidth: "1200px",
                background: "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingLeft: "5px",
                paddingRight: "5px",
              }}
            >
              <h1>{username}</h1>
              <div
                style={{
                  backgroundImage: `url(${profileImage})`,
                  height: "77px",
                  width: "77px",
                  borderRadius: "50%",
                  border: "1px solid",
                  marginLeft: "15px",
                  marginTop: "5px",
                  marginBottom: "5px",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>

            <Button
              onClick={() => setChatSelected(false)}
              variant="contained"
              style={{ height: "50px" }}
            >
              Close
            </Button>
          </div>
          <div>message</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingLeft: "5px",
              paddingRight: "5px",
              paddingBottom: "5px",
            }}
          >
            <TextareaAutosize
              aria-label="empty textarea"
              placeholder="Empty"
              style={{ width: "90%", minHeight: "70px" }}
            />
            <Button variant="contained" style={{ height: "50px" }}>
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;

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
