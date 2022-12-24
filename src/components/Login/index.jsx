import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginHandler } from "../../service/api.service";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [channelName, setChannelName] = useState("Test");

  const LoginHandler = async (name) => {
    const body = {
      name: name,
    };
    const response = await loginHandler(body);
    localStorage.setItem("id", response.data.id);
    if (response.data.id) {
      navigate("/Home", {
        state: {
          uuid: response.data.userUuid,
          name: name,
          channel: channelName,
        },
      });
    }
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <Box
        style={{
          border: "1px solid black",
          height: "350px",
          width: "450px",
          textAlign: "center",
          justifyContent: "center",
          background: "aliceblue",
          display: "flex",
          alignItems: "center",
          flexDirection: "inherit",
        }}
      >
        <Typography variant="h6" component="h6">
          Please Enter Details
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "inherit",
            height: "200px",
            justifyContent: "space-evenly",
            width: "267px",
            textAlign: "center",
          }}
        >
          <TextField
            id="standard-basic"
            label="User Name"
            variant="standard"
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            id="standard-basic"
            label="Channel Name"
            variant="standard"
            value="Test"
            disabled
            onChange={(e) => setChannelName(e.target.value)}
          />
          <Button variant="contained" onClick={() => LoginHandler(name)}>
            Login
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}

export default Login;
