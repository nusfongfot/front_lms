import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Box, Button, Menu, Typography } from "@mui/material";

type Props = {
  course: any;
};

export default function MyProcess({ course }: Props) {
  const findComplete = course?.lessions?.filter(
    (item: any) => item.completed == true
  ).length;
  const findLengthCourse = course?.lessions?.length;
  const [progress, setProgress] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  React.useEffect(() => {
    setProgress((findComplete / findLengthCourse) * 100);
  }, [findComplete]);
  return (
    <Stack spacing={2} direction="row" alignItems={"center"}>
      <Box position="relative" display="inline-flex">
        <CircularProgress
          variant="determinate"
          sx={{ color: "purple" }}
          value={progress | 0}
        />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <EmojiEventsIcon />
        </Box>
      </Box>

      <Button
        variant="text"
        sx={{ color: "white" }}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Your Progress
      </Button>

      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{`success ${findComplete} from ${findLengthCourse}`}</Typography>
        </Box>
      </Menu>
    </Stack>
  );
}
