import React, { useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

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
import Medicines from "../../layout/dashboard/Medicines";
import Centers from "../../layout/dashboard/Centers";
import Dashboard from "../../layout/dashboard/Dashboard";

import config from "../../lib/config";

const Login = () => {
  const router = useRouter();
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  const dashboardText = useMemo(() => {
    return languageState.texts.Home;
  }, [languageState]);

  const submit = (e) => {
    e.preventDefault();
  };

  const getLayout = useCallback(() => {
    console.log(router);
    const { query } = router;
    const { seeing } = query;
    switch (seeing) {
      case "medicines":
        return <Medicines />;
      case "centers":
        return <Centers />;
      default:
        return <Dashboard />;
    }
  }, [router]);

  return (
    <>
      <Head />
      <Body>
        <div className="bg-dark-blood flex w-viewport h-viewport">
          <div
            className={`${styles.sidebar} bg-sidebar h-viewport flex flex-col p-tablet gap-10`}
          >
            <h2 className="text-h4">{dashboardText.Sidebar.title}</h2>
            {dashboardText.Sidebar.links.map((item) => (
              <Link
                className={`cursor-pointer transition w-full ease duration-150 hover:bg-dodger hover:text-white p-active rounded-20px ${
                  router.asPath === item.href ? "bg-dodger" : ""
                }`}
                key={item.label}
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>
          {getLayout()}
        </div>
      </Body>
    </>
  );
};

export default Login;
