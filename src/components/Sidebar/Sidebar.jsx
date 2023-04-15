import React, { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// sito components
import SitoImage from "sito-image";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// styles
import "./styles.css";

// utils
import getIcon from "../icons";
import { hasApps, hasExactApp } from "../../utils/auth.js";

// images
import logo from "../../assets/images/logonotext.png";

export default function Sidebar(props) {
  const location = useLocation();
  const { languageState } = useLanguage();

  const { sidebar, appName } = useMemo(() => {
    return {
      sidebar: languageState.texts.sidebar,
      appName: languageState.texts.appName,
    };
  }, [languageState]);

  const applyToPrint = (item) => {
    if (item.admin === 0) return true;
    else if (
      (item.admin === 1 && !hasApps()) ||
      (item.admin < 0 && hasApps())
    ) {
      if (
        (hasExactApp("marketplace") && item.admin === -1) ||
        (hasExactApp("carnaval") && item.admin === -2) ||
        (item.admin === 1 && !hasApps())
      )
        return true;
    }
    return false;
  };

  const printLinks = useCallback(() => {
    const { pathname } = location;
    let parsePathname = pathname;
    if (parsePathname.lastIndexOf("/") !== 0)
      parsePathname = `/${parsePathname.split("/")[1]}/`;
    return Object.values(sidebar.actions)
      .filter((item) => applyToPrint(item))
      .map((item) => (
        <Link
          key={item.to}
          className={`sidebar-link ${
            item.to === parsePathname
              ? "active"
              : "hover:text-primary dark:hover:text-primary"
          }`}
          to={item.to}
        >
          {getIcon(item.to)}
          <span className="mt-1 sidebar-link-label">{item.label}</span>
          {item.to === parsePathname ? <hr /> : null}
        </Link>
      ));
  }, [languageState, location]);

  return (
    <div className="sidebar h-full flex flex-col items-center justify-start mb-5 mx-0">
      <div className="model flex flex-col items-center justify-center gap-2 mb-2">
        <div className="sidebar-logo">
          {/* <SitoImage src={logo} alt="ire-a-santiago logo" /> */}
          LOGO
        </div>
        <h2 className="text-3xl font-bold text-dark-background2 dark:text-white">
          {appName}
        </h2>
      </div>
      <div className="w-full flex flex-col items-center justify-center">
        {printLinks()}
      </div>
    </div>
  );
}
