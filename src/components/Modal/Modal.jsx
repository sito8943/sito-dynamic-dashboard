import React, { useCallback, useEffect, useMemo } from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";

// styles
import "./styles.css";

export default function Modal({ visible, onClose, onAction }) {
  const { languageState } = useLanguage();

  const { buttons, dialogs } = useMemo(() => {
    return {
      buttons: languageState.texts.buttons,
      dialogs: languageState.texts.dialogs,
    };
  }, [languageState]);

  const escapeHandler = useCallback((e) => {
    const { keyCode } = e;
    if (keyCode === 27) {
      onClose();
      e.target.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [escapeHandler]);

  return (
    <div
      className={`${
        visible ? "opacity-1" : "opacity-0"
      } transition-all bg-light-drawer-background dark:bg-dark-drawer-background w-full h-screen top-0 left-0 fixed z-50 backdrop-blur-sm flex items-center justify-center pointer-events-none`}
    >
      <div
        className={`dialog transition-all ${visible ? "scale-100" : "scale-0"}`}
      >
        <div className="flex pt-10 h-full w-20">
          <FontAwesomeIcon className="text-warning text-6xl" icon={faWarning} />
        </div>
        <div className="flex flex-col gap-4 justify-center">
          <h2 className="text-h5 text-dark-background2 dark:text-light-background2 font-bold">
            {dialogs.titles.lostChanges}
          </h2>
          <p>{dialogs.bodies.lostChanges}</p>
          <div className="flex items-center justify-end gap-5">
            <button className="submit" type="button" onClick={onAction}>
              {buttons.accept}
            </button>
            <button className="secondary" type="button" onClick={onClose}>
              {buttons.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
