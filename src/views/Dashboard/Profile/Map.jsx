// @ts-check
import React, { useState, useEffect, useCallback, useMemo } from "react";
import loadable from "@loadable/component";

// contexts
import { useUser } from "../../../contexts/UserProvider.jsx";
import { useLanguage } from "../../../contexts/LanguageProvider.jsx";
import { useSettings } from "../../../contexts/SettingsProvider.jsx";
import { useNotification } from "../../../contexts/NotificationProvider.jsx";

// services
import { load, saveInfo } from "../../../services/users/post.js";
import { signOutUser } from "../../../services/auth";

// utils
import { getUserName, logoutUser, userLogged } from "../../../utils/auth.js";

// styles
import "./styles.css";

// components
import Loading from "../../../components/Loading/Loading.jsx";
const Error = loadable((props) =>
  import("../../../components/Error/Error.jsx")
);
const MapComponent = loadable((props) =>
  import("../../../components/Map/Map.jsx")
);
const SimpleInput = loadable((props) =>
  import("../../../components/Inputs/SimpleInput.jsx")
);

export default function Map() {
  const { setUserState } = useUser();
  const { languageState } = useLanguage();

  const { errors, messages, settings, buttons } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
      settings: languageState.texts.settings,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [error, setError] = useState(false);

  const [ok, setOk] = useState(1);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    setOk(1);
  };

  const [lat, setLat] = useState(21.8032183);
  const [latHelperText, setLatHelperText] = useState("");
  const [lng, setLng] = useState(-79.9900431);
  const [lngHelperText, setLngHelperText] = useState("");

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(0);
      switch (id) {
        case "lng":
          return setLngHelperText(errors.lngRequired);
        default:
          setLatHelperText(errors.latRequired);
          break;
      }
    }
  };

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      if (ok) {
        try {
          setLoading(true);
          await saveInfo({
            user: getUserName(),
            location: { lat, lng },
          });
          showNotification("success", messages.saveSuccessful);
        } catch (err) {
          console.error(err);
          // @ts-ignore
          const { status, data } = err.response;
          if (status === 403) {
            logoutUser();
            await signOutUser(getUserName());
            setUserState({ type: "logged-out" });
            setTimeout(() => {
              window.location.href = "/auth/";
            }, 1000);
          } else if (String(err) === "AxiosError: Network Error")
            showNotification("error", errors.notConnected);
          else showNotification("error", String(err));
        }
      }
      setLoading(false);
    },
    [lat, lng]
  );

  const [photo, setPhoto] = useState({});

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), [
          "location",
          "publicName",
          "photo",
        ]);
        if (data) {
          if (data.photo) setPhoto(data.photo);
          else setPhoto({ url: "", fileId: "" });
          if (data.location) {
            setLat(data.location.lat);
            setLng(data.location.lng);
          }
          setSettingsState({
            type: "set-schedule",
            location: data.location || { lat, lng },
          });
        } else setPhoto({ url: "", fileId: "" });
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
    // @ts-ignore
    setLat(settingsState.location.lat);
    setLng(settingsState.location.lng);
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.location) retry();
    else init();
  }, []);

  function capturePoint(e) {
    const { lngLat } = e;
    setLat(lngLat.lat);
    setLng(lngLat.lng);
  }

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        {loading ? <Loading className="loading m-h-400" /> : null}
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {settings.titles.map}
        </h2>
        {!error ? (
          <>
            {!loading ? (
              <div className="flex flex-col w-full">
                <div className="times-rows">
                  <SimpleInput
                    id="lat"
                    className="input-field half-behavior"
                    label={settings.inputs.map.labels.lat}
                    inputProps={{
                      className: `px-5 py-2 rounded-button w-full`,
                      type: "type",
                      id: "lat",
                      required: true,
                      onInput: validate,
                      onInvalid: invalidate,
                      value: lat,
                      onChange: (e) => setLat(Number(e.target.value)),
                    }}
                    helperText={latHelperText}
                  />
                  <SimpleInput
                    id="lng"
                    className="input-field half-behavior"
                    label={settings.inputs.map.labels.lng}
                    inputProps={{
                      className: `px-5 py-2 rounded-button w-full`,
                      type: "text",
                      id: "lng",
                      required: true,
                      onInput: validate,
                      onInvalid: invalidate,
                      value: lng,
                      onChange: (e) => setLng(e.target.value),
                    }}
                    helperText={lngHelperText}
                  />
                </div>
                <MapComponent
                  sx={{ width: "100%", height: "500px", marginTop: "20px" }}
                  point={{
                    latitude: lat,
                    longitude: lng,
                    headerImages: [photo],
                  }}
                  onClick={capturePoint}
                />
              </div>
            ) : null}

            <button type="submit" className="submit mt-3">
              {buttons.save}
            </button>
          </>
        ) : (
          <Error />
        )}
      </form>
    </>
  );
}
