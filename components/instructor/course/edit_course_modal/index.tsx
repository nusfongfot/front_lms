import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import dynamic from "next/dynamic";
import {
  Box,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ChangeEvent, Dispatch, useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LoadingButton } from "@mui/lab";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });
import SaveIcon from "@mui/icons-material/Save";
import { updateCourseAPI } from "@/api/course";
import { uploadImageAPI } from "@/api/upload";
import { errorToast, successToast } from "@/utils/notification";
import { useRouter } from "next/router";

type Props = {
  openEditCourse: boolean;
  handleCloseEditCourse: () => void;
  course: any;
  setCourse: Dispatch<any>;
};

const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const categories = [
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "IT",
    label: "IT",
  },
  {
    value: "Business",
    label: "Business",
  },
  {
    value: "Finance and Accounting",
    label: "Finance and Accounting",
  },
  {
    value: "Working in the office",
    label: "Working in the office",
  },
  {
    value: "Self development",
    label: "Self development",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Health",
    label: "Health",
  },
  {
    value: "Music",
    label: "Music",
  },
];

export default function EditCourseDialog({
  handleCloseEditCourse,
  openEditCourse,
  course,
  setCourse,
}: Props) {
  const { query } = useRouter();
  const [values, setValues] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [valueQill, setValueQill] = useState("");
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | string>("");
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPreview(window.URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoadingBtn(true);
    try {
      const formData: FormData = new FormData();
      formData.append("file", file);
      const upload = await uploadImageAPI(formData);
      const body = {
        name: values.name,
        description: valueQill,
        image: upload.image,
        price: values.price,
        category: values.category,
      };
      const res = await updateCourseAPI(query.id as string, body);
      setCourse({
        ...course,
        name: values.name,
        description: valueQill,
        image: upload.image,
        category: values.category,
      });
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoadingBtn(false);
      handleCloseEditCourse();
    }
  };

  useEffect(() => {
    setValues({
      name: course?.name,
      price: course?.price,
      category: course?.category,
    });
    setValueQill(course?.description);
  }, [course]);
  return (
    <Dialog
      open={openEditCourse}
      onClose={handleCloseEditCourse}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
    >
      <DialogTitle id="alert-dialog-title">{"Edit course"}</DialogTitle>
      <Box sx={{ width: 800, p: 2 }}>
        <Box>
          <Typography mt={2}>title</Typography>
          <TextField
            size="small"
            fullWidth
            name="name"
            value={values.name}
            onChange={handleChangeValues}
          />
          <Typography mt={2}>description</Typography>
          <ReactQuill
            theme="snow"
            value={valueQill}
            onChange={setValueQill}
            modules={{ toolbar: toolbarOptions }}
          />
          <Typography mt={2}>Price</Typography>
          <TextField
            size="small"
            type="number"
            fullWidth
            name="price"
            value={values.price}
            onChange={handleChangeValues}
          />
          <Typography mt={2}>Category</Typography>
          <TextField
            id="outlined-select-currency"
            select
            size="small"
            fullWidth
            name="category"
            value={values.category}
            onChange={handleChangeValues}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Stack>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2, mb: 2, width: 180 }}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                onChange={handleImage}
                accept="image/jpeg, image/png"
              />
            </Button>
            {preview && (
              <Stack
                sx={{
                  width: 300,
                }}
                alignItems={"flex-end"}
              >
                <Button
                  color="error"
                  variant="contained"
                  sx={{ width: "10px", height: 20 }}
                  onClick={() => setPreview("")}
                >
                  X
                </Button>
                <Box>
                  <img
                    src={preview}
                    style={{
                      width: 300,
                      height: 300,
                    }}
                  />
                </Box>
              </Stack>
            )}
          </Stack>
        </Box>
      </Box>
      <DialogActions>
        <Button
          onClick={handleCloseEditCourse}
          variant="contained"
          size="small"
          color="error"
        >
          cancel
        </Button>
        <LoadingButton
          loading={loadingBtn}
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="contained"
          size="small"
          onClick={handleSave}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
