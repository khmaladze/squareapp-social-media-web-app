import React from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { format } from "timeago.js";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CardActions from "@mui/material/CardActions";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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

const BackgroundImage = ({ image, profile, storie, userId, jwt, onAdd }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(storie);
  const [limit, setLimit] = React.useState(1);
  const [skip, setSkip] = React.useState(0);
  const nextStorie = () => {
    setSkip(skip + 1);
    setLimit(limit + 1);
  };
  const prevStorie = () => {
    if (skip > 0) {
      setSkip(skip - 1);
    }
    if (limit > 1) {
      setLimit(limit - 1);
    }
  };
  const addLike = async (id) => {
    try {
      const res = await axios.put(`/api/storie/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  const unLike = async (id) => {
    try {
      const res = await axios.put(`/api/storie/delete/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteStorie = async (id) => {
    try {
      await axios.delete(`/api/storie/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwt}`,
        },
      });
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Background image={image} />
      <ProfileImg>
        <Profile onClick={handleOpen} storie={storie} image={profile} />
      </ProfileImg>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {storie
            ? storie.slice(skip, limit).map((i) => {
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
                      {i.createdAt && (
                        <Typography>{format(i.createdAt)}</Typography>
                      )}
                      <>
                        <DeleteOutlineIcon
                          onClick={() => deleteStorie(i._id)}
                          style={{ cursor: "pointer" }}
                        />
                      </>
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
                    {storie.length > skip &&
                      skip !== 0 &&
                      storie.length > 1 && (
                        <Button onClick={prevStorie}>prev storie</Button>
                      )}
                    {storie.length > limit && storie.length > 1 && (
                      <Button onClick={nextStorie}>next storie</Button>
                    )}
                    <CardActions>
                      {i.like.filter((like) => like.likeBy === userId)[0] ? (
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
                    </CardActions>
                  </div>
                );
              })
            : "loading"}
          {/* <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
        </Box>
      </Modal>
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
  border: 5px solid ${(props) => (props.storie ? "#1237fd" : "white")};
  cursor: ${(props) => (props.storie ? "pointer" : "auto")};
  position: absolute;
  top: 320px;
`;

export default BackgroundImage;
