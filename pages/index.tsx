import { getProfileAPI } from "@/api/profile";
import Header from "@/components/header";
import LayoutUser from "@/components/layout-user";
import PopularCourse from "@/components/pop-courses";
import BackToTop from "@/components/scollTop";
import { errorToast } from "@/utils/notification";
import useInfo from "@/zustand/auth";
import { Container } from "@mui/material";
import { deleteCookie, getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Home() {
  const router = useRouter();
  const { setInfo, accInfo } = useInfo();

  useEffect(() => {
    (async () => {
      try {
        const  token  = getCookie("token");
        if (token) {
          const res = await getProfileAPI();
          setInfo(res.data);
        }
      } catch (error: any) {
        errorToast(error?.response?.data?.message, 2000);
        router.push("/");
        deleteCookie("token");
      }
    })();
  }, []);
  return (
    <LayoutUser>
      <BackToTop />
      <Header />
      <Container maxWidth='xl'>
        <PopularCourse />
      </Container>
    </LayoutUser>
  );
}
export default Home;
