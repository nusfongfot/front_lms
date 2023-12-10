import Dashboard from "@/components/dashboard";
import Layout from "@/components/layout";
import BrowseComponent from "@/components/browse";
import InstructorComponent from "@/components/instructor";
import { usePathname } from "next/navigation";
import DetailCourse from "@/components/detail_course";
import ProfileComponent from "@/components/profile";
import { useEffect } from "react";
import { useRouter } from "next/router";
import useInfo from "@/zustand/auth";
type Props = {};
function DashPage({}: Props) {
  const path = usePathname();
  const router = useRouter();
  const { accInfo } = useInfo();
  
  useEffect(() => {
    if (accInfo.role && accInfo.role !== "instructor") {
      router.replace("/");
    }
  }, [accInfo.role]);

  if (accInfo.role && accInfo.role !== "instructor") {
    return null;
  }
  return (
    <Layout>
      {/* {path == "/dashboard/overall" && <Dashboard />} */}
      {/* {path == "/dashboard/browse" && <BrowseComponent />} */}
      {/* {path == "/dashboard/details" && <DetailCourse />} */}
      {path == "/instructor/overall" && <InstructorComponent />}
      {path == "/instructor/profile" && <ProfileComponent />}
    </Layout>
  );
}
export default DashPage;
