import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async () => {
    try {
      if (email && password) {
        const postData = {
          email,
          password,
        };
        const res = await axios.post("/api/auth/login", postData);
        if (res.data.success) {
          toast(res.data.message);
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
        </Grid>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => loginUser()}
        >
          LOGIN
        </Button>
        <Grid mb={2} container justifyContent="flex-end">
          <Grid item>
            <Link onClick={() => navigate("/")} variant="body2">
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
