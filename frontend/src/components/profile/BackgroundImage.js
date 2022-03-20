import React from "react";
import styled from "styled-components";

const BackgroundImage = ({ image, profile }) => {
  return (
    <>
      <Background image={image} />
      <ProfileImg>
        <Profile image={profile} />
      </ProfileImg>
    </>
  );
};

const Background = styled.div`
  height: 400px;
  width: 100%;
  background-size: cover;
  background-image: url(${(props) => props.image});
  background-position: center;
  background-repeat: no-repeat;
`;

const ProfileImg = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Profile = styled.div`
  max-height: 300px;
  max-width: 300px;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url(${(props) => props.image});
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border: 5px solid white;
  position: absolute;
  top: 320px;
`;

export default BackgroundImage;
