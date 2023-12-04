import {
  Box,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadImageAPI } from "@/api/upload";
import { errorToast, successToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import { createCourseAPI } from "@/api/course";
import useInfo from "@/zustand/auth";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(import("react-quill"), { ssr: false });

type Props = {};
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
const toolbarOptions = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["clean"],
];

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

function CreateCourse({}: Props) {
  const { setLoading } = useLoading();
  const { accInfo } = useInfo();

  const [isShow, setIsShow] = useState(true);
  const [values, setValues] = useState({
    name: "",
    price: "",
    category: "",
  });
  const [valueQill, setValueQill] = useState("");

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | string>("");

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
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData: FormData = new FormData();
      formData.append("file", file);
      const upload = await uploadImageAPI(formData);
      const body = {
        userId: accInfo.id,
        name: values.name,
        description: valueQill,
        price: values.price,
        image: upload.image,
        category: values.category,
      };
      const res = await createCourseAPI(body);
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoading(false);
      setValues({
        name: "",
        category: "",
        price: "",
      });
      setPreview("");
      setFile("");
      setValueQill("");
    }
  };

  useEffect(() => {
    if (
      values.name !== "" &&
      valueQill !== "" &&
      values.category !== "" &&
      preview !== ""
    ) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  }, [values, file, valueQill]);
  return (
    <Box>
      <Typography variant="h4">Create Course</Typography>
      <Box sx={{ width: 700 }}>
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
          helperText={"if course is free don't fill"}
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
        <Button
          variant="contained"
          sx={{ mt: 2, width: 250, mb: 2 }}
          onClick={handleSubmit}
          disabled={isShow}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
export default CreateCourse;
