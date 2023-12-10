import DetailCourse from "@/components/detail_course";
import LayoutUser from "@/components/layout-user";
import BackToTop from "@/components/scollTop";
import { Container } from "@mui/material";

type Props = {};
export default function CourseDetailPage({}: Props) {
  return (
    <LayoutUser>
      <BackToTop />
      <Container maxWidth='xl' sx={{ mt: 8 }}>
        <DetailCourse />
      </Container>
    </LayoutUser>
  );
}
