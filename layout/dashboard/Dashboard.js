import React, { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/router";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// components
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
      switch (active) {
        case "insert":
          return <Form model={formText} />;

        default:
          return <List />;
      }
    },
    [formText]
  );

  return (
    <div className="w-full h-full md:p-tablet xs:p-mobil">
      <h4 className="text-h4">{dashboardText.Title}</h4>
      <div className="tabs flex align-center gap-10">
        <button
          type="button"
          onClick={() => setActive("list")}
          className={`${styles["tab-button"]} ${
            active === "list" ? "bg-dodger" : styles["no-active"]
          }`}
        >
          {buttons.list}
        </button>
        <button
          type="button"
          onClick={() => setActive("insert")}
          className={`${styles["tab-button"]} ${
            active === "insert" ? "bg-dodger" : styles["no-active"]
          }`}
        >
          {buttons.insert}
        </button>
      </div>
      <div className={`${styles.container}`}>{getLayout(active)}</div>
    </div>
  );
};

export default Centers;