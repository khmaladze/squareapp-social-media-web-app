import React from "react";
import Post from "../components/main/public/Post";
import Storie from "../components/main/public/Storie";
import MainNav from "../components/MainNav";

const Public = () => {
  return (
    <>
      <MainNav />
      <Storie />
      <Post />
    </>
  );
};

export default Public;
