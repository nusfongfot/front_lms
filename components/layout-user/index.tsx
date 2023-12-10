import { ReactNode } from "react";
import Footer from "../footer";
import MyNavBar from "../navbar";

type Props = {
  children: ReactNode;
};
function LayoutUser({ children }: Props) {
  return (
    <div>
      <MyNavBar />
      {children}
      <Footer />
    </div>
  );
}
export default LayoutUser;
