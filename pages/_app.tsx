import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

import { MetamaskProvider } from "../components/MetamaskProvider";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MetamaskProvider>
      <Component {...pageProps} />
      <Toaster
        toastOptions={{
          style: {
            fontSize: "1.2rem",
          },
        }}
      />
    </MetamaskProvider>
  );
}

export default MyApp;
