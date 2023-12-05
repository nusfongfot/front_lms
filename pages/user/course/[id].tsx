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
  Checkbox,
  FormControlLabel,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { AccountCircle, Check, CheckBox } from "@mui/icons-material";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { deleteCookie } from "cookies-next";
import HomeIcon from "@mui/icons-material/Home";
import { getCourseUserByIdAPI, markCompleteAPI } from "@/api/course";
import ReactPlayer from "react-player";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import MyProcess from "@/components/process";
import useInfo from "@/zustand/auth";
import ReviewCouseUserDiaolog from "@/components/review_course_dialog";

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
  const path = usePathname();
  const router = useRouter();
  const id = router?.query?.id?.toString();
  const { accInfo } = useInfo();

  const [course, setCourse] = React.useState<any>({});
  const [preview, setPreview] = React.useState("");
  const [open, setOpen] = React.useState(true);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [played, setPlayed] = React.useState(0);
  const [isEnded, setIsEnded] = React.useState(false);
  const [openReview, setOpenReview] = React.useState(false);

  const [compelteLesson, setCompleteLesson] = React.useState<string>("false");
  const [isComplete, setIsComplete] = React.useState(false);

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
    localStorage.removeItem("tokenLms");
    window.location.replace("/");
  };

  const handlePreviewVideo = (item: any) => {
    setPreview(item.video);
    sessionStorage.setItem("video", item.video);
    setCompleteLesson(item.completed);
    sessionStorage.setItem("isCompleted", item.completed.toString());
  };
  const handleIdMarkDone = async () => {
    const filter = course?.lessions?.filter(
      (item: any) => item.video == preview
    );
    const id = filter[0].id;

    try {
      const body = {
        lessonId: filter[0].id,
        courseId: filter[0].courseId,
        completed: true,
      };
      await markCompleteAPI(body);
      setIsComplete(true);
      setCourse((prev: any) => {
        const findId = prev.lessions.filter((item: any) => item.id == id);
        findId[0].completed = true;
        return { ...prev };
      });
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };

  const handleVideoEnded = () => {
    setIsEnded(true);
    sessionStorage.setItem("isCompleted", "true");
    setIsComplete(true);
  };

  React.useEffect(() => {
    (async () => {
      try {
        if (typeof id === "string") {
          const res = await getCourseUserByIdAPI(id);
          setCourse(res.data);
        } else {
          return null;
        }
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
        router.replace("/dashboard/overall");
      }
    })();
    if (router?.query?.lesson) {
      setPreview(sessionStorage.getItem("video") || "");
    } else {
      setPreview("");
    }
  }, [router?.query?.id]);

  React.useEffect(() => {
    setIsEnded(false);
    if (isEnded) {
      handleIdMarkDone();
    }
  }, [isEnded]);

  React.useEffect(() => {
    const isCom = sessionStorage.getItem("isCompleted");
    setCompleteLesson(isCom || "");
    setIsComplete(false);
  }, [compelteLesson]);

  React.useEffect(() => {
    const findCourse = accInfo?.courses?.filter((item: any) => item.id == id);
    if (findCourse?.length == 0 && id != undefined) {
      errorToast("course not found", 2000);
      router.replace("/dashboard/overall");
    }
  }, [id]);
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px",
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textTransform: "capitalize" }}
            >
              {course.name}
            </Typography>
            <Button
              variant="text"
              sx={{ color: "white" }}
              onClick={() => setOpenReview(true)}
            >
              Review Course
            </Button>
            <Box>
              <MyProcess course={course} />
            </Box>
            {auth && (
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar src={accInfo.picture || ""} />
                </IconButton>
                <Menu
                  id="menu-appbar"
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
                      router.push("/dashboard/profile");
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
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [1],
            }}
          >
            <Typography variant="h5">Course content </Typography>
            <IconButton onClick={() => router.push("/dashboard/overall")}>
              <HomeIcon />
            </IconButton>
          </Toolbar>

          <Divider />

          <List>
            {course?.lessions?.map((item: any) => (
              <ListItem
                sx={{
                  background: router.query.lesson == item.id ? "#FA8232" : "",
                  cursor: "pointer",
                }}
                key={item.id}
                onClick={() => {
                  router.push(`/user/course/${id}?lesson=${item.id}`);
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
                      color: router.query.lesson == item.id ? "white" : "black",
                      fontWeight: 900,
                      whiteSpace: "initial",
                      zIndex: 10,
                    }}
                  >
                    {item.name}
                  </ListItemText>
                  {item.completed ? (
                    <CheckCircleIcon sx={{ color: "green" }} />
                  ) : (
                    <CancelIcon sx={{ color: "red" }} />
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
          component="main"
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
          <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Grid container>
              <Grid item xs={12}>
                {preview ? (
                  <Box>
                    {compelteLesson == "true" || isComplete ? (
                      <Alert
                        sx={{
                          background: "rgba(41, 235, 128, 0.9)",
                          mb: 1,
                          cursor: "pointer",
                        }}
                      >
                        Completed
                      </Alert>
                    ) : (
                      <Alert
                        severity="error"
                        onClick={() => handleIdMarkDone()}
                        sx={{
                          cursor: "pointer",
                        }}
                      >
                        Mark Complete
                      </Alert>
                    )}
                    :
                    <ReactPlayer
                      url={preview}
                      width={"100%"}
                      height={"740px"}
                      controls={true}
                      onProgress={(e) => setPlayed(e.loadedSeconds)}
                      onEnded={handleVideoEnded}
                    />
                  </Box>
                ) : (
                  <Stack
                    sx={{ height: "70vh" }}
                    flexDirection={"column"}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <PlayCircleIcon sx={{ fontSize: 80, color: "blue" }} />
                    <Typography variant="h4">Click Lesson To Watch</Typography>
                  </Stack>
                )}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <ReviewCouseUserDiaolog
        openReview={openReview}
        setOpenReview={setOpenReview}
        course={course}
      />
    </ThemeProvider>
  );
}
