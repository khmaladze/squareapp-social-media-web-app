import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import MainNav from "../components/MainNav";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import io from "socket.io-client";
import { format } from "timeago.js";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const Message = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const token = useSelector((state) => state.auth.value.user.token);
  const user = useSelector((state) => state.auth.value.user);
  const [chatSelected, setChatSelected] = useState(false);
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userId, setUserId] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [conversation, setConversation] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const getFriendDetail = async (ourRequest = "") => {
    try {
      const res = await axios.get("/api/user/friend", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: ourRequest.token,
      });
      setUserData(res.data.friend);
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    if (userData == "") {
      const ourRequest = axios.CancelToken.source();

      getFriendDetail(ourRequest);
      return () => {
        ourRequest.cancel();
      };
    }
  }, []);

  const handleClick = (id) => {
    navigate(`/profile/${id}`);
  };

  const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
  };

  const messageUser = async (id, image, username) => {
    try {
      setUserId(id);
      setProfileImage(image);
      setUsername(username);
      setChatSelected(true);
      const res = await axios.get(`/api/messenger/get/message/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setMessages(res.data.message);
      socket.emit(
        "join chat",
        res.data.message[0].conversationId
          ? res.data.message[0].conversationId
          : String(user._id + id)
      );
      scrollToBottom(1);
    } catch (error) {
      // console.log(error);
    }
  };

  const sendMessage = async (id) => {
    try {
      const res = await axios.post(
        `/api/messenger/send/message/${id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      // console.log(res);
      if (res.data.success) {
        setText("");
        setUserId(userId);
        setProfileImage(profileImage);
        setUsername(username);
        setChatSelected(true);
        const res = await axios.get(`/api/messenger/get/message/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        setMessages(res.data.message);
        socket.emit(
          "new message",
          res.data.message[0].conversationId,
          res.data.message[messages.length]
        );
        scrollToBottom(1);
        if (responseMessage.length > 0) {
          setResponseMessage("");
        }
      }
    } catch (error) {
      if (error.response) {
        setResponseMessage(error.response.data.message);
      }
    }
  };

  const pageTime = () => {
    setTimeout(() => {
      navigate("/public");
    }, 15000);
  };

  useEffect(() => {
    pageTime();
  }, []);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    socket.on("message recived", (newMessageRecived) => {
      if (newMessageRecived) {
        setMessages([...messages, newMessageRecived]);
        scrollToBottom(1);
      }
    });
  });

  const closeChat = () => {
    setChatSelected(false);
    setMessages([]);
    window.location.reload();
  };

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
              <Link to={`/profile/${userId}`}>
                <h1>{username}</h1>
              </Link>
              <Link to={`/profile/${userId}`}>
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
              </Link>
            </div>

            <Button
              onClick={() => closeChat()}
              variant="contained"
              style={{ height: "50px" }}
            >
              Close
            </Button>
          </div>
          <div>
            <div style={{ maxHeight: "500px", overflowY: "scroll" }} id="1">
              {messages.map((i) => {
                return (
                  <div
                    key={i._id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "95%",
                      margin: "auto",
                      marginTop: "10px",
                      marginBottom: "10px",
                      // border: "1px solid",
                      padding: "7px",
                      maxWidth: "1200px",
                      background: `${
                        i.sender._id == user._id ? "#1f78f8" : "#d1d1d1"
                      }`,
                      color: `${i.sender._id == user._id ? "white" : "black"}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "97%",
                        paddingRight: "10px",
                      }}
                    >
                      <h4 style={{ maxWidth: "70%" }}>{i.text}</h4>
                      <h5>{format(i.createdAt)}</h5>
                    </div>
                    <Link
                      to={
                        i.sender._id == user._id
                          ? "/profile"
                          : `/profile/${i.sender._id}`
                      }
                    >
                      <div
                        style={{
                          backgroundImage: `url(${i.sender.profileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          borderRadius: "50%",
                          // border: "0.7px solid",
                          height: "50px",
                          width: "50px",
                        }}
                      ></div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
          {responseMessage.length > 0 && <h3>{responseMessage}</h3>}
          <div
            style={{
              marginTop: "15px",
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
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <Button
              variant="contained"
              style={{ height: "50px" }}
              onClick={() => sendMessage(userId)}
            >
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
