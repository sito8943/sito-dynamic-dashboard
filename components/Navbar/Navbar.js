"use client";
import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/router";

// components
import Link from "../Link/Link";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faBars,
  faArrowRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

// styles
import styles from "../../styles/Navbar.module.css";

// lang
import { useLanguage } from "../../context/LanguageProvider";

// utils
import { logUser, logoutUser, userLogged } from "../../lib/auth";

// components
import Drawer from "./Drawer/Drawer";
import Loading from "../Loading/Loading";

const Navbar = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [hasUser, setHasUser] = useState(false);
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    if (logout) {
      logoutUser();
      setLogout(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }, [logout]);

  const { languageState } = useLanguage();

  const { navbarText, appName } = useMemo(() => {
    return {
      navbarText: languageState.texts.Navbar,
      appName: languageState.texts.AppName,
    };
  }, [languageState]);

  const [showSearch, setShowSearch] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    if (userLogged()) setHasUser(true);
    else setHasUser(false);
    setLoading(false);
  }, []);

  return (
    <nav className={`${styles.navbar} bg-blood`}>
      {loading ? <Loading className="fixed top-0 left-0 bg-blood" /> : null}
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
        <Link
          className={`cursor-pointer   transition ease duration-150 hover:bg-dark-dodger ${hasUser ? "px-5 py-1" : "bg-dodger px-5 py-1 min-w-button"} rounded-20px flex justify-center ${
            router.asPath === `/${navbarText.cta.href}` ? "bg-dodger" : ""
          }`}
          href={!hasUser ? navbarText.cta.href : navbarText.cta.loggedHref}
        >
          {hasUser ? navbarText.cta.logged : navbarText.cta.label}
        </Link>

        <button
          id="search"
          onClick={() => setShowSearch(true)}
          className={styles.icon}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        {hasUser ? (
          <button
            id="log-out"
            onClick={() => setLogout(true)}
            className={styles.icon}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
