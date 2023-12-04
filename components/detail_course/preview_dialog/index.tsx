import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, IconButton, Typography, styled } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ReactPlayer from "react-player";

type Props = {
  handleClose: () => void;
  open: boolean;
  course: any;
  lessons: any[];
};
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
export default function PreviewDialog({
  handleClose,
  open,
  course,
  lessons,
}: Props) {
  const [preview, setPreview] = React.useState("");
  const [isShow, setIsShow] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const handleClickPreview = (item: any) => {
    setPreview(item.video);
    setIsShow(true);
    setActive(item.id);
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="xl"
        sx={{ overflowY: "scroll" }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Free Preview
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            handleClose();
            setIsShow(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ width: 800, p: 2 }}>
          {isShow ? (
            <ReactPlayer
              url={preview}
              width={"770px"}
              height={"300px"}
              controls={isShow}
            />
          ) : (
            <Typography align="center" variant="h4" height={"300px"}>
              Choose Video To See
            </Typography>
          )}
          {lessons
            .filter((item: any) => item.free_preview)
            .map((item: any) => (
              <Box key={item.id}>
                <Box
                  sx={{
                    background: active == item.id ? "blue" : "black",
                    color: "white",
                    mb: 1,
                    p: 2,
                    mt: 2,
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickPreview(item)}
                >
                  <Typography variant="h5">{item.name}</Typography>
                </Box>
              </Box>
            ))}
        </Box>
      </BootstrapDialog>
    </React.Fragment>
  );
}
