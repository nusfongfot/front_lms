import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import SyncDisabledIcon from "@mui/icons-material/SyncDisabled";

type Props = {};
function StripeCanCelPage({}: Props) {
  const router = useRouter();
  return (
    <Container maxWidth="xl">
      <Stack
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        minHeight={"100vh"}
      >
        <SyncDisabledIcon sx={{ width: 150, height: 150, color: "red" }} />
        <Typography variant="h4" color={"error"} mb={2}>
          Payment Failed. Please Try Again.
        </Typography>
        <Button
          variant="contained"
          size="small"
          onClick={() => router.replace("/dashboard/overall")}
        >
          back to home
        </Button>
      </Stack>
    </Container>
  );
}
export default StripeCanCelPage;
