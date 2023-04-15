import React, { useMemo } from "react";
import { Link } from "react-router-dom";

// @emotion/css
import { css } from "@emotion/css";

// fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLink,
  faFaceFrownOpen,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";
import { useMode } from "../../contexts/ModeProvider";

// images
import logo from "../../assets/images/logo.svg";

// utils
import { utilsToggleTheme } from "../../utils/utils";

// styles
import "./style.css";

export default function NotFound({ index }) {
  const { languageState } = useLanguage();

  const { modeState, setModeState } = useMode();

  const toggleTheme = () => {
    utilsToggleTheme();
    setModeState({ type: "toggle" });
  };

  const { notFound, buttons } = useMemo(() => {
    return {
      notFound: languageState.texts.notFound,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  return (
    <div>
      <button
        onClick={toggleTheme}
        className="text-dark-background dark:text-white-hover text-xl rounded-circle transition hover:text-primary dark:hover:text-primary fixed top-5 right-5"
      >
        <FontAwesomeIcon icon={modeState.mode ? faMoon : faSun} />
      </button>
      <div className="w-full not-found-container flex items-center dark:bg-dark-background2 bg-light-background2">
        <div className="not-found flex-1 w-full h-full flex flex-col gap-3 items-center justify-center">
          <h1 className="text-h3 font-bold dark:text-white text-dark-background2">
            {notFound.title} 404
          </h1>
          <p className="dark:text-white-hover text-dark-background2">
            {notFound.body}
          </p>
          <Link to={index || "/"}>
            <button className="bg-primary font-medium text-white rounded-button p-button text-background transition dark:hover:bg-pdark hover:bg-pdark gap-2 flex items-center">
              {buttons.home}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
