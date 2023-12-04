import Dashboard from "@/components/dashboard";
import Layout from "@/components/layout";
import BrowseComponent from "@/components/browse";
import InstructorComponent from "@/components/instructor";
import { usePathname } from "next/navigation";
import DetailCourse from "@/components/detail_course";
import ProfileComponent from "@/components/profile";
type Props = {};
function DashPage({}: Props) {
  const path = usePathname();

  return (
    <Layout>
      {path == "/dashboard/overall" && <Dashboard />}
      {path == "/dashboard/browse" && <BrowseComponent />}
      {path == "/dashboard/instructor" && <InstructorComponent />}
      {path == "/dashboard/details" && <DetailCourse />}
      {path == "/dashboard/profile" && <ProfileComponent />}
    </Layout>
  );
}
export default DashPage;
