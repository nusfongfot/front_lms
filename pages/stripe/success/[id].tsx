import { Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import PaidIcon from "@mui/icons-material/Paid";
import { useEffect } from "react";
import { stripePaidSuccussAPI } from "@/api/course";
import { errorToast } from "@/utils/notification";
import { useLoading } from "@/zustand/loading";
import useInfo from "@/zustand/auth";

type Props = {};
function StripeSuccessPage({}: Props) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { accInfo, setInfo } = useInfo();
  const id = router?.query?.id as string;

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (id !== undefined) {
          const res = await stripePaidSuccussAPI(id);
          router.replace(`/user/course/${id}`);
          setInfo({
            ...accInfo,
            courses: [res.course],
          });
        }
      } catch (error: any) {
        errorToast(error.message, 2000);
        router.replace("/");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  return (
    <Container maxWidth='xl'>
      <Stack
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
      >
        <PaidIcon sx={{ width: 150, height: 150, color: "green" }} />
        <Typography variant='h4' mb={2}>
          Payment Successfully
        </Typography>
      </Stack>
    </Container>
  );
}
export default StripeSuccessPage;
