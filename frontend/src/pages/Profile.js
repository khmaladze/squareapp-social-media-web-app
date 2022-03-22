import React from "react";
import { useSelector } from "react-redux";
import BackgroundImage from "../components/profile/BackgroundImage";
import Friends from "../components/profile/Friends";
import Info from "../components/profile/Info";

const Profile = () => {
  const user = useSelector((state) => state.auth.value.user);
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
    </>
  );
};

export default Profile;
