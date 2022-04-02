import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddPost from "../components/profile/AddPost";
import BackgroundImage from "../components/profile/BackgroundImage";
import Friends from "../components/profile/Friends";
import GetPost from "../components/profile/GetPost";
import Info from "../components/profile/Info";

const Profile = () => {
  const user = useSelector((state) => state.auth.value.user);
  const [data, setData] = useState("");
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
  // getData();
  useEffect(() => {
    getData();
  }, []);
  return (
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
      />
      <Info
        text={user.biography}
        username={user.userName}
        user={[user.firstName, user.lastName]}
        place={user.place}
        hobby={user.hobby}
      />
      <Friends friends={user.friends} token={user.token} />
      <AddPost jwt={user.token} onAdd={getData} />
      {data ? (
        <GetPost data={data} jwt={user.token} onAdd={getData} />
      ) : (
        "No Post Found. Add Post to see Here"
      )}
    </>
  );
};

export default Profile;
