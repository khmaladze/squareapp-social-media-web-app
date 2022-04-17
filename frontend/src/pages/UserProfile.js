import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import AddPost from "../components/profile/AddPost";
// import AddStorie from "../components/profile/AddStorie";
// import Friends from "../components/profile/Friends";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import BackgroundImage from "../components/userprofile/BackgroundImage";
import GetPost from "../components/userprofile/GetPost";
import Info from "../components/userprofile/Info";

const UserProfile = () => {
  // const user = useSelector((state) => state.auth.value.user);
  const userToken = useSelector((state) => state.auth.value.user.token);
  const userId = useSelector((state) => state.auth.value.user._id);
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [storie, setStorie] = useState(null);
  const { profileId } = useParams();
  const getData = async () => {
    try {
      const res = await axios.get(`/api/user/profile/${profileId}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${userToken}`,
        },
      });
      console.log(res);
      setUser(res.data.user);
      setStorie(res.data.storie);
      setData(res.data.post);
    } catch (error) {
      console.log(error);
    }
  };
  //   const [date, setfirst] = useState(new Date().toISOString());
  console.log(user);
  //   const getStorie = async () => {
  //     try {
  //       const res = await axios.get("/api/storie/my", {
  //         headers: {
  //           "Content-Type": "application/json",
  //           authorization: `Bearer ${user.token}`,
  //         },
  //       });
  //       console.log(res);
  //       setStorie(res.data.storie.filter((i) => i.expireToken > date));
  //       setShowAddStorie(false);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  useEffect(() => {
    getData();
    // getStorie();
  }, []);
  return (
    <>
      {user ? (
        <>
          <BackgroundImage
            image={
              user[0]?.backgroundImage
                ? user[0]?.backgroundImage
                : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
            }
            profile={
              user[0]?.profileImage
                ? user[0]?.profileImage
                : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
            }
            storie={storie}
            userId={userId}
            jwt={userToken}
            onAdd={getData}
          />
          <Info
            text={user[0].biography}
            username={user[0].userName}
            user={[user[0].firstName, user[0].lastName]}
            place={user[0].place}
            hobby={user[0].hobby}
          />
          {/* <Friends friends={user.friends} token={user.token} /> */}
          {data ? (
            <GetPost
              data={data}
              jwt={userToken}
              userId={userId}
              onAdd={getData}
            />
          ) : (
            "No Post Found. Add Post to see Here"
          )}
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 80px)",
            width: "100%",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  );
};

export default UserProfile;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
