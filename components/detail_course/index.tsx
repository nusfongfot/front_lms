import {
  freeEnrollmentCourseAPI,
  getCourseBrowseByIdAPI,
  getCourseByIdAPI,
  paidStripeCourseAPI,
} from "@/api/course";
import { errorToast, successToast } from "@/utils/notification";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  duration,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PreviewDialog from "./preview_dialog";
import dynamic from "next/dynamic";
import useInfo from "@/zustand/auth";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import ReactPlayer from "react-player";
import ReviewDialog from "./review_dialog";
import { loadStripe } from "@stripe/stripe-js";
import { useLoading } from "@/zustand/loading";

type Props = {};
function DetailCourse({}: Props) {
  const router = useRouter();
  const { accInfo } = useInfo();
  const { setLoading } = useLoading();
  const [course, setCourse] = useState<any>({});
  const [lessons, setLessons] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [openReview, setOpenReview] = useState(false);

  const [videoDurations, setVideoDurations] = useState<any>({});
  const totalMinutes: any = Object.values(videoDurations).reduce(
    (total: any, duration: any) => total + duration,
    0
  );
  const totalHour = (totalMinutes / 60).toFixed(2);

  const handleDuration = (duration: number, item: any) => {
    const id = item.id;
    const durationInMinutes = Math.floor(duration / 60);
    setVideoDurations((prev: any) => ({
      ...prev,
      [id]: durationInMinutes,
    }));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenReview = () => {
    setOpenReview(true);
  };
  const handleCloseReview = () => {
    setOpenReview(false);
  };

  const handlePaidByStripe = async () => {
    setLoading(true);
    try {
      // loadStripe
      const res = await paidStripeCourseAPI(router?.query?.subpath as string);
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string
      );
      stripe?.redirectToCheckout({ sessionId: res.data });
    } catch (error: any) {
      errorToast("Enrollment failed, please try again", 2000);
    }
    setLoading(false);
  };

  const handleEnrollMent = async () => {
    try {
      const res = await freeEnrollmentCourseAPI(
        router?.query?.subpath as string
      );
      successToast(res.message, 2000);
      router.replace(`/user/course/${router?.query?.subpath}`);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (router?.query?.subpath) {
          const res = await getCourseBrowseByIdAPI(
            router?.query?.subpath as string
          );
          setLessons(res.lessons);
          setCourse(res.data);
        }
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
        router.push("/courses/search");
      }
      setLoading(false);
    })();
  }, [router?.query?.subpath]);

  return (
    <Box>
      <Grid
        container
        sx={{
          background:
            " linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 5%, rgba(0,212,255,1) 60%);",
          width: "100%",
          height: "auto",
          p: 2,
          color: "white",
        }}
      >
        <Grid item xs={12} md={9}>
          <Stack
            justifyContent={"space-between"}
            flexDirection={"column"}
            height={180}
          >
            <Typography variant='h4'>{course.name}</Typography>
            <Typography>by {course?.user?.name}</Typography>
            <Typography variant='h5'>
              {course.price == 0 ? "Free" : `${course.price} $`}
            </Typography>
            <Typography>Last updated 10/2566</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack flexDirection={"column"} alignItems={"center"}>
            <img
              src={course.image}
              style={{
                width: "100%",
                height: 160,
                objectFit: "contain",
                cursor: "pointer",
              }}
              onClick={handleClickOpen}
            />
            <Typography fontWeight={900} variant='h6'>
              Preview this course
            </Typography>
            {!accInfo.id ? (
              <Button
                variant='contained'
                fullWidth
                size='small'
                color='warning'
                onClick={() => router.push("/signin")}
              >
                Login to enroll
              </Button>
            ) : accInfo?.courses?.find(
                (item: any) => item.id == router.query.subpath
              ) ? (
              <Button
                color='success'
                variant='contained'
                size='small'
                fullWidth
                sx={{ mt: 1 }}
                onClick={() =>
                  router.replace(`/user/course/${router.query.subpath}`)
                }
              >
                View Course
              </Button>
            ) : course.price == 0 ? (
              <Button
                color='success'
                variant='contained'
                size='small'
                fullWidth
                sx={{ mt: 1 }}
                onClick={handleEnrollMent}
              >
                Free Enroll
              </Button>
            ) : (
              course.price != 0 && (
                <Button
                  color='success'
                  variant='contained'
                  size='small'
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={handlePaidByStripe}
                >
                  Enroll
                </Button>
              )
            )}
          </Stack>
        </Grid>
      </Grid>

      <Paper sx={{ p: 2, mt: 2, border: "1px solid #d1d7dc" }}>
        <Typography variant='h5' fontWeight={700}>
          What you'll learn?
        </Typography>
        <ReactQuill
          value={course?.description}
          readOnly={true}
          theme={"bubble"}
        />
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Button variant='outlined' size='small' onClick={handleClickOpenReview}>
          See All Review
        </Button>
        <Stack flexDirection={"row"} justifyContent={"space-between"} mt={2}>
          <Typography variant='h5'>{lessons.length | 0} Lesson</Typography>
          <Typography variant='h5'>{`Total ${totalHour} Hours`}</Typography>
        </Stack>
        {lessons.map((item: any, i: any) => (
          <Box key={i} mt={2}>
            <ReactPlayer
              url={[item.video]}
              style={{ display: "none" }}
              controls
              onDuration={(duration) => handleDuration(duration, item)}
            />
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                gap={2}
              >
                <Stack
                  sx={{
                    background: "grey",
                    width: 40,
                    height: 40,
                    color: "white",
                    borderRadius: "50%",
                  }}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Typography variant='h5'>{i + 1}</Typography>
                </Stack>
                <Stack>
                  <Typography variant='h5'>{item.name}</Typography>
                  <Typography variant='subtitle2'>{item.content}</Typography>
                </Stack>
              </Stack>
              <Typography variant='h5'>
                {!!videoDurations[item.id]
                  ? `${videoDurations[item.id]} minutes`
                  : `0 minutes`}
              </Typography>
            </Stack>

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>

      <PreviewDialog
        handleClose={handleClose}
        open={open}
        course={course}
        lessons={lessons}
      />
      <ReviewDialog
        handleCloseReview={handleCloseReview}
        openReview={openReview}
      />
    </Box>
  );
}
export default DetailCourse;
