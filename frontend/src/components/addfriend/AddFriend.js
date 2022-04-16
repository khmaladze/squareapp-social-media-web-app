import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const AddFriend = () => {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.auth.value.user.token);
  const userId = useSelector((state) => state.auth.value.user._id);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [alreadysend, setAlreadySend] = useState(null);
  const [username, setUsername] = useState("");
  const getData = async () => {
    try {
      if (username) {
        setUser(null);
        setMessage(null);
        setAlreadySend(null);
        // setUsername(null);
        const res = await axios.get(`/api/friend/user/${username}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
        });
        console.log(res);
        if (res.data.message) {
          setMessage(res.data.message);
          console.log(message);
        }
        if (res.data.success) {
          setUser(res.data.user);
        }
        console.log(alreadysend);
        setAlreadySend(res.data.alreadySend);
        console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const viewProfile = (id) => {
    console.log(id);
    if (id && id !== userId) {
      return navigate(`/profile/${id}`);
    }
  };
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
        await getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeFriendRequest = async (id) => {
    try {
      console.log(id);
      const res = await axios.post(
        `/api/friend/remove`,
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
        await getData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Main>
      <h1>Friend Request:</h1>
      <h1>Send Requset:</h1>
      <SearchBar>
        <TextField
          sx={{ width: "90%" }}
          id="outlined-basic"
          label="username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          style={{ height: "55px" }}
          onClick={() => getData()}
          variant="contained"
        >
          search
        </Button>
      </SearchBar>

      {user && (
        <div>
          {user.map((i) => {
            return (
              <div key={i._id}>
                <UserCard>
                  <div
                    onClick={() => viewProfile(i._id)}
                    style={{
                      backgroundImage: `url(${
                        i.profileImage
                          ? i.profileImage
                          : "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
                      })`,
                      height: "75px",
                      width: "75px",
                      borderRadius: "50%",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      float: "left",
                      marginLeft: "5px",
                      cursor: "pointer",
                    }}
                  ></div>
                  <h1 style={{ marginTop: "0px" }}>{i.userName}</h1>
                  {alreadysend ? (
                    <Button
                      onClick={() => removeFriendRequest(i._id)}
                      style={{ marginRight: "5px", fontSize: "12px" }}
                      variant="contained"
                    >
                      remove request
                    </Button>
                  ) : (
                    <Button
                      onClick={() => addFriendRequest(i._id)}
                      style={{ marginRight: "5px" }}
                      variant="contained"
                    >
                      Add Friend
                    </Button>
                  )}
                </UserCard>
                <h4>
                  {alreadysend &&
                    "you already have send friend request to this user"}
                </h4>
                <h5>
                  {alreadysend &&
                    "if you want to cancel request you can click to remove request"}
                </h5>
              </div>
            );
          })}
        </div>
      )}
      <h5>{message && message}</h5>
    </Main>
  );
};

const Main = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  h1 {
    margin-top: 15px;
    text-align: center;
  }
`;

const SearchBar = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserCard = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 85px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  background: #1fceea;
`;

export default AddFriend;
