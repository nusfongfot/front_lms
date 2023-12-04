import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import PaidIcon from "@mui/icons-material/Paid";
import SettingsIcon from "@mui/icons-material/Settings";
import { useEffect, useState } from "react";
import {
  getInstructorBalance,
  instructorPayoutSettingsAPI,
} from "@/api/instructor";
import { useLoading } from "@/zustand/loading";
import { errorToast } from "@/utils/notification";

type Props = {};
function InstructorDashBoard({}: Props) {
  const { setLoading } = useLoading();
  const [balance, setBalance] = useState<any[]>([]);

  const handlePayoutSettings = async () => {
    setLoading(true);
    try {
      const res = await instructorPayoutSettingsAPI();
      window.location.href = res.data.url;
    } catch (error: any) {
      errorToast("Payout settings error", 2000);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await getInstructorBalance();
        setBalance(res.data.pending);
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
      }
      setLoading(false);
    })();
  }, []);
  console.log(balance);
  return (
    <Box>
      <Paper sx={{ p: 2 }}>
        <Box>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4">Revenue Report</Typography>
            <PaidIcon sx={{ width: 50, height: 50 }} />
          </Stack>
          <Typography>
            You get paid directly from stripe to your bank account every 48
            hour.
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
        <Box mt={3}>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4">Pending Balance</Typography>
            <Typography variant="h5">
              {balance[0] == undefined
                ? 0
                : `$ ${(balance[0]?.amount / 100).toLocaleString("en")}`}
            </Typography>
          </Stack>
          <Typography>For 48 hours.</Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
        <Box mt={3}>
          <Stack
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Typography variant="h4">Payouts</Typography>
            <SettingsIcon
              sx={{ width: 50, height: 50, cursor: "pointer" }}
              onClick={handlePayoutSettings}
            />
          </Stack>
          <Typography>
            Update your stripe account details or view previous payouts.
          </Typography>
          <Divider sx={{ mt: 2 }} />
        </Box>
      </Paper>
    </Box>
  );
}
export default InstructorDashBoard;
