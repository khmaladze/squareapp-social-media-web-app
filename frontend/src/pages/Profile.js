import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddPost from "../components/profile/AddPost";
import AddStorie from "../components/profile/AddStorie";
import BackgroundImage from "../components/profile/BackgroundImage";
import Friends from "../components/profile/Friends";
import GetPost from "../components/profile/GetPost";
import Info from "../components/profile/Info";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

const Profile = () => {
  const user = useSelector((state) => state.auth.value.user);
  const [data, setData] = useState("");
  const [showAddStorie, setShowAddStorie] = useState(false);
  const [storie, setStorie] = useState(null);
  const getData = async () => {
    try {
      const res = await axios.get("/api/post/my", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res);
      setData(res.data.post);
    } catch (error) {
      console.log(error);
    }
  };
  const [date, setfirst] = useState(new Date().toISOString());
  const getStorie = async () => {
    setStorie(null);
    setStorie(null);
    try {
      const res = await axios.get("/api/storie/my", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
      });
      console.log(res);
      setStorie(res.data.storie.filter((i) => i.expireToken > date));
      setShowAddStorie(false);
    } catch (error) {
      console.log(error);
    }
  };
  // getData();
  useEffect(() => {
    getData();
    getStorie();
  }, []);
  return (
    <>
      {storie ? (
        <>
          <BackgroundImage
            image={
              user.backgroundImage
                ? user.backgroundImage
                : "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
            }
            profile={
              user.profileImage
                ? user.profileImage
                : "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
            }
            storie={storie}
            userId={user._id}
            jwt={user.token}
            onAdd={getStorie}
          />

          <Info
            text={user.biography}
            username={user.userName}
            user={[user.firstName, user.lastName]}
            place={user.place}
            hobby={user.hobby}
          />
          <Friends friends={user.friends} token={user.token} />
          {!showAddStorie ? (
            <Center>
              <div style={{ marginTop: "20px" }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => setShowAddStorie(true)}
                >
                  Create Storie
                </Button>
              </div>
            </Center>
          ) : (
            <Center>
              <div style={{ marginTop: "20px" }}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => setShowAddStorie(false)}
                >
                  Hide Storie Create
                </Button>
              </div>
            </Center>
          )}
          {showAddStorie && <AddStorie jwt={user.token} onAdd={getStorie} />}
          <AddPost jwt={user.token} onAdd={getData} />
          {data ? (
            <GetPost
              data={data}
              jwt={user.token}
              userId={user._id}
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

export default Profile;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
