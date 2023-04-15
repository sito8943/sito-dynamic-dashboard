// @ts-check

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from "react";
import { QRCode } from "react-qrcode-logo";
import loadable from "@loadable/component";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// contexts
import { useUser } from "../../../contexts/UserProvider.jsx";
import { useSettings } from "../../../contexts/SettingsProvider.jsx";
import { useLanguage } from "../../../contexts/LanguageProvider.jsx";
import { useNotification } from "../../../contexts/NotificationProvider.jsx";

// utils
import { getUserName, userLogged, logoutUser } from "../../../utils/auth";
import { spaceToDashes } from "../../../utils/functions";
import { parserAccents } from "../../../utils/parser";

// services
import { load } from "../../../services/users/post.js";
import { signOutUser } from "../../../services/auth";

// styles
import "../styles.css";

// components
import Loading from "../../../components/Loading/Loading.jsx";
const Error = loadable((props) =>
  import("../../../components/Error/Error.jsx")
);
const SimpleInput = loadable((props) =>
  import("../../../components/Inputs/SimpleInput.jsx")
);

import config from "../../../config";

export default function Qr() {
  const { setUserState } = useUser();
  const { languageState } = useLanguage();

  const { settings } = useMemo(() => {
    return { settings: languageState.texts.settings };
  }, [languageState]);

  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [url, setUrl] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const localLogOut = async () => {
    logoutUser();
    await signOutUser(getUserName());
    setUserState({ type: "logged-out" });
    setTimeout(() => {
      window.location.href = "/auth/";
    }, 1000);
  };

  const [showLogoOnQr, setShowLogoOnQr] = useState(true);

  const [publicName, setPublicName] = useState("");
  const [preview, setPreview] = useState("");

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), ["photo", "publicName"]);
        if (data) {
          setPublicName(data.publicName);
          if (data.photo) setPreview(data.photo.url);
          setSettingsState({
            type: "set-qr",
            menu: data.menu,
            preview: data.photo ? data.photo.url : "",
          });
        }
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
        setError(true);
      }
      setLoading(false);
    }
  };

  const retry = () => fetch();

  const init = () => {
    setPreview(settingsState.preview);
    setPublicName(settingsState.publicName);
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.preview || !settingsState.publicName) retry();
    else init();
  }, []);

  const onQrDownload = () => {
    const canvas = document.getElementById("QRCode");
    if (canvas) {
      const pngUrl = canvas
        // @ts-ignore
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `your_name.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  return (
    <>
      <div className="form">
        {loading ? <Loading className="loading" /> : null}
        <h2 className="title">{settings.titles.qr}</h2>
        {!error ? (
          <div className="half-behavior flex flex-col items-start gap-2 mt-2">
            <QRCode
              value={`${config.url}watch/${spaceToDashes(
                parserAccents(publicName)
              )}?visited=qr`} // here you should keep the link/value(string) for which you are generation promocode
              size={256} // the dimension of the QR code (number)
              logoImage={showLogoOnQr ? preview : ""} // URL of the logo you want to use, make sure it is a dynamic url
              logoHeight={60}
              logoWidth={60}
              logoOpacity={1}
              enableCORS={true} // enabling CORS, this is the thing that will bypass that DOM check
              id="QRCode"
            />
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={onQrDownload}
                className="w-icon h-icon rounded-circle bg-primary text-white hover:bg-pdark dark:hover:bg-pdark"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
              <div className="cursor-pointer flex items-center justify-start gap-2">
                <input
                  className="cursor-pointer"
                  type="checkbox"
                  checked={showLogoOnQr}
                  onChange={(e) => setShowLogoOnQr(e.target.checked)}
                  id="remember"
                />
                <label
                  onClick={() => setShowLogoOnQr(!showLogoOnQr)}
                  className="cursor-pointer"
                >
                  {settings.showLogoOnQr}
                </label>
              </div>
            </div>
          </div>
        ) : (
          <Error onRetry={retry} />
        )}
      </div>
    </>
  );
}
