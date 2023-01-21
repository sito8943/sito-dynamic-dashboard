import React, { useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/router";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// components
import Link from "../../Link/Link";

// styles
import styles from "../../../styles/Drawer.module.css";

// contexts
import { useLanguage } from "../../../context/LanguageProvider";

const Drawer = ({ visible, onClose }) => {
  const router = useRouter();

  const { languageState } = useLanguage();

  const { navbarText, appName } = useMemo(() => {
    return {
      navbarText: languageState.texts.Navbar,
      appName: languageState.texts.AppName,
    };
  }, [languageState]);

  const onResize = useCallback(() => {
    if (window.innerWidth > 800) onClose();
  }, [onClose]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [onResize]);

  return (
    <div className={`${styles.container}  ${!visible ? styles.off : ""}`}>
      <div
        className={`${styles.drawer} bg-blood ${!visible ? styles.close : ""}`}
      >
        <button onClick={onClose} className={styles.button}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Link href="/" className="w-app-name">
          <span className="text-dodger">{appName}</span>
        </Link>
        {navbarText.Links.map((item) => (
          <Link
            className={`transition w-full ease duration-150 hover:bg-dodger-700 hover:text-white p-active rounded-20px ${
              router.asPath === `/${item.href}` ? "bg-dodger" : ""
            }`}
            key={item.label}
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Drawer;
