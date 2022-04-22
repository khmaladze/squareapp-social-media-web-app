import React, { useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import PeopleIcon from "@mui/icons-material/People";

const Post = () => {
  const user = useSelector((state) => state.auth.value.user);
  const jwt = useSelector((state) => state.auth.value.user.token);
  const userId = useSelector((state) => state.auth.value.user._id);
  const [data, setData] = useState("");
  const navigate = useNavigate();
  const getData = async (ourRequest) => {
    try {
      const res = await axios.get("/api/post/friend", {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${user.token}`,
        },
        cancelToken: ourRequest.token,
      });
      // console.log(res);
      setData(res.data.post);
    } catch (error) {
      // console.log(error);
    }
  };
  useEffect(() => {
    const ourRequest = axios.CancelToken.source(); // <-- 1st step

    getData(ourRequest);
    return () => {
      ourRequest.cancel();
    };
  }, []);
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
      return getData();
    } catch (error) {
      // console.log(error);
    }
  };
  const deleteComment = async (id, postId) => {
    // console.log(postId);
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
      return getData();
    } catch (error) {
      // console.log(error);
    }
  };

  const addLike = async (id) => {
    try {
      const res = await axios.put(`/api/post/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
      return getData();
    } catch (error) {
      // console.log(error);
    }
  };

  const unLike = async (id) => {
    try {
      const res = await axios.put(`/api/post/delete/like/${id}`, "", {
        headers: {
          authorization: `Bearer ${jwt}`,
        },
      });
      return getData();
    } catch (error) {
      // console.log(error);
    }
  };

  const viewProfile = (id) => {
    // console.log(id);
    if (id) {
      return navigate(`/profile/${id}`);
    }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
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
                        onClick={() => viewProfile(item.postedBy._id)}
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
                              : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
                          })`,
                          cursor: "pointer",
                        }}
                      ></div>
                    }
                    action={
                      <IconButton aria-label="settings">
                        {item.privacy == "public" ? (
                          <PublicIcon />
                        ) : (
                          <PeopleIcon />
                        )}
                      </IconButton>
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
                              onClick={() =>
                                viewProfile(
                                  item.postedBy._id,
                                  item.postedBy._id == userId
                                )
                              }
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
                                    : "https://res.cloudinary.com/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload/v1650180561/ben-sweet-2LowviVHZ-E-unsplash_sjlgle.jpg"
                                })`,
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                            ></div>
                            <h4>{comment.comment}</h4>
                          </div>
                          {comment.date && (
                            <div style={{ display: "flex" }}>
                              <p style={{ marginLeft: "20px" }}>
                                {format(comment.date)}
                              </p>
                              {comment.commentBy._id == userId && (
                                <div
                                  style={{ cursor: "pointer", width: "5%" }}
                                  onClick={() =>
                                    deleteComment(comment._id, item._id)
                                  }
                                >
                                  <DeleteOutlineIcon />
                                </div>
                              )}
                            </div>
                          )}
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

export default Post;
