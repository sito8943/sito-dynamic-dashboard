import React, { useCallback, useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";

// some-javascript-utils
import { createCookie, getCookie } from "some-javascript-utils/browser";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExternalLink,
  faCookieBite,
} from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

import config from "../../config";

const CookieBox = (props) => {
  const { sx } = props;
  const { languageState } = useLanguage();
  const [hide, setHide] = useState(true);

  const { cookieBox, buttons } = useMemo(() => {
    return {
      cookieBox: languageState.texts.cookieBox,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const acceptCookie = () => {
    setHide(true);
    createCookie(config.acceptCookie, 730, true);
  };

  const declineCookie = () => {
    setHide(true);
    createCookie(config.declineCookie, 730, true);
  };

  useEffect(() => {
    if (!getCookie(config.acceptCookie) && !getCookie(config.declineCookie))
      setHide(false);
    else setHide(true);
  }, []);

  const printCookieBox = useCallback(() => {
    if (!hide)
      return (
        <div
          className={`p-5 fixed z-50 left-1 bottom-1 rounded-scard bg-light-background dark:bg-dark-background ${css(
            {
              opacity: hide ? 0 : 1,
              width: "300px",
              border: "1px solid #8080804a",
              ...sx,
            }
          )}`}
        >
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexWrap: "wrap",
            })}
          >
            <div className="flex gap-5">
              <FontAwesomeIcon
                className="text-3xl dark:text-plight text-pdark"
                icon={faCookieBite}
              />
              <p
                className={`text-dark-background2 dark:text-white ${css({
                  marginRight: "10px",
                })}`}
              >
                {cookieBox.description}.{" "}
                <Link to="/cookie-policy" className="underline">
                  {cookieBox.link}
                  <FontAwesomeIcon
                    icon={faExternalLink}
                    className="ml-1 text-sm"
                  />
                </Link>
                .
              </p>
            </div>
            <div
              className={css({ display: "flex", gap: "10px", width: "170px" })}
            >
              <button onClick={acceptCookie} className="submit">
                {buttons.accept}
              </button>
              <button onClick={declineCookie} className="secondary">
                {buttons.decline}
              </button>
            </div>
          </div>
        </div>
      );
    else return null;
  }, [hide]);

  return printCookieBox();
};

export default CookieBox;
