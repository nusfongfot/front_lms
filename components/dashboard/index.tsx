import { getProfileAPI } from "@/api/profile";
import { errorToast } from "@/utils/notification";
import useInfo from "@/zustand/auth";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {};
function Dashboard({}: Props) {
  const router = useRouter();
  const { accInfo, setInfo } = useInfo();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProfileAPI();
        setInfo(res.data);
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
        router.push("/");
      }
    })();
  }, []);
  return (
    <div>
      <Typography variant="h4">My Course</Typography>
      {!accInfo?.courses ? (
        <Typography variant="h6">
          want to browse a course?
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => router.push("/dashboard/browse")}
          >
            click here
          </span>
        </Typography>
      ) : null}

      <Grid container mt={2}>
        {accInfo?.courses?.map((item: any) => (
          <Grid item xs={12} md={6} lg={4} key={item?.id}>
            <Card sx={{ maxWidth: 360 }}>
              <CardMedia
                sx={{
                  height: 250,
                  backgroundPosition: "center",
                }}
                image={item?.image}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item?.name.slice(0, 28) + "..."}
                </Typography>
              </CardContent>
              <Stack p={2}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => router.push(`/user/course/${item?.id}`)}
                >
                  Watch
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
export default Dashboard;
