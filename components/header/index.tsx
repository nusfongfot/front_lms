import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";

type Props = {};
const data = [
  {
    id: 1,
    title: "Expert Teachers",
    desc: "Timply dummy text of the printing and typesetting industry. Lorem Ipsum",
    icon: <PeopleIcon sx={{ width: 80, height: 80, color: "purple" }} />,
  },
  {
    id: 2,
    title: "Easy Communication",
    desc: "Timply dummy text of the printing and typesetting industry. Lorem Ipsum",
    icon: <EmailIcon sx={{ width: 80, height: 80, color: "orange" }} />,
  },
  {
    id: 3,
    title: "Get Certificates",
    desc: "Timply dummy text of the printing and typesetting industry. Lorem Ipsum",
    icon: <SchoolIcon sx={{ width: 80, height: 80, color: "blue" }} />,
  },
];
function Header({}: Props) {
  return (
    <Box>
      <img src='../images/slider-img1.jpg' className='img_banner' />
      <Container maxWidth='xl'>
        <Grid container spacing={3} mt={2}>
          {data.map((item) => (
            <Grid item xs={12} md={4} key={item.id}>
              <Paper sx={{ p: 2 }} elevation={5}>
                <Stack
                  flexDirection={"column"}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <Box>{item.icon}</Box>
                  <Typography variant='h6' fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>{item.desc}</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
export default Header;
