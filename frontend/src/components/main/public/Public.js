import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";

const Public = () => {
  const [data, setData] = useState(null);
  const [storie, setStorie] = useState(null);
  const token = useSelector((state) => state.auth.value.user.token);
  const getStorieData = async () => {
    try {
      const res = await axios.get("/api/storie/public", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });
      setStorie(res.data.storie);
      console.log(storie);
      console.log(storie);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getStorieData();
  }, []);
  return (
    <div>
      <h1>Public</h1>
      {storie ? (
        <>
          <StorieContainer>
            {storie.slice(0, 5).map((item) => {
              return (
                <Storie
                  key={item._id}
                  img={item.postedBy.profileImage}
                ></Storie>
              );
            })}
          </StorieContainer>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

const StorieContainer = styled.div`
  height: 90px;
  width: 100%;
  background: white;
  border: 1px solid;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Storie = styled.div`
  height: 75px;
  width: 75px;
  border-radius: 50%;
  border: 1px #1237fd solid;
  margin-left: 15px;
  margin-right: 15px;
  background-image: url(${(props) => props.img});
  background-position: center;
  background-size: cover;
  cursor: pointer;
`;

export default Public;
