import React, { useCallback, useEffect, useState, useMemo } from "react";
// react-router-dom
import { Link, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";

// sito components
import SitoImage from "sito-image";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faBell,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { faBell as faBellEmpty } from "@fortawesome/free-regular-svg-icons";

// utils
import getIcon from "../icons.jsx";
import { utilsToggleTheme } from "../../utils/utils.js";

// contexts
import { useMode } from "../../contexts/ModeProvider.jsx";
import { useLanguage } from "../../contexts/LanguageProvider.jsx";
import { useNotification } from "../../contexts/NotificationProvider.jsx";

// styles
import "./styles.css";

// images
import logo from "../../assets/images/logo.svg";

export default function Navbar() {
  const location = useLocation();

  const { languageState } = useLanguage();

  const { errors, sidebar, tooltips } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
      sidebar: languageState.texts.sidebar,
      tooltips: languageState.texts.tooltips,
    };
  }, [languageState]);

  const { modeState, setModeState } = useMode();
  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const toggleMode = () => setModeState({ type: "toggle" });

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const fetch = async () => {
    setLoadingNotifications(true);
    /* try {
            const response = await getNotifications();
            if (response.status === 200) {
                const { data } = response;
                const parsedNotifications = data.notifications.length ? data.notifications : [];
                setNotifications(parsedNotifications);
            } else showNotification("error", languageState.texts.Errors.SomeWrong);
        } catch (err) {
            showNotification("error", languageState.texts.Errors.NotConnected);
        } */
    setLoadingNotifications(false);
  };

  const retry = () => fetch();

  useEffect(() => {
    retry();
  }, []);

  const toggleTheme = () => {
    utilsToggleTheme();
    setModeState({ type: "toggle" });
  };

  const printIcon = useCallback(() => {
    const { pathname } = location;
    let parsePathname = pathname;
    if (parsePathname.lastIndexOf("/") !== 0)
      parsePathname = `/${parsePathname.split("/")[1]}/`;
    return getIcon(parsePathname, "text-dark-background dark:text-white-hover");
  }, [location]);

  const printModel = useCallback(() => {
    const { pathname } = location;
    let parsePathname = pathname;
    if (parsePathname.lastIndexOf("/") !== 0)
      parsePathname = `/${parsePathname.split("/")[1]}/`;
    return sidebar.actions[parsePathname]?.label;
  }, [location, languageState]);

  const [isInView, setIsInView] = useState(true);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top >= 69) setIsInView(false);
      else setIsInView(true);
    },
    [setIsInView]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <div className="nav flex justify-between w-full py-5 mx-0 px-5">
      <div className="model flex items-center gap-2 w-full">
        {printIcon()}
        <hr className="border-1 border-solid h-full border-dark-background dark:border-white-hover" />
        <span className="text-dark-background dark:text-white-hover font-bold">
          {printModel()}
        </span>
      </div>
      <div className="no-model navbar-logo invert dark:invert-0">
        {/* <SitoImage src={logo} alt="ire-a-santiago logo " /> */}
        LOGO
      </div>
      <div
        className={`aux-buttons ${
          !isInView
            ? "fixed top-5 right-5 bg-light-background2 dark:bg-dark-background2 rounded-button px-5 py-2"
            : ""
        }`}
      >
        <Tippy content={tooltips.logout}>
          <Link to="/auth/sign-out">
            <button className="icon-button">
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </Link>
        </Tippy>
        <Tippy content={tooltips.changeMode}>
          <button onClick={toggleTheme} className="icon-button">
            <FontAwesomeIcon icon={modeState.mode ? faMoon : faSun} />
          </button>
        </Tippy>
        <Tippy content={tooltips.notifications}>
          <button onClick={() => {}} className="icon-button">
            <FontAwesomeIcon
              icon={notifications.length ? faBell : faBellEmpty}
            />
          </button>
        </Tippy>
      </div>
    </div>
  );
}
