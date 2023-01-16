import "../styles/globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
config.autoAddCss = false;

import Script from "next/script";

// contexts
import { LanguageProvider } from "../context/LanguageProvider";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        src="https://kit.fontawesome.com/85074b0926.js"
        crossOrigin="anonymous"
        async
        strategy="worker"
      />
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </>
  );
}
