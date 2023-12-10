import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import CardCoursesService from "../service-ui/card-courses";
import { useRouter } from "next/router";
import { useLoading } from "@/zustand/loading";
import { useEffect, useState } from "react";
import { getAllCoursesAPI } from "@/api/course";
import { errorToast } from "@/utils/notification";
import { useCourseStore } from "@/zustand/courses";

type Props = {};
function PopularCourse({}: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { courses, setCourses } = useCourseStore();

  // const [courses, setCourses] = useState<any[]>([]);
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
    <Box sx={{ mt: 5 }}>
      <Stack flexDirection={"row"} justifyContent={"space-between"} mb={3}>
        <Typography variant='h4'>Popular courses</Typography>
        <Button size='small' onClick={() => router.push("/courses/search")}>
          Browse All
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {courses.map((item: any) => (
          <Grid item xs={12} md={6} lg={3} key={item.id}>
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
        ))}
      </Grid>
    </Box>
  );
}
export default PopularCourse;
