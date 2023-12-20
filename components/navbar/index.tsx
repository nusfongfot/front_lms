import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import MoreIcon from "@mui/icons-material/MoreVert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Avatar, Button, Divider, Stack } from "@mui/material";
import { useRouter } from "next/router";
import useInfo from "@/zustand/auth";
import { deleteCookie } from "cookies-next";
import { becomeInstructorAPI } from "@/api/instructor";
import { errorToast } from "@/utils/notification";

const Search = styled("form")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("xl")]: {
      width: "130ch !important",
    },
    [theme.breakpoints.up("lg")]: {
      width: "80ch !important",
    },
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
    [theme.breakpoints.up("sm")]: {
      width: "50ch",
    },
  },
}));

export default function MyNavBar() {
  const router = useRouter();
  const { accInfo } = useInfo();

  const [search, setSearch] = React.useState<string>("");
  const newValueSearch = search.replace(/\s/g, "&");

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [anchorCart, setAnchorCart] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isCartOpen = Boolean(anchorCart);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCartOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorCart(event.currentTarget);
  };

  const handleCartClose = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorCart(null);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleLogOut = async () => {
    deleteCookie("token");
    window.location.replace("/");
  };

  const handleInstructor = async () => {
    try {
      const res = await becomeInstructorAPI();
      router.replace(res);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };

  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search) {
      router.push({
        pathname: "/courses/search",
        query: `q=${newValueSearch}`,
      });
    }
  };

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size='large' aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='error'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size='large'
          aria-label='show 17 new notifications'
          color='inherit'
        >
          <Badge badgeContent={17} color='error'>
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size='large'
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  const renderPcMenu = (
    <Menu
      anchorEl={anchorEl}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          router.push("/profile/settings");
        }}
      >
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogOut}>Log out</MenuItem>
    </Menu>
  );

  const renderCartOfCourse = (
    <Menu
      anchorEl={anchorCart}
      id={menuId}
      keepMounted
      open={isCartOpen}
      onClose={handleCartClose}
      sx={{ mt: 2 }}
    >
      <Box sx={{ mt: 2, width: 400, p: 2, overflow: "auto", maxHeight: 450 }}>
        <Stack flexDirection={"row"} alignItems={"center"} gap={2} mb={2}>
          <img
            src='../images/pngtree-flat-cartoon-training-learning-banner-image_182829.jpg'
            style={{ width: 80, height: 80 }}
          />
          <Box>
            <Typography variant='h6' fontWeight={700}>
              Title Course
            </Typography>
            <Typography>Stefan Jovanovic</Typography>
            <Typography fontWeight={700}>$ 10</Typography>
          </Box>
        </Stack>
        <Divider sx={{ mt: 2, mb: 2 }} />

        <Button size='small' fullWidth variant='contained' sx={{ mt: 2 }}>
          Check out
        </Button>
      </Box>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1, mb: 8 }}>
      <AppBar position='fixed' sx={{ background: "black" }}>
        <Toolbar>
          {/* <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{
              display: { xs: "none", sm: "block" },
              mr: 3,
              cursor: "pointer",
            }}
            onClick={() => router.push("/")}
          >
            Abular
          </Typography>
          {/* <Button
            variant='contained'
            size='small'
            className='btn_red'
            sx={{ display: { xs: "none", lg: "block" } }}
          >
            Categories
          </Button> */}
          <Search onSubmit={(e: React.FormEvent) => handleSubmitSearch(e)}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ "aria-label": "search" }}
              type='search'
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          {accInfo.id ? (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {accInfo.role == "instructor" ? (
                <Button
                  variant='text'
                  sx={{ color: "white" }}
                  onClick={() =>
                    router.push({
                      pathname: "/instructor/overall",
                      query: "subpath=overall",
                    })
                  }
                >
                  Instructor
                </Button>
              ) : (
                <Button
                  variant='text'
                  sx={{ color: "white" }}
                  onClick={handleInstructor}
                >
                  Become Instructor
                </Button>
              )}
              <Button
                variant='text'
                sx={{ color: "white" }}
                onClick={() => router.push("/profile/mycourses")}
              >
                My course
              </Button>
              {/* <IconButton
                size='large'
                aria-label='show 17 new notifications'
                color='inherit'
                onClick={handleCartOpen}
              >
                <Badge badgeContent={1} color='error'>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton> */}
              <IconButton
                size='large'
                edge='end'
                aria-label='account of current user'
                aria-controls={menuId}
                aria-haspopup='true'
                onClick={handleProfileMenuOpen}
                color='inherit'
              >
                <Avatar src={accInfo.picture || ""} />
              </IconButton>
            </Box>
          ) : (
            <Stack flexDirection={"row"} gap={2}>
              <Button
                variant='contained'
                size='small'
                onClick={() => router.push("/signin")}
              >
                login
              </Button>
              <Button
                variant='contained'
                size='small'
                onClick={() => router.push("/signup")}
              >
                signup
              </Button>
            </Stack>
          )}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {/* {renderMobileMenu} */}
      {renderPcMenu}
      {/* {renderCartOfCourse} */}
    </Box>
  );
}
