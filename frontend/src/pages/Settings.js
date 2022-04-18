import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../features/auth";

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
// Register the plugins
registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileValidateType
);
const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.value.user);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [userName, setUsername] = useState(user.userName);
  const [place, setPlace] = useState(user.place);
  const [biography, setBiography] = useState(user.biography);
  const [hobby, setHobby] = useState(user.hobby);
  const [profileImage, setProfileImage] = useState(user.profileImage);
  const [backgroundImage, setBackgroundImage] = useState(user.backgroundImage);
  const uploadProfileImage = async () => {
    try {
      const data = new FormData();
      data.append("file", profileImage[0].file);
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
  const uploadBackgroundImage = async () => {
    try {
      const data = new FormData();
      data.append("file", backgroundImage[0].file);
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
  const updateUser = async () => {
    try {
      if (firstName && lastName && userName) {
        let postData = {
          firstName,
          lastName,
          userName,
          biography,
          token: user.token,
        };
        if (place) {
          postData.place = place;
        }
        if (hobby) {
          postData.hobby = hobby;
        }
        if (profileImage) {
          postData.profileImage = await uploadProfileImage();
        }
        if (backgroundImage) {
          postData.backgroundImage = await uploadBackgroundImage();
        }
        const res = await axios.put("/api/user/update", postData, {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
        });
        if (res.data.success == false) {
          toast.error(res.data.message);
        }
        if (res.data.success == true) {
          const getUser = res.data.user;
          const getUserToken = res.data.token;
          toast.success(res.data.message);
          localStorage.setItem(
            "user",
            JSON.stringify({
              _id: getUser._id,
              firstName: getUser.firstName,
              lastName: getUser.lastName,
              userName: getUser.userName,
              biography: getUser.biography,
              gender: getUser.gender,
              friends: getUser.friends,
              place: getUser.place,
              hobby: getUser.hobby,
              profileImage: getUser.profileImage,
              backgroundImage: getUser.backgroundImage,
              birthDate: getUser.birthDate,
              email: getUser.email,
              createdAt: getUser.createdAt,
              updatedAt: getUser.updatedAt,
              token: getUserToken,
            })
          );
          dispatch(
            add({
              _id: getUser._id,
              firstName: getUser.firstName,
              lastName: getUser.lastName,
              userName: getUser.userName,
              biography: getUser.biography,
              gender: getUser.gender,
              friends: getUser.friends,
              place: getUser.place,
              hobby: getUser.hobby,
              profileImage: getUser.profileImage,
              backgroundImage: getUser.backgroundImage,
              birthDate: getUser.birthDate,
              email: getUser.email,
              createdAt: getUser.createdAt,
              updatedAt: getUser.updatedAt,
              token: getUserToken,
            })
          );
          setTimeout(() => {
            window.location.reload();
            navigate("/profile");
          }, 1000);
          navigate("/profile");
        }
      } else {
        toast("add all the fields");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast.error(error.response.data.message);
      }
    }
  };

  return (
    <Main>
      <ToastContainer />
      <CssBaseline />
      <Form>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          style={{ width: "100%", marginBottom: "20px" }}
        >
          GO BACK
        </Button>
        <Typography mb={2} component="h1" variant="h1">
          settings
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="given-name"
              name="firstName"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoFocus
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="username"
              label="username"
              name="username"
              autoComplete="username"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="place"
              label="place"
              name="place"
              autoComplete="place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="biography"
              label="biography"
              name="biography"
              autoComplete="biography"
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl required fullWidth>
              <InputLabel id="demo-simple-select-label">hobby</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="hobby"
                label="hobby"
                value={hobby}
                onChange={(e) => setHobby(e.target.value)}
              >
                <MenuItem value={hobby}>{hobby}</MenuItem>
                <MenuItem value={"Sailing"}>Sailing</MenuItem>
                <MenuItem value={"DownhillSkiing"}>DownhillSkiing</MenuItem>
                <MenuItem value={"IceSkating"}>IceSkating</MenuItem>
                <MenuItem value={"Snowboarding"}>Snowboarding</MenuItem>
                <MenuItem value={"Pool"}>Pool</MenuItem>
                <MenuItem value={"Skateboarding"}>Skateboarding</MenuItem>
                <MenuItem value={"SportsEsports"}>SportsEsports</MenuItem>
                <MenuItem value={"SportsMartialArts"}>
                  SportsMartialArts
                </MenuItem>
                <MenuItem value={"Surfing"}>Surfing</MenuItem>
                <MenuItem value={"FitnessCenter"}>FitnessCenter</MenuItem>
                <MenuItem value={"GolfCourse"}>GolfCourse</MenuItem>
                <MenuItem value={"Sport"}>Sport</MenuItem>
                <MenuItem value={"SportsBaseball"}>SportsBaseball</MenuItem>
                <MenuItem value={"SportsHandball"}>SportsHandball</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <h4>Upload Profile Image</h4>
            <FilePond
              files={profileImage}
              allowMultiple={false}
              maxFiles={1}
              onupdatefiles={setProfileImage}
              acceptedFileTypes={["image/*"]}
              name="files"
              labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
            />
          </Grid>
          <Grid item xs={12}>
            <h4>Upload Profile Background Image</h4>
            <FilePond
              files={backgroundImage}
              allowMultiple={false}
              maxFiles={1}
              onupdatefiles={setBackgroundImage}
              acceptedFileTypes={["image/*"]}
              name="files"
              labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => updateUser()}
        >
          UPDATE
        </Button>
      </Form>
    </Main>
  );
};

const Main = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.div`
  width: 350px;
`;

export default Settings;
