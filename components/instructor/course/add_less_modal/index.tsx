import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { errorToast, successToast } from "@/utils/notification";
import { uploadVideoAPI } from "@/api/upload";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import {
  createLessionOfCourseAPI,
  updateLessionOfCourseAPI,
} from "@/api/course";
import useInfo from "@/zustand/auth";
import { useRouter } from "next/router";
import ReactPlayer from "react-player";

type Props = {
  openAdd: boolean;
  handleCloseAdd: () => void;
  setLessions: React.Dispatch<React.SetStateAction<any[]>>;
  lessions: any[];
  isEditLess: boolean;
  lesson: any;
  setLesson: React.Dispatch<React.SetStateAction<{}>>;
};

export default function DialodAddLession({
  handleCloseAdd,
  openAdd,
  setLessions,
  lessions,
  isEditLess,
  lesson,
  setLesson,
}: Props) {
  const { accInfo } = useInfo();
  const { query } = useRouter();
  const [videoFile, setVideoFile] = React.useState<File | null>(null);
  const [values, setValues] = React.useState({
    name: "",
    content: "",
    video: "",
  });
  const [loadingBtn, setLoadingBtn] = React.useState(false);
  const [isShow, setIsShow] = React.useState(false);
  const [isPreview, setIsPreview] = React.useState(false);

  const handleChangeValues = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoadingBtn(true);
    try {
      const formData: FormData = new FormData();
      formData.append("video", videoFile as any);
      const video = await uploadVideoAPI(formData);
      const body = {
        userId: accInfo.id,
        courseId: query.id,
        name: values.name,
        content: values.content,
        video: video.video,
        free_preview: isPreview,
      };
      const res = await createLessionOfCourseAPI(body);
      setLessions([...lessions, res.data]);
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoadingBtn(false);
      setValues({
        name: "",
        content: "",
        video: "",
      });
      setVideoFile(null);
      handleCloseAdd();
    }
  };
  const handleEdit = async () => {
    setLoadingBtn(true);
    try {
      let videoLink: any = "";
      if (videoFile) {
        const formData: FormData = new FormData();
        formData.append("video", videoFile as any);
        videoLink = await uploadVideoAPI(formData);
      }

      const body = {
        name: values.name,
        content: values.content,
        video: videoLink.video ? videoLink.video : values.video,
        free_preview: isPreview,
      };
      const res = await updateLessionOfCourseAPI(lesson.id, body);
      setLessions((prevState) =>
        prevState.map((item) =>
          item.id == lesson.id
            ? {
                ...item,
                name: values.name,
                content: values.content,
                video: videoLink.video ? videoLink.video : values.video,
              }
            : item
        )
      );
      successToast(res.message, 2000);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoadingBtn(false);
      setValues({
        name: "",
        content: "",
        video: "",
      });
      setVideoFile(null);
      handleCloseAdd();
    }
  };

  React.useEffect(() => {
    if (isEditLess) {
      setValues({
        name: lesson.name,
        content: lesson.content,
        video: lesson.video,
      });
    } else {
      setValues({
        name: "",
        content: "",
        video: "",
      });
    }
    setIsShow(false);
  }, [isEditLess, lesson]);
  return (
    <React.Fragment>
      <Dialog
        open={openAdd}
        onClose={handleCloseAdd}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {isEditLess ? "Edit lesson" : "+Add Lession"}
        </DialogTitle>
        <DialogContent>
          <Typography>Title</Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            name="name"
            value={values.name}
            onChange={handleChangeValues}
          />
          <Typography>Content</Typography>
          <TextField
            size="small"
            sx={{ width: 500 }}
            multiline
            maxRows={6}
            name="content"
            value={values.content}
            onChange={handleChangeValues}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  defaultChecked={lesson?.free_preview}
                  value={isPreview}
                  onChange={(e) => setIsPreview(e.target.checked)}
                />
              }
              label="Free Preview Video"
            />
          </FormGroup>
          <Typography>Upload Video</Typography>
          {isEditLess && (
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    value={isShow}
                    onChange={(e) => setIsShow(e.target.checked)}
                  />
                }
                label="Preview Old Video"
              />
            </FormGroup>
          )}
          {isShow && (
            <ReactPlayer
              url={values.video}
              width={"100%"}
              height={"240px"}
              controls={isShow}
            />
          )}
          <input type="file" accept="video/*" onChange={handleVideoChange} />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={handleCloseAdd}
          >
            Cancel
          </Button>

          <LoadingButton
            loading={loadingBtn}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            size="small"
            onClick={isEditLess ? handleEdit : handleSave}
          >
            Save
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
