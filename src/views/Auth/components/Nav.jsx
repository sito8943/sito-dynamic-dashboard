import React, { useMemo } from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLink } from "@fortawesome/free-solid-svg-icons";

// images
import logo from "../../../assets/images/logo.svg";

// contexts
import { useLanguage } from "../../../contexts/LanguageProvider";

export default function Nav() {
  const { languageState } = useLanguage();

  const { auth, buttons } = useMemo(() => {
    return {
      auth: languageState.texts.auth,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  return (
    <nav className="fixed left-0 top-0 flex w-full h-20 px-10 py-2 justify-between gap-5 bg-light-background dark:bg-dark-background">
      {/* <img className="nav-logo" src={logo} alt="ireasantiago logo" /> */}
      LOGO
      <div className="flex justify-end gap-5 items-center">
        {auth.links.map((item) => (
          <a
            key={item.to}
            className="no-links flex items-center gap-2 transition dark:hover:text-primary hover:text-primary"
            href={item.to}
          >
            {item.label}
            {item.external ? (
              <FontAwesomeIcon icon={faExternalLink} />
            ) : null}{" "}
          </a>
        ))}
        <button className="submit">{buttons.signUp}</button>
      </div>
    </nav>
  );
}
