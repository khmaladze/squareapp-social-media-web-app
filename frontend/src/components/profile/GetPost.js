import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
// import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import styled from "styled-components";
import { format } from "timeago.js";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddCommentIcon from "@mui/icons-material/AddComment";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import CardHeader from "@mui/material/CardHeader";

const GetPost = ({ data, jwt, userId, onAdd }) => {
  const [addComment, setAddComment] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [comment, setComment] = useState("");
  const openPostComment = (id) => {
    setAddComment(!addComment);
    setCommentId(id);
  };
  const addPostComment = async (id) => {
    try {
      setAddComment(!addComment);
      const res = await axios.put(
        "/api/post/comment",
        {
          comment,
          postId: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`,
          },
        }
      );
      setComment("");
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  const deleteComment = async (id, postId) => {
    console.log(postId);
    try {
      await axios.put(
        `/api/post/delete/comment/${id}`,
        { postId },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwt}`,
          },
        }
      );
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  const deletePost = async (id) => {
    try {
      await axios.delete(`/api/post/delete/${id}`, {
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
  const addLike = async (id) => {
    try {
      const res = await axios.put(`/api/post/like/${id}`, "", {
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
      const res = await axios.put(`/api/post/delete/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
      return onAdd();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {data
        ? data.map((item) => {
            return (
              <Main key={item._id}>
                <Card
                  mt={2}
                  mb={2}
                  sx={{
                    maxWidth: 745,
                    width: 745,
                    marginTop: "20px",
                    marginBottom: "30px",
                  }}
                >
                  <CardHeader
                    avatar={
                      <div
                        style={{
                          height: "50px",
                          width: "50px",
                          borderRadius: "50%",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                          backgroundImage: `url(${
                            item.postedBy.profileImage
                              ? item.postedBy.profileImage
                              : "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
                          })`,
                        }}
                      ></div>
                    }
                    action={
                      // <IconButton aria-label="settings">
                      //   <MoreVertIcon />
                      // </IconButton>
                      <div
                        style={{
                          height: "58px",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          width: "100%",
                          // paddingTop: "10px",
                          margin: "0 auto",
                        }}
                      >
                        <>
                          {/* {item.createdAt && (
                        <Typography gutterBottom variant="p" component="div">
                          created: {format(item.createdAt)}
                        </Typography>
                      )} */}
                          {/* {item.updatedAt !== item.createdAt && (
                        <Typography gutterBottom variant="p" component="div">
                          updated: {format(item.updatedAt)}
                        </Typography>
                      )} */}
                        </>
                        <div
                          onClick={() => deletePost(item._id)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <DeleteOutlineIcon style={{ cursor: "pointer" }} />
                        </div>
                      </div>
                    }
                    title={
                      item.postedBy.firstName + " " + item.postedBy.lastName
                    }
                    subheader={format(item.createdAt)}
                  />
                  {item.image && (
                    <div
                      style={{
                        marginBottom: "20px",
                        maxHeight: "500px",
                        height: "100%",
                        minHeight: "500px",
                        width: "100%",
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundImage: `url(${item.image})`,
                      }}
                    ></div>
                  )}
                  {item.video && (
                    <Video>
                      <video controls controlsList="nodownload">
                        <source src={item.video}></source>
                      </video>
                    </Video>
                  )}
                  {item.text && (
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {item.text}
                      </Typography>
                    </CardContent>
                  )}
                  <CardActions>
                    {item.like.filter((like) => like.likeBy === userId)[0] ? (
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
                        onClick={() => unLike(item._id)}
                      >
                        {item.like.length}
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
                        onClick={() => addLike(item._id)}
                      >
                        {item.like.length}
                        <FavoriteBorderIcon />
                      </div>
                    )}
                    <Button size="small">
                      <AddCommentIcon
                        onClick={() => openPostComment(item._id)}
                      />
                    </Button>
                  </CardActions>
                  {commentId === item._id && addComment && (
                    <>
                      <Typography>add comment</Typography>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          id="Text"
                          label="Text"
                          name="Text"
                          autoComplete="Text"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </Grid>
                      <div
                        style={{
                          height: "50px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => addPostComment(item._id)}
                        >
                          add comment
                        </Button>
                      </div>
                    </>
                  )}
                  {item.comment.length >= 1 && (
                    <Typography gutterBottom variant="h5" component="div">
                      comments:
                    </Typography>
                  )}
                  {item.comment.slice(0, 2).map((comment) => {
                    return (
                      <Grid key={comment._id} item xs={12}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "99%",
                            margin: "0 auto",
                            borderTop: "1px solid",
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                width: "25px",
                                height: "25px",
                                borderRadius: "50%",
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                backgroundImage: `url(${
                                  comment.commentBy.profileImage
                                    ? comment.commentBy.profileImage
                                    : "https://images.unsplash.com/photo-1647163927506-399a13f9f908?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80"
                                })`,
                                marginRight: "10px",
                              }}
                            ></div>
                            <h4>{comment.comment}</h4>
                          </div>
                          {comment.date && (
                            <p style={{ marginLeft: "20px" }}>
                              {format(comment.date)}
                            </p>
                          )}
                          <div
                            style={{ cursor: "pointer", width: "5%" }}
                            onClick={() => deleteComment(comment._id, item._id)}
                          >
                            <DeleteOutlineIcon />
                          </div>
                        </div>
                      </Grid>
                    );
                  })}
                </Card>
              </Main>
            );
          })
        : "loading"}
    </div>
  );
};

const Main = styled.div`
  width: 95%;
  min-height: 300px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

const Video = styled.div`
  video {
    height: 100%;
    max-height: 550px;
    width: 100%;
  }
`;

export default GetPost;
