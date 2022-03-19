import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
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

export const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState("");

  const registerUser = async () => {
    try {
      if (
        firstName &&
        lastName &&
        userName &&
        gender &&
        birthDate &&
        email &&
        password &&
        confirmPassword &&
        agree
      ) {
        const postData = {
          firstName,
          lastName,
          userName,
          gender,
          birthDate,
          email,
          password,
          confirmPassword,
        };
        const res = await axios.post("/api/auth/register", postData);
        console.log(res);
        console.log(postData);
        if (res.data.success) {
          toast(res.data.message);
          navigate("/login");
        }
      } else {
        toast("add all the fields");
      }
    } catch (error) {
      if (error && error.response && error.response.data) {
        toast(error.response.data.message);
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
        <img src="/assets/logo.png" />
        <Typography mb={2} component="h1" variant="h1">
          Register
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
            <FormControl required fullWidth>
              <InputLabel id="demo-simple-select-label">Gender</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="gender"
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value={"male"}>Male</MenuItem>
                <MenuItem value={"female"}>Female</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="date"
              label="Birthday"
              type="date"
              fullWidth
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  value={agree}
                  onChange={() => setAgree(true)}
                  color="primary"
                />
              }
              label="I Agree Privacy Terms And Agreements."
            />
          </Grid>
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => registerUser()}
        >
          REGISTER
        </Button>
        <Grid mb={2} container justifyContent="flex-end">
          <Grid item>
            <Link onClick={() => navigate("/login")} variant="body2">
              Already have an account? Log In
            </Link>
          </Grid>
        </Grid>
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
