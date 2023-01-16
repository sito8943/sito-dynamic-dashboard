// @ts-check

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { getUserLanguage } from "some-javascript-utils/browser";

// context
import { useLanguage } from "../context/LanguageProvider";

// layouts
import Head from "../layout/Head";
import Body from "../layout/Body";

// config
import config from "../lib/config";

// styles
import styles from "../styles/Home.module.css";

export default function Home() {
  const { languageState, setLanguageState } = useLanguage();

  const homeText = useMemo(() => {
    return languageState.texts.Home;
  }, [languageState]);

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  return (
    <>
      <Head />
      <Body>
        <div></div>
      </Body>
    </>
  );
}
