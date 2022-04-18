import React from "react";
import Post from "../components/main/friend/Post";
import Storie from "../components/main/friend/Storie";
import MainNav from "../components/MainNav";

const Friend = () => {
  return (
    <>
      <MainNav />
      <Storie />
      <Post />
    </>
  );
};

export default Friend;
