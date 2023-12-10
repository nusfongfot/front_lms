import {
  deleteLessionOfCourseAPI,
  getCourseByIdAPI,
  getLessionOfCourseAPI,
  publishCourseAPI,
  unPublishCourseAPI,
  updateLessionOfCourseAPI,
} from "@/api/course";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { DragEvent, useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import AddIcon from "@mui/icons-material/Add";
import DialodAddLession from "./add_less_modal";
import useInfo from "@/zustand/auth";
import EditCourseDialog from "./edit_course_modal";
import Swal from "sweetalert2";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { getStudentEnrolled } from "@/api/instructor";

type Props = {};
function CourseCompoent({}: Props) {
  const router = useRouter();
  const id = router?.query?.id;
  const { setLoading } = useLoading();
  const { accInfo } = useInfo();
  const [course, setCourse] = useState<any>({});
  const [lessions, setLessions] = useState<any[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [isEditLess, setIsEditLess] = useState(false);
  const [lesson, setLesson] = useState({});
  const [stuedents, setStudents] = useState<any[]>([]);

  const handleClickOpenAdd = () => {
    setOpenAdd(true);
    setIsEditLess(false);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleClickOpenEditCourse = () => {
    setOpenEditCourse(true);
  };

  const handleCloseEditCourse = () => {
    setOpenEditCourse(false);
  };

  const handleGetStudents = async () => {
    try {
      const res = await getStudentEnrolled();
      setStudents(
        res.data.filter((item: any) =>
          item.courses.some((item: any) => item.id == id)
        )
      );
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };
  const handleGetCourse = async () => {
    setLoading(true);
    try {
      const res = await getCourseByIdAPI(id as string);
      setCourse(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLession = async () => {
    try {
      const res = await getLessionOfCourseAPI(id as string, accInfo.id);
      setLessions(res.data);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>, index: any) => {
    e.dataTransfer.setData("itemIndex", index);
  };
  const handleDrop = async (e: DragEvent<HTMLDivElement>, index: any) => {
    // const movingItemIndex: any = e.dataTransfer.getData("itemIndex");
    // const targetItemIndex = index;
    // let allLessons = lessions;
    // let movingItem = allLessons[movingItemIndex]; // clicked drag item to re-order
    // // console.log(allLessons);
    // allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    // allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index
    // setLessions([...allLessons]);
  };

  const handleDelete = (id: number) => {
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
          const filter = lessions.filter((item) => item.id !== id);
          await deleteLessionOfCourseAPI(id);
          setLessions(filter);
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

  const handlePublishCourse = () => {
    Swal.fire({
      title: "Publish course",
      // text: "You won't be able to revert this!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await publishCourseAPI(id as string);
          setCourse((prev: any) =>
            prev.id == id
              ? {
                  ...prev,
                  published: true,
                }
              : prev
          );
          Swal.fire({
            title: "Publish Success!",
            // text: "Your lesson has been deleted.",
            icon: "success",
          });
        } catch (error: any) {
          errorToast(error.response.data.message, 2000);
        }
      }
    });
  };

  const handleUnPublishCourse = () => {
    Swal.fire({
      title: "UnPublish course",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await unPublishCourseAPI(id as string);
          setCourse((prev: any) =>
            prev.id == id
              ? {
                  ...prev,
                  published: false,
                }
              : prev
          );
          Swal.fire({
            title: "UnPublish Success!",
            // text: "Your lesson has been deleted.",
            icon: "success",
          });
        } catch (error: any) {
          errorToast(error.response.data.message, 2000);
        }
      }
    });
  };

  const handleEditLesson = (item: object) => {
    setOpenAdd(true);
    setIsEditLess(true);
    setLesson(item);
  };
  useEffect(() => {
    handleGetCourse();
    handleGetLession();
    handleGetStudents();
  }, [id, accInfo.id]);
  return (
    <Box>
      <Button
        variant='contained'
        size='small'
        onClick={() => router.push("/instructor/overall?subpath=mycourse")}
      >
        back
      </Button>
      <Box mt={3}>
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <Stack flexDirection={"row"} gap={2}>
            <img
              src={course?.image}
              style={{ width: 80, height: 80, borderRadius: "50%" }}
            />
            <Box>
              <Typography variant='h5'>{course?.name}</Typography>
              <Typography variant='h6'>0 Lessions</Typography>
            </Box>
          </Stack>
          <Stack flexDirection={"row"} gap={2}>
            <Tooltip title={`${stuedents.length} Enrolled`} placement='top'>
              <PersonIcon sx={{ color: "green", cursor: "pointer" }} />
            </Tooltip>
            <Tooltip title='Edit' placement='top'>
              <EditIcon
                sx={{ color: "orange", cursor: "pointer" }}
                onClick={handleClickOpenEditCourse}
              />
            </Tooltip>

            {course.published ? (
              <Tooltip title='Unpublish' placement='top'>
                <CloseIcon
                  sx={{ color: "red", cursor: "pointer" }}
                  onClick={handleUnPublishCourse}
                />
              </Tooltip>
            ) : (
              <Tooltip title='Publish' placement='top'>
                <CheckIcon
                  sx={{ color: "green", cursor: "pointer" }}
                  onClick={handlePublishCourse}
                />
              </Tooltip>
            )}
          </Stack>
        </Stack>
        <Box mt={2}>
          <ReactQuill
            value={course?.description}
            readOnly={true}
            theme={"bubble"}
          />
        </Box>
        <Button
          variant='contained'
          size='small'
          startIcon={<AddIcon />}
          onClick={handleClickOpenAdd}
        >
          Add lession
        </Button>
      </Box>
      <Box mt={3}>
        <Typography variant='h5'>{lessions.length | 0} Lesson</Typography>
        {lessions.map((item, i) => (
          <Box key={i} mt={2} onDragOver={(e) => e.preventDefault()}>
            <Stack flexDirection={"row"} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={2}>
                <Stack
                  sx={{
                    background: "grey",
                    width: 40,
                    height: 40,
                    color: "white",
                    borderRadius: "50%",
                  }}
                  alignItems={"center"}
                  justifyContent={"center"}
                  onDragStart={(e) => handleDrag(e, i)}
                  onDrop={(e) => handleDrop(e, i)}
                  draggable
                >
                  <Typography variant='h5'>{i + 1}</Typography>
                </Stack>
                <Typography variant='h5'>{item.name}</Typography>
              </Stack>
              <Stack flexDirection={"row"} gap={1}>
                <button
                  className='btn_del'
                  onClick={() => handleDelete(item.id)}
                >
                  X
                </button>
                <EditIcon
                  sx={{
                    color: "white",
                    cursor: "pointer",
                    background: "green",
                    fontSize: 20,
                  }}
                  onClick={() => handleEditLesson(item)}
                />
              </Stack>
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
      <DialodAddLession
        openAdd={openAdd}
        handleCloseAdd={handleCloseAdd}
        setLessions={setLessions}
        lessions={lessions}
        isEditLess={isEditLess}
        lesson={lesson}
        setLesson={setLesson}
      />

      <EditCourseDialog
        openEditCourse={openEditCourse}
        handleCloseEditCourse={handleCloseEditCourse}
        course={course}
        setCourse={setCourse}
      />
    </Box>
  );
}
export default CourseCompoent;
