import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Friends from "../components/addfriend/Friends";
import MainNav from "../components/MainNav";

const AddFriend = () => {
  const navigate = useNavigate();
  const userToken = useSelector((state) => state.auth.value.user.token);
  const userId = useSelector((state) => state.auth.value.user._id);
  // const userfriends = useSelector((state) => state.auth.value.user.friends);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [alreadysend, setAlreadySend] = useState(null);
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [active, setActive] = useState("");

  const getData = async (ourRequest = "") => {
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
          cancelToken: ourRequest.token,
        });
        // console.log(res);
        if (res.data.message) {
          setMessage(res.data.message);
          // console.log(message);
        }
        if (res.data.success) {
          setUser(res.data.user);
        }
        // console.log(alreadysend);
        setAlreadySend(res.data.alreadySend);
        // console.log(user);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const viewProfile = (id) => {
    // console.log(id);
    if (id && id !== userId) {
      return navigate(`/profile/${id}`);
    }
  };

  const addFriendRequest = async (id) => {
    try {
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
      // console.log(res);
      if (res.data.success == false) {
        window.location.reload();
      }
      if (res.data.success == true) {
        await getData();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const removeFriendRequest = async (id) => {
    try {
      // console.log(id);
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
      // console.log(res);
      if (res.data.success) {
        await getData();
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const getRequest = async (ourRequest = "") => {
    try {
      const res = await axios.get(`/api/friend/get`, {
        headers: {
          authorization: `Bearer ${userToken}`,
        },
        cancelToken: ourRequest.token,
      });
      setData(res.data.friendAdd);
    } catch (error) {
      // console.log(error);
    }
  };

  const getFriendDetail = async (ourRequest = "") => {
    try {
      const res = await axios.get("/api/user/friend", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
        cancelToken: ourRequest.token,
      });
      setUserData(res.data.friend);
      // if (res.data.active == false) {
      // }
    } catch (error) {
      // console.log(error);
    }
  };

  const sendResponse = async (response, requestId) => {
    try {
      const res = await axios.post(
        `/api/friend/response`,
        { response, requestId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${userToken}`,
          },
        }
      );
      await getRequest();
      await getFriendDetail();
      window.location.reload();
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    const ourRequest = axios.CancelToken.source(); // <-- 1st step

    getRequest(ourRequest);
    if (userData == "") {
      getFriendDetail(ourRequest);
    }
    return () => {
      ourRequest.cancel();
    };
  }, []);

  return (
    <>
      <MainNav />
      <Main>
        <h1>Friend Request:</h1>
        <div>
          {data.map((i) => {
            return (
              <div key={i._id}>
                <UserCard>
                  <div
                    onClick={() => viewProfile(i.sender._id)}
                    style={{
                      backgroundImage: `url(${
                        i.sender.profileImage
                          ? i.sender.profileImage
                          : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
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
                  <h1
                    onClick={() => viewProfile(i.sender._id)}
                    style={{ marginTop: "0px", cursor: "pointer" }}
                  >
                    {i.sender.userName}
                  </h1>
                  <div>
                    <Button
                      onClick={() => sendResponse(true, i._id)}
                      style={{
                        marginRight: "5px",
                        // background: "green"
                      }}
                      variant="contained"
                    >
                      Accept
                    </Button>
                    <Button
                      onClick={() => sendResponse(false, i._id)}
                      style={{
                        marginRight: "5px",
                        // fontSize: "12px",
                        background: "black",
                      }}
                      variant="contained"
                    >
                      remove request
                    </Button>
                  </div>
                </UserCard>
                <h4>
                  {alreadysend &&
                    "you have already send friend request to this user"}
                </h4>
                <h5>
                  {alreadysend &&
                    "if you want to cancel request you can click to remove request"}
                </h5>
              </div>
            );
          })}
        </div>
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
                            : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
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
                    <h1
                      onClick={() => viewProfile(i._id)}
                      style={{ marginTop: "0px", cursor: "pointer" }}
                    >
                      {i.userName}
                    </h1>
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
                      "you have already send friend request to this user"}
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
        <h1 style={{ marginTop: "35px" }}>Friends</h1>
        <Friends data={userData} />
      </Main>
    </>
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
  // background: #1fceea;
  border: 1px solid;
`;

export default AddFriend;
