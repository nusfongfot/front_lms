import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Alert,
  Avatar,
  Button,
  FormControlLabel,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  NoSsr,
  Paper,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useRouter } from "next/router";
import { errorToast, successToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { deleteCookie } from "cookies-next";
import HomeIcon from "@mui/icons-material/Home";
import {
  createLessonOfCourseAPI,
  getCourseUserByIdAPI,
  getLessonCompleteOfUser,
} from "@/api/course";
import ReactPlayer from "react-player";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MyProcess from "@/components/process";
import useInfo from "@/zustand/auth";
import ReviewCouseUserDiaolog from "@/components/review_course_dialog";
import {
  createQuestionAPI,
  getAllQuestionsAPI,
  replyBackOfQuestionsAPI,
} from "@/api/questions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
const drawerWidth: number = 450;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    background: "black",
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const defaultTheme = createTheme();

export default function CourseUserPage() {
  const router = useRouter();
  const id = router?.query?.id?.toString();
  const { accInfo } = useInfo();
  const { setLoading } = useLoading();

  const [course, setCourse] = React.useState<any>({});
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [lessonComplete, setLessonCompleted] = React.useState<any[]>([]);

  const [preview, setPreview] = React.useState("");
  const [lessonId, setLessonId] = React.useState("");
  const [reply, setReply] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [played, setPlayed] = React.useState(0);
  const [quesId, setQuesId] = React.useState(0);
  const [openReview, setOpenReview] = React.useState(false);
  const [isAutoPlay, setIsAutoPlay] = React.useState(false);
  const [isAsk, setIsAsk] = React.useState(false);
  const [IsReply, setIsReply] = React.useState(false);
  const [isReview, setIsReview] = React.useState(true);

  const [valuesAsk, setValuesAsk] = React.useState({
    title: "",
    details: "",
  });
  const handleChangeValuesAsk = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValuesAsk((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogOut = async () => {
    deleteCookie("token");
    window.location.replace("/");
  };

  const handlePreviewVideo = (item: any) => {
    setPreview(item.video);
    setLessonId(item.id);
  };

  const handleIdMarkDone = async () => {
    const body: any = {
      courseId: Number(id),
      userId: accInfo.id,
      lessionId: Number(lessonId),
      completed: true,
    };
    const res = await createLessonOfCourseAPI(body);
    setLessonCompleted([...lessonComplete, res.data]);
  };

  const handleVideoEnded = () => {
    const findLess = lessonComplete.some((item) => item.lessionId == lessonId);
    if (!findLess) {
      handleIdMarkDone();
    }

    if (isAutoPlay) {
      const currentVideo = preview;
      const currentIndex = course.lessions.findIndex(
        (item: any) => item.video == currentVideo
      );
      const nextVideo = course.lessions.filter(
        (item: any, i: any) => currentIndex + 1 == i
      );
      const lastVideo = course.lessions.length - 1;
      if (currentIndex == lastVideo) {
        return;
      } else {
        setPreview(nextVideo[0].video);
        setLessonId(nextVideo[0].id)
      }
    }
  };

  const handleCreateQuestion = async () => {
    setLoading(true);
    try {
      const body = {
        courseId: Number(router.query.id),
        title: valuesAsk.title,
        details: valuesAsk.details,
      };

      await createQuestionAPI(body);
      successToast(
        "create question successfully just wait 10 minutes to see your question",
        4000
      );
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoading(false);
      setValuesAsk({
        title: "",
        details: "",
      });
      setIsAsk(false);
    }
  };

  const handleRowReply = (idQues: number) => {
    setIsReply(true);
    setQuesId(idQues);
    setReply("");
  };

  const handleReplyBack = async (idQues: number) => {
    try {
      const body = {
        courseId: Number(id),
        questionId: idQues,
        userId: accInfo.id,
        details: reply,
      };
      const res = await replyBackOfQuestionsAPI(body);
      const newRes = {
        ...res.data,
        user: {
          id: accInfo.id,
          name: accInfo.name,
          email: accInfo.email,
          picture: accInfo.picture,
        },
      };
      let newData = [...questions];
      const index = newData.findIndex((item) => item.id == idQues);
      newData[index].replies = [...newData[index].replies, newRes];
      setQuestions(newData);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setIsReply(false);
      setReply("");
    }
  };

  React.useEffect(() => {
    (async () => {
      try {
        if (id !== undefined) {
          const res = await getCourseUserByIdAPI(id);
          const data = await getAllQuestionsAPI(id);
          const lesson = await getLessonCompleteOfUser(id);
          setLessonCompleted(lesson.data);
          setQuestions(data.data);
          setCourse(res.data);
          setPreview(res.data.lessions[0].video);
          setLessonId(res.data.lessions[0].id);
        }
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
        router.replace("/");
      }
    })();
  }, [router?.query?.id]);
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position='absolute' open={open} sx={{ background: "black" }}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1, textTransform: "capitalize" }}
            >
              {course.name}
            </Typography>
            {isReview && (
              <Button
                variant='text'
                sx={{ color: "white" }}
                onClick={() => setOpenReview(true)}
              >
                Review Course
              </Button>
            )}
            <Box>
              <MyProcess course={course} lessonComplete={lessonComplete} />
            </Box>
            {auth && (
              <div>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                >
                  <Avatar src={accInfo.picture || ""} />
                </IconButton>
                <Menu
                  id='menu-appbar'
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      router.push("/profile/settings");
                    }}
                  >
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [1],
              background: "black",
              color: "white",
            }}
          >
            <Typography variant='h5'>Course content </Typography>
            <IconButton
              onClick={() => router.push("/profile/mycourses")}
              sx={{ color: "white" }}
            >
              <HomeIcon />
            </IconButton>
          </Toolbar>

          <Divider />

          <List>
            {course?.lessions?.map((item: any) => (
              <ListItem
                sx={{
                  background: preview == item.video ? "#FA8232" : "",
                  cursor: "pointer",
                }}
                key={item.id}
                onClick={() => {
                  handlePreviewVideo(item);
                }}
              >
                <Stack
                  flexDirection={"row"}
                  gap={1}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  sx={{ width: "100%" }}
                >
                  <ListItemText
                    sx={{
                      color: router.query.lesson == item.id ? "white" : "white",
                      fontWeight: 900,
                      whiteSpace: "initial",
                      zIndex: 10,
                    }}
                  >
                    {item.name}
                  </ListItemText>

                  {lessonComplete.filter((val) => val.lessionId == item.id)
                    .length == 0 ? (
                    <CancelIcon sx={{ color: "red" }} />
                  ) : (
                    lessonComplete
                      .filter((val) => val.lessionId == item.id)
                      .map((item) => (
                        <CheckCircleIcon
                          sx={{ color: "green" }}
                          key={item.id}
                        />
                      ))
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component='main'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth='xl' sx={{ mt: 4 }}>
            <Grid container>
              <Grid item xs={12}>
                <Box>
                  {!lessonComplete.some((val) => val.lessionId == lessonId) ? (
                    <Alert
                      severity='error'
                      onClick={() => handleIdMarkDone()}
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      Mark Complete
                    </Alert>
                  ) : (
                    <Alert
                      sx={{
                        background: "rgba(41, 235, 128, 0.9)",
                        mb: 1,
                        cursor: "pointer",
                      }}
                    >
                      Completed
                    </Alert>
                  )}

                  <Box>
                    <NoSsr>
                      <ReactPlayer
                        url={preview}
                        width={"100%"}
                        height={"400px"}
                        controls={true}
                        volume={0.1}
                        onProgress={(e) => setPlayed(e.loadedSeconds)}
                        onEnded={handleVideoEnded}
                      />
                    </NoSsr>
                    <Box mt={5}>
                      <FormControlLabel
                        control={
                          <Switch
                            value={isAutoPlay}
                            onChange={(e) => setIsAutoPlay(e.target.checked)}
                          />
                        }
                        label='AutoPlay'
                      />

                      <Typography variant='h4'>Q&A</Typography>
                      <Typography variant='h5' sx={{ mt: 2 }}>
                        {`All questions in this course (${questions.length})`}
                      </Typography>
                      <Box mt={3} mb={3}>
                        <Button
                          variant='text'
                          onClick={() => setIsAsk((prev) => !prev)}
                        >
                          Ask a new question
                        </Button>
                        {isAsk && (
                          <Box>
                            <Typography variant='h6'>Title</Typography>
                            <TextField
                              size='small'
                              sx={{ width: 600 }}
                              name='title'
                              value={valuesAsk.title}
                              onChange={handleChangeValuesAsk}
                            />
                            <Typography variant='h6'>Detail</Typography>
                            <TextField
                              multiline
                              maxRows={6}
                              size='small'
                              sx={{ width: 600 }}
                              name='details'
                              value={valuesAsk.details}
                              onChange={handleChangeValuesAsk}
                            />
                            <Box sx={{ mt: 2 }}>
                              <Button
                                size='small'
                                variant='contained'
                                sx={{ width: 250 }}
                                onClick={handleCreateQuestion}
                              >
                                Submit
                              </Button>
                            </Box>
                          </Box>
                        )}
                      </Box>
                      {questions.map((item) => (
                        <Paper sx={{ p: 2, mb: 2 }} key={item.id}>
                          <Stack flexDirection={"row"} gap={2} mt={3}>
                            <Avatar
                              src={item.user.picture || ""}
                              sx={{ width: 50, height: 50 }}
                            />
                            <Box>
                              <Typography fontWeight={700} variant='h6'>
                                {item.title}
                              </Typography>
                              <Typography>{item.details}</Typography>
                              <Stack flexDirection={"row"} gap={2}>
                                <Typography sx={{ color: "purple" }}>
                                  {item.user.name}
                                </Typography>
                                <Typography>
                                  {dayjs(item.createdAt).fromNow()}
                                </Typography>
                              </Stack>
                              {item.replies.map((reply: any) => (
                                <Paper
                                  sx={{
                                    ml: 2,
                                    p: 2,
                                    mb: 2,
                                    mt: 2,
                                    background: "rgba(43, 42, 42, 0.117)",
                                  }}
                                  key={reply.id}
                                >
                                  <Box>
                                    <Stack flexDirection={"row"} gap={2}>
                                      <Avatar
                                        src={reply?.user?.picture || ""}
                                        sx={{ width: 30, height: 30 }}
                                      />
                                      <Typography sx={{ color: "purple" }}>
                                        {reply?.user?.name}
                                      </Typography>
                                      <Typography>
                                        {dayjs(reply.createdAt).fromNow()}
                                      </Typography>
                                    </Stack>
                                    <Typography>{reply.details}</Typography>
                                  </Box>
                                </Paper>
                              ))}

                              <Box sx={{ mt: 2 }}>
                                <Button onClick={() => handleRowReply(item.id)}>
                                  Reply
                                </Button>
                                {IsReply && item.id == quesId && (
                                  <Box>
                                    <TextField
                                      multiline
                                      maxRows={6}
                                      size='small'
                                      sx={{ width: 600 }}
                                      value={reply}
                                      onChange={(e) => setReply(e.target.value)}
                                    />
                                    <Box sx={{ mt: 2 }}>
                                      <Button
                                        size='small'
                                        variant='contained'
                                        sx={{ width: 250 }}
                                        onClick={() => handleReplyBack(item.id)}
                                      >
                                        Submit
                                      </Button>
                                    </Box>
                                  </Box>
                                )}
                              </Box>
                            </Box>
                          </Stack>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <ReviewCouseUserDiaolog
        openReview={openReview}
        setOpenReview={setOpenReview}
        course={course}
        setIsReview={setIsReview}
      />
    </ThemeProvider>
  );
}
