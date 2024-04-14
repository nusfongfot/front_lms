import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Box, Rating, Stack } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

type Props = {
  title: string;
  name: string;
  image: string;
  price: number;
  category: string;
  onClickHeadCard: () => void;
};

export default function CardCoursesService({
  title,
  name,
  price,
  image,
  category,
  onClickHeadCard,
}: Props) {
  return (
    <Box>
      <Card
        sx={{ width: 350, cursor: "pointer", height: 450 }}
        className='card'
        onClick={onClickHeadCard}
      >
        <CardMedia
          sx={{
            // width: 350,
            height: 250,
            backgroundPosition: "center",
          }}
          image={image}
          title='green iguana'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' sx={{ height: "64px" }}>
            {title}
          </Typography>
          <Typography variant='body1' color='text.secondary'>
            by {name}
          </Typography>
          <Typography variant='h5'>$ {price}</Typography>
          <Typography
            sx={{
              background: "blue",
              width: "fit-content",
              color: "white",
              borderRadius: ".5rem",
              p: 1,
            }}
            variant='subtitle2'
          >
            {category}
          </Typography>
        </CardContent>
        <Stack
          flexDirection={"column"}
          justifyContent={"space-between"}
          className='product'
        >
          <Typography variant='h5'>{title}</Typography>
          <Typography variant='subtitle2' mt={1}>
            ทั้งหมด 9 ชั่วโมง
          </Typography>
          <Typography mt={1}>
            ปูพื้นฐานสร้างแอพ iOS และ Android ด้วยภาษาเว็บ เขียนครั้งเดียวได้ถึง
            2 ระบบ
          </Typography>

          <Stack mt={1} flexDirection={"row"} alignItems={"center"} gap={2}>
            <CheckIcon />
            <Typography>สามารถสร้าง App ด้วย Corona SDK ในระดับกลาง</Typography>
          </Stack>
          <Stack mt={1} flexDirection={"row"} alignItems={"center"} gap={2}>
            <CheckIcon />
            <Typography>สามารถสร้าง App ด้วย Corona SDK ในระดับกลาง</Typography>
          </Stack>

          <Button size='small' variant='contained' fullWidth sx={{ mt: 2 }}>
            checkout
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
