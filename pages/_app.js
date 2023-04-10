import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// styles
import "../styles/globals.css";

import "@fontsource/poppins";
import "@fontsource/roboto";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
// config.autoAddCss();

import Script from "next/script";

// contexts
import { LanguageProvider } from "../context/LanguageProvider";
import { NotificationProvider } from "../context/NotificationProvider";

export default function App({ Component, pageProps }) {
  // This ensures that data is not shared
  // between different users and requests
  const [queryClient] = useState(() => new QueryClient(config));

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <Script
          src="https://kit.fontawesome.com/85074b0926.js"
          crossOrigin="anonymous"
          async
          strategy="worker"
        />
        <LanguageProvider>
          <NotificationProvider>
            <Component {...pageProps} />
          </NotificationProvider>
        </LanguageProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}
