import React, {
  useCallback,
  useState,
  useEffect,
  Suspense,
  useMemo,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import loadable from "@loadable/component";

import Tippy from "@tippyjs/react";

import { useScreenWidth } from "use-screen-width";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faInfoCircle,
  faList,
  faPen,
  faPlus,
  faClock,
  faMap,
  faQrcode,
  faLock,
  faSquareShareNodes,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

// @emotion/css
import { css } from "@emotion/css";

// utils
import { parseLocalHref, parseQueries } from "../utils/parser.js";

// contexts
import { useSettings } from "../contexts/SettingsProvider.jsx";
import { useLanguage } from "../contexts/LanguageProvider.jsx";

// components
const Sidebar = loadable((props) =>
  import("../components/Sidebar/Sidebar.jsx")
);
const Navbar = loadable((props) => import("../components/Navbar/Navbar.jsx"));
const Footer = loadable((props) => import("../components/Footer/Footer.jsx"));
const Modal = loadable((props) => import("../components/Modal/Modal.jsx"));

export default function TableContainer({ tabs, responsive }) {
  const location = useLocation();
  const navigate = useNavigate();

  const { languageState } = useLanguage();

  const { tooltips } = useMemo(() => {
    return { tooltips: languageState.texts.tooltips };
  }, [languageState]);

  try {
    var { settingsState, setSettingsState } = useSettings();
  } catch (err) {}

  const widthViewport = useScreenWidth();

  const [biggerThanMD, setBiggerThanMD] = useState(false);

  useEffect(() => {
    setBiggerThanMD(
      widthViewport.screenWidth > (responsive ? responsive : 500)
    );
  }, [widthViewport]);

  const [refreshByAction, setRefreshByAction] = useState(false);

  const icons = {
    list: faList,
    insert: faPlus,
    modify: faPen,
    info: faInfoCircle,
    promotion: faArrowTrendUp,
    social: faSquareShareNodes,
    schedule: faClock,
    map: faMap,
    qr: faQrcode,
    security: faLock,
    cloud: faCloud,
    clock: faClock,
  };

  const handleClose = (e) => setShowDialog(false);

  const [linkTo, setLinkTo] = useState("");

  const handleAction = useCallback(() => {
    if (linkTo !== "") navigate(linkTo);
    else window.location.reload();
    setShowDialog(false);
    try {
      setSettingsState({ type: "reset" });
    } catch (err) {}
  }, [linkTo]);

  const verifyChanges = useCallback(
    (e) => {
      try {
        if (settingsState.anyChange) {
          setShowDialog(true);
          e.preventDefault();
          let node = e.target;
          while (node.nodeName !== "A" && node.nodeName !== "a")
            node = node.parentNode;
          setLinkTo(parseLocalHref(node.href));
          return false;
        }
      } catch (err) {}
    },
    [settingsState, navigate]
  );

  const printTabs = useCallback(() => {
    const { pathname, search } = location;
    const queryParams = parseQueries(search);
    return tabs.map((item) => (
      <Tippy
        key={item.to}
        content={
          tooltips[queryParams.id && item.modifying ? item.altIcon : item.icon]
        }
      >
        <Link
          to={item.to}
          onClick={verifyChanges}
          className={`transition-all flex text-center gap-2 items-center justify-center ${css(
            {
              minWidth: biggerThanMD ? "180px" : "40px",
            }
          )} ${pathname === item.to ? "submit" : "secondary secondary-hover"}`}
        >
          {item.icon ? (
            <FontAwesomeIcon
              icon={
                queryParams.id && item.modifying
                  ? icons[item.altIcon]
                  : icons[item.icon]
              }
            />
          ) : null}
          {biggerThanMD ? (
            <>
              {" "}
              {queryParams.id && item.modifying ? item.modifying : item.label}
            </>
          ) : null}
        </Link>
      </Tippy>
    ));
  }, [tabs, location, widthViewport]);

  const [showDialog, setShowDialog] = useState(false);

  const reloadHandler = useCallback(
    (e) => {
      let canBePrevented = false;
      if ((e.keyCode == 82 && e.ctrlKey) || (e.which || e.keyCode) == 116)
        canBePrevented = true;
      try {
        if (settingsState.anyChange && canBePrevented) {
          if (
            settingsState.oldPhoto &&
            settingsState.photo &&
            settingsState.photo.url !== settingsState.oldPhoto.url
          )
            removeImage(photo.fileId);
          e.preventDefault();
          e.target.blur();
          setShowDialog(true);
        }
      } catch (err) {}
    },
    [settingsState]
  );

  useEffect(() => {
    window.addEventListener("keydown", reloadHandler);
    return () => {
      window.removeEventListener("keydown", reloadHandler);
    };
  }, [reloadHandler]);

  return (
    <div className="flex w-full min-h-screen">
      <Suspense>
        <Modal
          visible={showDialog}
          onClose={handleClose}
          onAction={handleAction}
        />
        <Sidebar />
        <div className="flex flex-col min-h-full w-full overflow-hidden">
          <Navbar />
          <div className="main-content">
            {tabs ? (
              <div className="flex w-full h-10 items-center justify-start gap-5 min-h-12 overflow-auto">
                {printTabs()}
              </div>
            ) : null}
            <Outlet />
          </div>
          <Footer />
        </div>
      </Suspense>
    </div>
  );
}
