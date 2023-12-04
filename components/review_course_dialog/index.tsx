import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Rating, TextField, Typography, styled } from "@mui/material";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { errorToast, successToast } from "@/utils/notification";
import { createReviewAPI } from "@/api/reviews";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useInfo from "@/zustand/auth";

type Props = {
  openReview: boolean;
  setOpenReview: React.Dispatch<React.SetStateAction<boolean>>;
  course: any;
};

export default function ReviewCouseUserDiaolog({
  setOpenReview,
  openReview,
  course,
}: Props) {
  const { accInfo } = useInfo()
  const [starValue, setStarValue] = useState<number>(1);  
  const [detail, setDetail] = useState("");
  const [loadingBtn, setLoadingBtn] = useState(false);
  const courseId = course?.lessions?.map((item: any) => item.courseId)[0];

  const handleClickReview = async () => {
    setLoadingBtn(true);
    try {
      const body = {
        userId: accInfo.id,
        courseId: courseId,
        star: starValue,
        content: detail,
      };
      const res = await createReviewAPI(body);
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoadingBtn(false);
      setOpenReview(false);
      setDetail("");
      setStarValue(1);
    }
  };
  
  return (
    <Dialog
      open={openReview}
      onClose={() => setOpenReview(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Review Course"}</DialogTitle>
      <Box sx={{ width: 600, p: 2 }}>
        <Box>
          <Typography mb={1}>Choose Star</Typography>
          <Rating
            defaultValue={1}
            value={starValue}
            onChange={(e, newValue: number | null) => setStarValue(newValue || 0)}
          />
          <Typography mt={2}>Detail</Typography>
          <TextField
            size="small"
            multiline
            maxRows={5}
            fullWidth
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
          />
        </Box>
      </Box>
      <DialogActions>
        <Button
          onClick={() => setOpenReview(false)}
          variant="contained"
          size="small"
          color="error"
        >
          cancel
        </Button>
        <LoadingButton
          loading={loadingBtn}
          loadingPosition="start"
          startIcon={<AddCircleIcon />}
          variant="contained"
          size="small"
          onClick={handleClickReview}
        >
          Review
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
