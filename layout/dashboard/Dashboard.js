import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// components
import Link from "../../components/Link/Link";
import List from "./subs/List";
import Form from "./subs/Form";

// styles
import styles from "../../styles/Dashboard.module.css";

const Centers = () => {
  const router = useRouter();

  const { languageState } = useLanguage();
  const [active, setActive] = useState("list");

  const { dashboardText, buttons, labels, formText } = useMemo(() => {
    const { query } = router;
    const { seeing } = query;
    return {
      dashboardText: languageState.texts.Home[seeing || "dashboard"],
      formText: languageState.texts.Home.Forms[seeing || "dashboard"],
      buttons: languageState.texts.Buttons,
      labels: languageState.texts.Labels,
    };
  }, [languageState, router]);

  const getLayout = useCallback(
    (active) => {
      const { query } = router;
      const { seeing } = query;
      switch (active) {
        case "insert":
          return <Form model={formText} />;
        default:
          if (seeing) return <List model={seeing} />;
          return <div></div>;
      }
    },
    [formText, router]
  );

  const toNavigate = useCallback(
    (param) => {
      const { query } = router;
      const { seeing } = query;
      return `/dashboard?seeing=${seeing}&doing=${param}`;
    },
    [router]
  );

  useEffect(() => {
    const { doing } = router.query;
    switch (doing) {
      case "insert":
        setActive("insert");
        break;
      default:
        setActive("list");
        break;
    }
    return () => {};
  }, [router]);

  return (
    <div className="w-full h-full md:p-tablet xs:p-mobil">
      <h4 className="text-h4">{dashboardText.Title}</h4>
      <div className="tabs flex items-center gap-10">
        <Link
          href={`${toNavigate("list")}`}
          className={`${
            styles["tab-button"]
          } text-center transition ease duration-150  ${
            active === "list" ? "bg-dodger" : styles["no-active"]
          }`}
        >
          {buttons.list}
        </Link>
        <Link
          href={`${toNavigate("insert")}`}
          className={`${
            styles["tab-button"]
          } text-center transition ease duration-150 text-white hover:bg-dodger hover:text-white ${
            active === "insert" ? "bg-dodger" : styles["no-active"]
          }`}
        >
          {buttons.insert}
        </Link>
      </div>
      <div className={`${styles.container}`}>{getLayout(active)}</div>
    </div>
  );
};

export default Centers;
