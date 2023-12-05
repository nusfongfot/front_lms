import SimpleBackdrop from "@/components/loading";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-quill/dist/quill.snow.css";
import { useEffect } from "react";
import { getProfileAPI } from "@/api/profile";
import { errorToast } from "@/utils/notification";
import { useRouter } from "next/router";
import useInfo from "@/zustand/auth";
import { deleteCookie } from "cookies-next";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { setInfo, accInfo } = useInfo();

  useEffect(() => {
    (async () => {
      try {
        if (typeof window !== "undefined" && localStorage.getItem("tokenLms")) {
          const res = await getProfileAPI();
          setInfo(res.data);
        }
      } catch (error: any) {
        errorToast(error.response.data.message, 2000);
        router.push("/");
        deleteCookie("token");
        localStorage.removeItem("tokenLms");
      }
    })();
  }, [accInfo.id]);
  return (
    <>
      <Head>
        <title>E-learning</title>
      </Head>
      <ToastContainer />
      <SimpleBackdrop />
      <Component {...pageProps} />
    </>
  );
}
