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
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  Avatar,
  Button,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/router";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import { usePathname } from "next/navigation";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import { AccountCircle } from "@mui/icons-material";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { deleteCookie } from "cookies-next";
import useInfo from "@/zustand/auth";
import { becomeInstructorAPI } from "@/api/instructor";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

type Props = {
  children: React.ReactNode;
};

const drawerWidth: number = 240;

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

const defaultTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function Layout({ children }: Props) {
  const path = usePathname();
  const router = useRouter();
  const { accInfo } = useInfo();

  const [open, setOpen] = React.useState(true);
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const list: any[] = [
    // {
    //   id: 1,
    //   link: "/dashboard/overall",
    //   title: "Dashboard",
    //   icon: <DashboardIcon />,
    //   isSubPath: false,
    // },
    // {
    //   id: 2,
    //   link: "/dashboard/browse",
    //   title: "Browse",
    //   icon: <PlagiarismIcon />,
    //   isSubPath: false,
    // },
    {
      id: 6,
      link: "/instructor/profile",
      title: "Profile",
      icon: <AccountBoxIcon />,
      isSubPath: false,
    },
    accInfo.role == "instructor" && {
      id: 3,
      link: "",
      title: "Instructor",
      isSubPath: true,
      icon: <CastForEducationIcon />,
      inside_path: [
        {
          id_in: 7,
          title: "Overall",
          link: "/instructor/overall?subpath=overall",
          subpath: "overall",
        },
        {
          id_in: 4,
          title: "My Course",
          link: "/instructor/overall?subpath=mycourse",
          subpath: "mycourse",
        },
        {
          id_in: 5,
          title: "Create Course",
          link: "/instructor/overall?subpath=create",
          subpath: "create",
        },
      ],
    },
  ];

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
              {path?.split("/")[2]}
            </Typography>
            <Button
              variant='text'
              sx={{ color: "white" }}
              onClick={() => router.push("/profile/mycourses")}
            >
              Student Mode
            </Button>
            {/* {accInfo.role == "instructor" ? null : (
              <Button
                variant='text'
                sx={{ color: "white" }}
                onClick={handleInstructor}
              >
                Become Instructor
              </Button>
            )} */}
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
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: [1],
              color: "white",
            }}
          >
            <Box />
            <Typography variant='h5' align='center'>
              E-learning
            </Typography>
            <IconButton onClick={toggleDrawer} sx={{ color: "white" }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>

          <Divider />
          <List>
            {list.map((item, i) =>
              item.isSubPath ? (
                <TreeView aria-label='file system navigator' key={i}>
                  <TreeItem
                    nodeId='1'
                    label={
                      <div
                        style={{
                          height: 48,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginLeft: "-16px",
                          color: "white",
                        }}
                      >
                        <CastForEducationIcon />
                        <Typography
                          variant='subtitle1'
                          sx={{ display: open ? "block" : "none" }}
                        >
                          Instructor
                        </Typography>
                        <div />
                        <KeyboardArrowDownIcon
                          sx={{ display: open ? "block" : "none" }}
                        />
                      </div>
                    }
                    sx={{
                      ".MuiTreeItem-root": {
                        backgroundColor: "none",
                      },
                      ".MuiTreeItem-content .Mui-selected": {
                        backgroundColor: "none",
                      },
                      ".MuiTreeItem-content .Mui-selected .Mui-focused": {
                        backgroundColor: "none",
                      },
                    }}
                  >
                    {item.inside_path.map((val: any, iTwo: any) => (
                      <TreeItem
                        key={iTwo + 1}
                        nodeId='2'
                        label={
                          <div
                            style={{
                              height: 48,
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "23px",
                              color: "white",
                            }}
                            onClick={() => router.replace(val.link)}
                          >
                            <Typography variant='subtitle1'>
                              {val.title}
                            </Typography>
                          </div>
                        }
                        sx={{
                          background:
                            router?.query?.subpath == val.subpath
                              ? "#FA8232"
                              : "",
                          color:
                            router?.query?.subpath == val.subpath
                              ? "white"
                              : "white",
                        }}
                      />
                    ))}
                  </TreeItem>
                </TreeView>
              ) : (
                <Link href={item.link} key={i}>
                  <ListItem
                    sx={{
                      background: path === item.link ? "#FA8232" : "",
                    }}
                  >
                    <ListItemAvatar>
                      <Box
                        sx={{
                          color: path === item.link ? "white" : "white",
                        }}
                      >
                        {item.icon}
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.title}
                      sx={{
                        color: path === item.link ? "white" : "white",
                      }}
                    />
                  </ListItem>
                </Link>
              )
            )}
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
                {children}
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
