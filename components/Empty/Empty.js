import React, { useMemo } from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMeh } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../context/LanguageProvider";

// styles
import styles from "../../styles/Empty.module.css";

const Empty = () => {
  const { languageState } = useLanguage();

  const emptyText = useMemo(() => {
    return languageState.texts.Empty;
  }, [languageState]);

  return (
    <div
      className={`${styles.container} gap-10 flex flex-col justify-center items-center w-full h-full`}
    >
      <FontAwesomeIcon icon={faMeh} className={styles.empty} />
      <p className="text-center">{emptyText.title}</p>
    </div>
  );
};

export default Empty;
