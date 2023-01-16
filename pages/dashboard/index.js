import React, { useMemo, useEffect } from "react";

import { getUserLanguage } from "some-javascript-utils/browser";

// styles
import styles from "../../styles/Dashboard.module.css";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// components
import Link from "../../components/Link/Link";

// layouts
import Head from "../../layout/Head";
import Body from "../../layout/Body";

const Login = () => {
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  const dashboardText = useMemo(() => {
    return languageState.texts.Login;
  }, [languageState]);

  const submit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Head />
      <Body>
        <div className="bg-dark-blood flex w-viewport h-viewport">
          <div
            className={`${styles.sidebar} bg-sidebar h-viewport flex flex-col`}
          >
            {dashboardText.sidebar.map((item) => (
              <Link key={item.label} href={item.action}>
                {item.label}
              </Link>
            ))}
          </div>
          Dashboard
        </div>
      </Body>
    </>
  );
};

export default Login;
