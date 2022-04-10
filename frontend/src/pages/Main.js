import React from "react";
import styled from "styled-components";
import MainNavBar from "../components/main/MainNavBar";

const Main = () => {
  return (
    <MainPage>
      <MainNavBar />
    </MainPage>
  );
};

const MainPage = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export default Main;
