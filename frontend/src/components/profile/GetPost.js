import React from "react";
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

const GetPost = ({ data, jwt, onAdd }) => {
  const deletePost = async (id) => {
    try {
      const res = await axios.delete(`/api/post/delete/${id}`, {
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
      {data
        ? data.map((item) => {
            return (
              <Main key={item._id}>
                <Card mt={2} sx={{ maxWidth: 745, width: 745 }}>
                  {item.image && (
                    <img
                      style={{
                        marginBottom: "20px",
                        maxHeight: "500px",
                        width: "100%",
                      }}
                      src={item.image}
                      alt="just file"
                    />
                  )}
                  {item.video && (
                    <Video>
                      <video controls>
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
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
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
  padding-top: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 25px;
  margin: 0 auto;
`;

const Video = styled.div`
  video {
    height: 100%;
    width: 100%;
  }
`;

export default GetPost;
