import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { format } from "timeago.js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardActions from "@mui/material/CardActions";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const Storie = () => {
  const [data, setData] = useState(null);
  const [storie, setStorie] = useState(null);
  const [currentStorie, setCurrentStorie] = useState(null);
  const userId = useSelector((state) => state.auth.value.user._id);
  const token = useSelector((state) => state.auth.value.user.token);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [current, setCurrent] = React.useState(0);
  const [storieViewOpen, setStorieViewOpen] = React.useState(null);
  const [loader, setLoader] = React.useState(true);
  const [prev, setPrev] = React.useState("");
  const handleOpen = () => setOpen(true);
  const navigate = useNavigate();
  const getStorieData = async (ourRequest) => {
    try {
      const res = await axios.get("/api/storie/public", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        cancelToken: ourRequest.token,
      });
      setStorie(res.data.storie);
      if (res.data.storie.length == 0) {
        setLoader(false);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const addStorieView = async (id) => {
    try {
      await axios.put(`/api/storie/update/add/view/${id}`, "", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return getStorieData();
    } catch (error) {
      // console.log(error);
    }
  };
  const openStorie = async (id, index, front = true) => {
    try {
      // console.log(index);
      if (front == false) {
        setCurrent(index);
        if (index - 1 >= 0) {
          setPrev(true);
        } else {
          setPrev(false);
        }
        const newData = storie.filter((i) => i._id == id);
        setCurrentStorie(newData);
        if (newData !== null) {
          handleOpen();
          addStorieView(id);
        }
      }
      if (front == true) {
        if (current + 1 > storie.length) {
          setCurrent(index - 1);
        } else {
          setCurrent(index + 1);
        }
        if (index == 0) {
          setPrev(false);
        } else if (index > 0) {
          setPrev(true);
        }
        const newData = storie.filter((i) => i._id == id);
        setCurrentStorie(newData);
        if (newData !== null) {
          handleOpen();
          addStorieView(id);
        }
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const nextStorie = () => {
    openStorie(storie[current]._id, current);
  };

  const prevStorie = () => {
    openStorie(storie[current - 1]._id, current - 1, false);
  };

  const addLike = async (id) => {
    try {
      const res = await axios.put(`/api/storie/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return getStorieData();
    } catch (error) {
      // console.log(error);
    }
  };

  const unLike = async (id) => {
    try {
      const res = await axios.put(`/api/storie/delete/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return getStorieData();
    } catch (error) {
      // console.log(error);
    }
  };

  // const deleteStorie = async (id) => {
  //   try {
  //     await axios.delete(`/api/storie/delete/${id}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (storie.length > 1) {
  //       return getStorieData();
  //     } else {
  //       setOpen(false);
  //       return getStorieData();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  const viewProfile = (id) => {
    // console.log(id);
    if (id) {
      return navigate(`/profile/${id}`);
    }
  };
  useEffect(() => {
    const ourRequest = axios.CancelToken.source(); // <-- 1st step

    getStorieData(ourRequest);
    return () => {
      ourRequest.cancel();
    };
  }, []);
  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Public</h1>
      {storie && storie.length > 0 ? (
        <>
          <StorieContainer>
            {storie.slice(0, 5).map((item, index) => {
              return (
                <StorieDiv
                  key={item._id}
                  img={item.postedBy.profileImage}
                  onClick={() => openStorie(item._id, index)}
                ></StorieDiv>
              );
            })}
          </StorieContainer>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {currentStorie
                ? currentStorie.map((i) => {
                    return (
                      <div key={i._id}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {i.postedBy.profileImage && (
                              <div
                                onClick={() => viewProfile(i.postedBy._id)}
                                style={{
                                  width: "45px",
                                  height: "45px",
                                  borderRadius: "50%",
                                  backgroundPosition: "center",
                                  backgroundSize: "cover",
                                  backgroundRepeat: "no-repeat",
                                  backgroundImage: `url(${
                                    i.postedBy.profileImage
                                      ? i.postedBy.profileImage
                                      : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
                                  })`,
                                  float: "left",
                                  marginRight: "15px",
                                  cursor: "pointer",
                                }}
                              ></div>
                            )}
                            {i.postedBy.userName && (
                              <h5
                                style={{ cursor: "pointer" }}
                                onClick={() => viewProfile(i.postedBy._id)}
                              >
                                {i.postedBy.userName}
                              </h5>
                            )}
                          </div>
                          {i.createdAt && (
                            <Typography>{format(i.createdAt)}</Typography>
                          )}
                        </div>
                        {i.image && (
                          <img
                            style={{ width: "100%" }}
                            src={i.image}
                            alt="imagee"
                          />
                        )}
                        {i.video && (
                          <video
                            controls
                            controlsList="nodownload"
                            style={{ width: "100%" }}
                          >
                            <source src={i.video}></source>
                          </video>
                        )}
                        {i.text && (
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                          >
                            {i.text}
                          </Typography>
                        )}
                        <CardActions>
                          {i.like.filter(
                            (like) => like.likeBy === userId
                          )[0] ? (
                            <div
                              style={{
                                color: "red",
                                cursor: "pointer",
                                width: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                              }}
                              onClick={() => unLike(i._id)}
                            >
                              {i.like.length}
                              <FavoriteIcon />
                            </div>
                          ) : (
                            <div
                              style={{
                                color: "red",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "20px",
                              }}
                              onClick={() => addLike(i._id)}
                            >
                              {i.like.length}
                              <FavoriteBorderIcon />
                            </div>
                          )}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              float: "right",
                              width: "100%",
                            }}
                          >
                            {prev && storie.length > 1 && (
                              <Button onClick={prevStorie}>prev storie</Button>
                            )}
                            {current !== storie.length &&
                              current < storie.length &&
                              current < storie.length &&
                              storie.length > current &&
                              storie.length > 1 && (
                                <Button onClick={nextStorie}>
                                  next storie
                                </Button>
                              )}
                          </div>
                        </CardActions>
                      </div>
                    );
                  })
                : "loading"}
            </Box>
          </Modal>
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
          {loader ? (
            <CircularProgress />
          ) : (
            <Typography>No Active Storie Found Yet...</Typography>
          )}
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

const StorieDiv = styled.div`
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

export default Storie;
