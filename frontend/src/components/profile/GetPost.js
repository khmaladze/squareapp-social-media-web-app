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
    <>
      {data
        ? data.map((item) => {
            return (
              <Main key={item._id}>
                <Card
                  mt={2}
                  mb={2}
                  sx={{ maxWidth: 745, width: 745, marginTop: "20px" }}
                >
                  {item.image && (
                    <img
                      style={{
                        marginBottom: "20px",
                        maxHeight: "500px",
                        height: "100%",
                        width: "100%",
                      }}
                      src={item.image}
                      alt="just file"
                    />
                  )}
                  {item.video && (
                    <Video>
                      <video controls controlsList="nodownload">
                        <source src={item.video}></source>
                      </video>
                    </Video>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "99%",
                      paddingTop: "10px",
                      margin: "0 auto",
                    }}
                  >
                    <>
                      {item.createdAt && (
                        <Typography gutterBottom variant="p" component="div">
                          created: {format(item.createdAt)}
                        </Typography>
                      )}
                      {item.updatedAt !== item.createdAt && (
                        <Typography gutterBottom variant="p" component="div">
                          updated: {format(item.updatedAt)}
                        </Typography>
                      )}
                    </>
                    <div onClick={() => deletePost(item._id)}>
                      <DeleteOutlineIcon style={{ cursor: "pointer" }} />
                    </div>
                  </div>
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
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => unLike(item._id)}
                      >
                        {item.like.length}
                        <FavoriteIcon />
                      </div>
                    ) : (
                      <div
                        style={{ color: "red", cursor: "pointer" }}
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
                      <Grid item xs={12}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "95%",
                            margin: "0 auto",
                          }}
                        >
                          <Typography>{comment.comment}</Typography>
                          <div
                            style={{ cursor: "pointer" }}
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
    </>
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
    max-height: 700px;
    width: 100%;
  }
`;

export default GetPost;
