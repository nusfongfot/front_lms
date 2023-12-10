import { Container, Grid, Paper, Stack, Typography } from "@mui/material";

type Props = {};
function Footer({}: Props) {
  return (
    <Paper sx={{ background: "black", color: "white", mt: 5 }}>
      <Container maxWidth='lg' sx={{ pt: 10, pb: 10 }}>
        <Grid container>
          <Grid item xs={12} lg={3}>
            <Stack
              flexDirection={"column"}
              justifyContent={"flex-start"}
              gap={0.5}
            >
              <Typography variant='h5'>Abular</Typography>
              <Typography mt={3}>+163 123 7884</Typography>
              <Typography>support@website.com</Typography>
              <Typography>Melbourne, Australia, 105 South</Typography>
              <Typography>Park Avenue</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack
              flexDirection={"column"}
              justifyContent={"flex-start"}
              gap={0.5}
            >
              <Typography variant='h5'>Company</Typography>
              <Typography mt={3}>About us</Typography>
              <Typography>Contact us</Typography>
              <Typography>Become a Teacher</Typography>
              <Typography>Support</Typography>
              <Typography>FAQs</Typography>
              <Typography>Blog</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack
              flexDirection={"column"}
              justifyContent={"flex-start"}
              gap={0.5}
            >
              <Typography variant='h5'>Courses</Typography>
              <Typography mt={3}>Web Development</Typography>
              <Typography>Hacking</Typography>
              <Typography>PHP Learning</Typography>
              <Typography>English</Typography>
              <Typography>Marketing</Typography>
              <Typography>Financial</Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} lg={3}>
            <Stack
              flexDirection={"column"}
              justifyContent={"flex-start"}
              gap={0.5}
            >
              <Typography variant='h5'>Download App</Typography>
              <Typography mt={3}>
                Download our mobile app and learn on the go.
              </Typography>
              <img
                src='../images/appstore.png'
                style={{ width: "60%", height: 40 }}
              />
              <img
                src='../images/googleplay.png'
                style={{ width: "60%", height: 40, marginTop: 10 }}
              />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Paper>
  );
}
export default Footer;
