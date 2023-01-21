"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";

// components
import Link from "../Link/Link";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars } from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "../../styles/Navbar.module.css";

// lang
import { useLanguage } from "../../context/LanguageProvider";

// components
import Drawer from "./Drawer/Drawer";

const Navbar = () => {
  const router = useRouter();

  const { languageState } = useLanguage();

  const { navbarText, appName } = useMemo(() => {
    return {
      navbarText: languageState.texts.Navbar,
      appName: languageState.texts.AppName,
    };
  }, [languageState]);

  const [showSearch, setShowSearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  return (
    <nav className={`${styles.navbar} bg-blood`}>
      <Drawer visible={showDrawer} onClose={() => setShowDrawer(false)} />
      <div className={styles.left}>
        <button onClick={() => setShowDrawer(true)} className={styles.toggle}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <Link href="/" className="w-app-name">
          <span className="text-dodger">{appName}</span>
        </Link>
      </div>

      <div className={styles.right}>
        <div className={`${styles.links} flex`}>
          {navbarText.Links.map((item) => (
            <Link
              className={`transition ease duration-150 hover:bg-dodger p-active rounded-20px ${
                router.asPath === `/${item.href}` ? "bg-dodger" : ""
              }`}
              key={item.label}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button
          onClick={() => setShowSearch(true)}
          className="p-icon rounded-circle w-icon h-icon transition ease duration-150 text-dodger hover:text-white hover:bg-dodger"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
