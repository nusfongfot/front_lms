import { getAllCoursesAPI } from "@/api/course";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
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
import { useEffect, useState } from "react";

type Props = {};
function BrowseComponent({}: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const [courses, setCourses] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getAllCoursesAPI();
        setCourses(res.data);
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <Grid container>
        {courses.map((item) => (
          <Grid item xs={12} md={6} lg={4} key={item.id}>
            <Card sx={{ maxWidth: 360 }}>
              <CardMedia
                sx={{
                  height: 250,
                  backgroundPosition: "center",
                }}
                image={item.image}
                title="green iguana"
              />
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {item.name.slice(0, 37) + "..."}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  by {item.user.name}
                </Typography>
                <Typography variant="h5">{item.price} $</Typography>
                <Typography
                  sx={{
                    background: "blue",
                    width: "fit-content",
                    color: "white",
                    borderRadius: ".5rem",
                    p: 1,
                  }}
                  variant="subtitle2"
                >
                  {item.category}{" "}
                </Typography>
              </CardContent>
              <Stack p={2}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() =>
                    router.push(`/dashboard/details?subpath=${item.id}`)
                  }
                >
                  Learn More
                </Button>
              </Stack>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
export default BrowseComponent;
