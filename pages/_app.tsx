import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { MetamaskProvider } from "../components/MetamaskProvider";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
      <Toaster />
    </MetamaskProvider>
  );
}

export default MyApp;
