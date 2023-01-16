// @ts-check

import React, { useEffect } from "react";

import { getUserLanguage } from "some-javascript-utils/browser";

// context
import { useLanguage } from "../context/LanguageProvider";

// layouts
import Head from "./layout/Head";
import Body from "./layout/Body";

// config
import config from "../lib/config";

export default function Home() {
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  return (
    <>
      <div>
        <Head />
        <Body />
      </div>
    </>
  );
}
