import React, { useMemo, useEffect, useCallback, useState } from "react";
import { useRouter } from "next/router";

import { getUserLanguage } from "some-javascript-utils/browser";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// components
import Link from "../Link/Link";

// styles
import styles from "../../styles/Dashboard.module.css";

const Sidebar = () => {
  const router = useRouter();

  const [pathName, setPathName] = useState("");
  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    try {
      // setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  const dashboardText = useMemo(() => {
    return languageState.texts.Home;
  }, [languageState]);

  useEffect(() => {
    setPathName(router.asPath);
  }, [router]);

  const printLinks = useCallback(
    () =>
      dashboardText.Sidebar.Links.map((item) => (
        <Link
          className={` ${
            pathName === item.href ? "bg-dodger" : ""
          } cursor-pointer w-full transition ease duration-150 hover:bg-dodger hover:text-white p-active rounded-20px`}
          key={item.label}
          href={item.href}
        >
          {/* console.log(item.href, router.asPath, router.asPath === item.href) */}
          {item.label}
        </Link>
      )),
    [pathName, dashboardText]
  );

  return (
    <div
      className={`${styles.sidebar} bg-sidebar h-viewport flex flex-col p-tablet gap-10`}
    >
      <h2 className="text-h4">{dashboardText.Sidebar.Title}</h2>
      {printLinks()}
    </div>
  );
};

export default Sidebar;
