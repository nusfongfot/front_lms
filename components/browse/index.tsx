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
import CardCoursesService from "../service-ui/card-courses";
import { useCourseStore } from "@/zustand/courses";

type Props = {};
function BrowseComponent({}: Props) {
  const router = useRouter();
  const { setLoading, isLoading } = useLoading();
  const { courses, setCourses } = useCourseStore();

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
      <Grid container spacing={3}>
        {courses.length == 0 ? (
          <Typography sx={{ mt: 10, ml: 3, mb: 38.9 }} variant='h5'>
            There is no course yet.
          </Typography>
        ) : (
          courses.map((item: any) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              xl={courses.length < 3 ? 6 : 4}
              key={item.id}
            >
              <CardCoursesService
                title={item.name.slice(0, 37) + "..."}
                category={item.category}
                image={item.image}
                name={item.user.name}
                price={item.price}
                onClickHeadCard={() =>
                  router.push(`/course/details?subpath=${item.id}`)
                }
              />
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}
export default BrowseComponent;
