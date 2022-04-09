import React, { useState } from "react";
import styled from "styled-components";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Import the plugin code
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import TextField from "@mui/material/TextField";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);
const AddStorie = ({ jwt, onAdd }) => {
  const [text, setText] = useState("");
  const [privacy, setPrivacy] = useState("onlyMe");
  const [image, setImage] = useState("");
  const [video, setVideo] = useState("");
  const uploadImage = async () => {
    try {
      const data = new FormData();
      data.append("file", image[0].file);
      data.append("upload_preset", "dfgjapGJOIJDFOAISJDASPIDOasdsdl");
      data.append(
        "cloud_name",
        "asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h"
      );
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/image/upload",
        data
      );
      return res.data.secure_url;
    } catch (error) {
      console.log(error);
    }
  };

  const uploadVideo = async () => {
    try {
      const data = new FormData();
      data.append("file", video[0].file);
      data.append("upload_preset", "dfgjapGJOIJDFOAISJDASPIDOasdsdl");
      data.append(
        "cloud_name",
        "asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h"
      );
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/asfjaisfjpashfa9hf9aphf9wa8dhfp8awhdasihfpa9h/video/upload",
        data
      );
      return res.data.secure_url;
    } catch (error) {
      console.log(error);
    }
  };

  const createStorie = async () => {
    try {
      let postCreate = {};
      if (text) {
        postCreate.text = text;
      }

      if (image) {
        postCreate.image = await uploadImage();
      }

      if (video) {
        postCreate.video = await uploadVideo();
      }

      if (privacy) {
        postCreate.privacy = privacy;
      }

      const res = await axios.post("/api/storie/add", postCreate, {
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwt}`,
        },
      });
      if (res.data.success) {
        setText("");
        setImage("");
        setVideo("");
        setPrivacy("onlyMe");
        toast.success(res.data.message);
        return onAdd();
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <ToastContainer />
      <Main>
        <Card sx={{ maxWidth: 745, width: 745 }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Create Storie
              <h4>Emojies: 😀 ❤️ 💚 🍓 🎮</h4>
              <p style={{ fontSize: "15px", color: "grey" }}>
                you can simply copy emoji if you want
              </p>
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="Text"
                  label="Text "
                  name="Text"
                  autoComplete="Text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Grid>
            </Typography>
          </CardContent>
          <Grid item xs={12}>
            <h4>Upload Image</h4>
            <FilePond
              files={image}
              allowMultiple={false}
              maxFiles={1}
              onupdatefiles={setImage}
              acceptedFileTypes={["image/*"]}
              name="files"
              labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
            />
          </Grid>
          <Grid item xs={12}>
            <h4>Upload Video</h4>
            <FilePond
              files={video}
              allowMultiple={false}
              maxFiles={1}
              onupdatefiles={setVideo}
              acceptedFileTypes={["video/*"]}
              name="files"
              labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">privacy</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="privacy"
                label="privacy"
                value={privacy}
                onChange={(e) => setPrivacy(e.target.value)}
              >
                <MenuItem value={"onlyMe"}>onlyMe</MenuItem>
                <MenuItem value={"friends"}>friends</MenuItem>
                <MenuItem value={"public"}>public</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <CardActions>
            <Center>
              <Button size="medium" onClick={createStorie}>
                Create Storie
              </Button>
            </Center>
          </CardActions>
        </Card>
      </Main>
    </>
  );
};

export default AddStorie;

const Main = styled.div`
  width: 100%;
  min-height: 300px;
  height: 100%;
  margin-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
