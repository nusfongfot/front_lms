import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useLoading } from "@/zustand/loading";
import { resetPassAPI } from "@/api/auth";
import { errorToast, successToast } from "@/utils/notification";
import EmailIcon from "@mui/icons-material/Email";
import { Stack } from "@mui/material";

const defaultTheme = createTheme();

export default function MyForgetPass() {
  const { setLoading } = useLoading();
  const [emailUser, setEmailUser] = React.useState<string>("");
  const [isShow, setIsShow] = React.useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const body: any = {
        email: data.get("email"),
      };
      const res = await resetPassAPI(body);
      successToast(res.message, 2000);
      setEmailUser(body.email);
      setIsShow(true);
    } catch (error: any) {
      errorToast(error.response.data.message, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />

        {isShow ? (
          <Stack
            alignItems={"center"}
            flexDirection={"column"}
            justifyContent={"center"}
            minHeight={"100vh"}
          >
            <EmailIcon sx={{ width: 80, height: 80, color: "green" }} />
            <Typography variant="h3">
              {`We send new password to ${emailUser} please check your email`}
            </Typography>
            <Button
              size="small"
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => window.location.replace("/")}
            >
              back to login
            </Button>
          </Stack>
        ) : (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              ForgetPassword
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3, width: 500 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}
