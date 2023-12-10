import LayoutUser from "@/components/layout-user";
import {
  Box,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import Person2Icon from "@mui/icons-material/Person2";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import ProfileComponent from "@/components/profile";
import MyCourse from "@/components/my-course";

type Props = {};
const data = [
  {
    id: 1,
    title: "MyProfile",
    icon: <Person2Icon />,
    path: "settings",
    link: "/profile/settings",
  },
  {
    id: 2,
    title: "MyCourses",
    icon: <CastForEducationIcon />,
    path: "mycourses",
    link: "/profile/mycourses",
  },
];
function ProfilePage({}: Props) {
  const router = useRouter();

  return (
    <LayoutUser>
      <Container maxWidth='xl'>
        <Grid container spacing={3} mt={10}>
          <Grid item xs={12} lg={3}>
            <Paper>
              <List disablePadding>
                {data.map((item) => (
                  <Box key={item.id}>
                    <ListItem
                      sx={{
                        background:
                          router.query.slug == item.path ? "#FA8232" : "",
                      }}
                      onClick={() => router.push(`${item.link}`)}
                    >
                      <ListItemButton>
                        <ListItemIcon
                          sx={{
                            color:
                              router.query.slug == item.path
                                ? "white"
                                : "black",
                          }}
                        >
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.title}
                          sx={{
                            color:
                              router.query.slug == item.path
                                ? "white"
                                : "black",
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={9}>
            {router.query.slug == "settings" ? <ProfileComponent /> : null}
            {router.query.slug == "mycourses" ? <MyCourse /> : null}
          </Grid>
        </Grid>
      </Container>
      <Box sx={{ mt: 38 }} />
    </LayoutUser>
  );
}
export default ProfilePage;
