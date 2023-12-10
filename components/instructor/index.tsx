import { useRouter } from "next/router";
import CreateCourse from "./create_course";
import InstructorMyCourse from "./mycourse";
import CourseCompoent from "./course";
import InstructorDashBoard from "./overall";

type Props = {};
function InstructorComponent({}: Props) {
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

  return <div>{selectPage()}</div>;
}
export default InstructorComponent;
