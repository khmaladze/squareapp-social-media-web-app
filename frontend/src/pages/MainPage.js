import React from "react";
import styled from "styled-components";
import Typewriter from "typewriter-effect";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export const MainPage = () => {
  return (
    <Main>
      <ImgContainer>
        <Img src="/assets/logo.png" />
      </ImgContainer>
      <WelcomeText>
        <div className="welcome__text">
          <Typewriter
            onInit={(typewriter) => {
              typewriter
                .typeString(
                  "CREATE ACCOUNT, lOG IN, CREATE POST, LIKE & COMMENT, UPLOAD IMAGES VIDEOS, ADD FRIEND, MESSAGE TO YOUR FRIEND  "
                )
                .start();
            }}
            options={{
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </WelcomeText>
      <Stack
        mt={5}
        spacing={12}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="outlined"
          style={{
            background: "white",
            color: "black",
            border: "black 1px solid",
            height: "50px",
            width: "100px",
          }}
        >
          LOG IN
        </Button>
        <Button
          variant="contained"
          style={{
            background: "black",
            color: "white",
            height: "50px",
            width: "100px",
          }}
        >
          REGISTER
        </Button>
      </Stack>
      <Footer>
        <h3>@squareapp</h3>
        <h3>Terms & Privacy Police</h3>
      </Footer>
    </Main>
  );
};

const Main = styled.div`
  min-height: 100vh;
  background: #f7f7f7;
  width: 100%;
`;

const ImgContainer = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  height: 80px;
`;

const WelcomeText = styled.div`
  margin-top: 200px;
  margin-bottom: 50px;
  min-height: 200px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 0;
  height: 80px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
