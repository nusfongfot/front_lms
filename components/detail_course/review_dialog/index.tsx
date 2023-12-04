import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Avatar, Box, Divider, Grid, Rating, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { filterStarAPIOfCourse, getReviewOfCourseAPI } from "@/api/reviews";
import { errorToast } from "@/utils/notification";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
  handleCloseReview: () => void;
  openReview: boolean;
};

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const informationStar = [
  { id: 1, title: "5 star", value: 5 },
  { id: 2, title: "4 star", value: 4 },
  { id: 3, title: "3 star", value: 3 },
  { id: 4, title: "2 star", value: 2 },
  { id: 5, title: "1 star", value: 1 },
];

export default function ReviewDialog({ handleCloseReview, openReview }: Props) {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(0);
  const findTotal = reviews.reduce((acc, val) => {
    const total = val.star + acc;
    return total;
  }, 0);
  const handleClickStarReview = async (rating: number) => {
    const courseId = router?.query?.subpath as string;
    try {
      const res = await filterStarAPIOfCourse(courseId, rating);
      setReviews(res.data);
      setRating(rating);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (openReview) {
          const res = await getReviewOfCourseAPI(
            router?.query?.subpath as string
          );
          setReviews(res.data);
        }
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
      }
    })();
  }, [openReview]);

  return (
    <BootstrapDialog
      onClose={handleCloseReview}
      aria-labelledby="customized-dialog-title"
      open={openReview}
      maxWidth="xl"
      sx={{ overflow: "auto" }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Stack flexDirection={"row"} alignItems={"center"} gap={1}>
          <StarIcon sx={{ color: "#faaf00", fontSize: 40 }} />
          <Typography variant="h5">Course Points</Typography>
          <Typography variant="h5">
            {isNaN(Math.round(findTotal / reviews.length))
              ? "0 points"
              : Math.round(findTotal / reviews.length) + " points"}
          </Typography>
        </Stack>
      </DialogTitle>

      <IconButton
        aria-label="close"
        onClick={handleCloseReview}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ p: 2, width: 1000 }}>
        <Grid container>
          <Grid item xs={12} sm={3}>
            {informationStar.map((item) => (
              <Stack
                flexDirection={"row"}
                alignItems={"center"}
                gap={1}
                key={item.id}
              >
                <Rating
                  name="simple-controlled"
                  defaultValue={item.value}
                  readOnly
                />
                <Typography
                  sx={{
                    color: rating == item.value ? "#d0c6f1" : "#5624d0",
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClickStarReview(item.value)}
                >
                  {item.title}
                </Typography>
              </Stack>
            ))}
          </Grid>
          <Grid item xs={12} sm={9}>
            {reviews.length == 0 ? (
              <Typography>Not review yet.</Typography>
            ) : (
              reviews.map((item) => (
                <Box key={item.id}>
                  <Stack flexDirection={"row"} gap={2}>
                    <Avatar />
                    <Box>
                      <Typography>{`${item.user.name}.`}</Typography>
                      <Stack flexDirection={"row"} gap={1}>
                        <Rating
                          name="simple-controlled"
                          defaultValue={item.star}
                          size="small"
                          readOnly
                        />
                        <Typography>
                          {/* {dayjs(item.createdAt).format("YYYY-MM-DD")} */}
                          {dayjs(item.createdAt).fromNow()}
                        </Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Typography>{item.content}</Typography>
                  <Divider sx={{ mt: 2, mb: 2 }} />
                </Box>
              ))
            )}
          </Grid>
        </Grid>
      </Box>
    </BootstrapDialog>
  );
}
