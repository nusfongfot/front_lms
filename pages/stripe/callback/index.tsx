import { Container, Stack, Typography } from "@mui/material";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { useEffect } from "react";
import { getAccountStatusAPI } from "@/api/instructor";
import { errorToast, successToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";

type Props = {};
function StripeCallBack({}: Props) {
  const { setLoading } = useLoading();
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await getAccountStatusAPI();
        successToast(
          "Become Instructor Successfully. Please login again",
          3500
        );
        window.location.replace("/");
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Container maxWidth="xl">
      <Stack
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
      >
        <AssignmentTurnedInIcon
          sx={{ width: 150, height: 150, color: "green" }}
        />
        <Typography variant="h4" color={"success"} mb={2}>
          Become Instructor Successfully.
        </Typography>
      </Stack>
    </Container>
  );
}
export default StripeCallBack;
