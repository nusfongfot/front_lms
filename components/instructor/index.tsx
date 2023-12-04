import { useRouter } from "next/router";
import CreateCourse from "./create_course";
import InstructorMyCourse from "./mycourse";
import CourseCompoent from "./course";
import useInfo from "@/zustand/auth";
import { useEffect } from "react";
import InstructorDashBoard from "./overall";

type Props = {};
function InstructorComponent({}: Props) {
  const { accInfo } = useInfo();
  const router = useRouter();

  const selectPage = () => {
    if (router?.query?.subpath == "overall") {
      return <InstructorDashBoard />;
    }
    if (router?.query?.subpath == "mycourse") {
      return <InstructorMyCourse />;
    }
    if (router?.query?.subpath == "create") {
      return <CreateCourse />;
    }
    if (router?.query?.subpath == "course") {
      return <CourseCompoent />;
    }
  };

  useEffect(() => {
    if (accInfo.role !== "instructor") {
      router.replace("/dashboard/overall");
    }
  }, [accInfo.role]);

  if (accInfo.role !== "instructor") {
    return null;
  }

  return <div>{selectPage()}</div>;
}
export default InstructorComponent;
