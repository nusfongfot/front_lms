import { updateImageProfileAPI, updateValuesProfileAPI } from "@/api/profile";
import { uploadImageAPI } from "@/api/upload";
import { errorToast, successToast } from "@/utils/notification";
import useInfo from "@/zustand/auth";
import { useLoading } from "@/zustand/loading";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState } from "react";

type Props = {};
function ProfileComponent({}: Props) {
  const { accInfo, setInfo } = useInfo();
  const { setLoading } = useLoading();
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isShow, setIsShow] = useState(true);

  const fileRef: any = useRef();
  const [file, setFile] = useState<File | string>("");
  const [preview, setPreview] = useState("");

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPreview(window.URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const body = {
        name: values.name,
        email: values.email,
        password: values.password,
        confirm_password: values.confirm_password,
      };
      const res = await updateValuesProfileAPI(body);
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setValues({
        name: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      setLoading(false);
    }
  };

  const handleClickChooseFile = () => {
    fileRef?.current?.click();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData: FormData = new FormData();
      formData.append("file", file);
      const upload = await uploadImageAPI(formData);
      const body = {
        picture: upload.image,
      };
      const res = await updateImageProfileAPI(body);
      setInfo({
        ...accInfo,
        picture: upload.image,
      });
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setFile("");
      setPreview("");
      setLoading(false);
    }
  };

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancelImage = () => {
    setFile("");
    setPreview("");
  };

  useEffect(() => {
    setValues({
      name: accInfo.name,
      email: accInfo.email,
      password: "",
      confirm_password: "",
    });
  }, [accInfo]);

  useEffect(() => {
    if (
      values.name !== "" &&
      values.email !== "" &&
      values.password !== "" &&
      values.confirm_password !== ""
    ) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  }, [values]);
  return (
    <Box>
      <Typography variant="h4">Edit Profile</Typography>
      <Grid container>
        <Grid item xs={12} sm={6}>
          <Typography mt={5} variant="h6">
            Name
          </Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            name="name"
            value={values.name}
            onChange={handleChangeValues}
          />
          <Typography variant="h6">Email</Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            name="email"
            value={values.email}
            onChange={handleChangeValues}
          />
          <Typography variant="h6">Password</Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            name="password"
            value={values.password}
            onChange={handleChangeValues}
            type="password"
          />
          <Typography variant="h6">ConfirmPassword</Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChangeValues}
            type="password"
          />
          <Box mt={2}>
            <Button
              variant="contained"
              size="small"
              sx={{ width: 200 }}
              onClick={handleEditProfile}
              disabled={isShow}
            >
              Save
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box mt={5} />
          <Typography mb={2}>Upload Image</Typography>

          <input
            type="file"
            accept="image/jpeg, image/png"
            style={{ display: "none" }}
            ref={fileRef}
            onChange={handleImage}
          />
          {preview ? (
            <Avatar
              sx={{
                height: 170,
                width: 170,
                cursor: "pointer",
              }}
              onClick={handleClickChooseFile}
              src={preview}
            />
          ) : (
            <Avatar
              sx={{
                height: 170,
                width: 170,
                cursor: "pointer",
              }}
              onClick={handleClickChooseFile}
              src={accInfo.picture || ""}
            />
          )}
          {preview && (
            <Stack flexDirection={"row"} gap={1}>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={handleCancelImage}
              >
                cancel
              </Button>
              <Button size="small" variant="contained" onClick={handleSave}>
                save
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
export default ProfileComponent;
