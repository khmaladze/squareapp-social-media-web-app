import React from "react";
import styled from "styled-components";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

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

const BackgroundImage = ({ image, profile, storie }) => {
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
                  <>
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
                    {storie.length > limit && storie.length > 1 && (
                      <Button onClick={nextStorie}>next storie</Button>
                    )}
                    {storie.length > skip &&
                      skip !== 0 &&
                      storie.length > 1 && (
                        <Button onClick={prevStorie}>prev storie</Button>
                      )}
                  </>
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
