import "../styles/globals.css";
import { useEffect } from "react";
// @ts-ignore
import AOS from "aos";
import "aos/dist/aos.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    AOS.init({
      delay: 200,
      duration: 1200,
    });
  });

  return <Component {...pageProps} />;
}

export default MyApp;
