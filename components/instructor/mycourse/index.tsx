import { deleteCourseAPI } from "@/api/course";
import { getCoursesOfInstructorAPI } from "@/api/instructor";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

type Props = {};
function InstructorMyCourse({}: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [courses, setCourses] = useState<any[]>([]);

  const handleGetCourses = async () => {
    setLoading(true);
    try {
      const res = await getCoursesOfInstructorAPI();
      setCourses(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleDeteCourse = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const filter = courses.filter((item: any) => item.id !== id);
          await deleteCourseAPI(id);
          setCourses(filter);
          Swal.fire({
            title: "Deleted!",
            text: "Your lesson has been deleted.",
            icon: "success",
          });
        } catch (error: any) {
          errorToast(error.response.data.message, 2000);
        }
      }
    });
  };

  useEffect(() => {
    handleGetCourses();
  }, []);

  return (
    <Box>
      <Typography variant="h4">My Course</Typography>
      <Box>
        {courses.length == 0 ? (
          <Stack flexDirection={"row"} mt={3} alignItems={"center"}>
            <Typography>Do you want to create your course now ?</Typography>
            <Button
              size="small"
              onClick={() =>
                router.replace("/dashboard/instructor?subpath=create")
              }
            >
              Click here
            </Button>
          </Stack>
        ) : (
          courses.map((item) => (
            <Box key={item.id} mt={5}>
              <Stack flexDirection={"row"} justifyContent={"space-between"}>
                <Stack flexDirection={"row"} gap={2}>
                  <img
                    src={item.image}
                    style={{ width: 80, height: 80, borderRadius: "50%" }}
                  />
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(
                          `/dashboard/instructor?subpath=course&id=${item.id}`
                        )
                      }
                    >
                      {item.name}
                    </Typography>
                    <Typography variant="h6">
                      {item.lessions.length} Lesson
                    </Typography>
                    <Typography variant="subtitle1" color={"orange"}>
                      At least 5 lesson are required for publish a course
                    </Typography>
                  </Box>
                </Stack>
                <Button color="error" onClick={() => handleDeteCourse(item.id)}>
                  x
                </Button>
              </Stack>
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
export default InstructorMyCourse;
