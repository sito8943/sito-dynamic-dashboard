// @ts-check

/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import loadable from "@loadable/component";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarthAmericas } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faPinterest,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

// contexts
import { useUser } from "../../../contexts/UserProvider.jsx";
import { useSettings } from "../../../contexts/SettingsProvider.jsx";
import { useLanguage } from "../../../contexts/LanguageProvider.jsx";
import { useNotification } from "../../../contexts/NotificationProvider.jsx";

// utils
import { getUserName, userLogged, logoutUser } from "../../../utils/auth";

// services
import { load, saveInfo } from "../../../services/users/post.js";
// auth
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

export default function Social() {
  const { setUserState } = useUser();
  const { languageState } = useLanguage();

  const { errors, settings, buttons, messages } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
      settings: languageState.texts.settings,
      buttons: languageState.texts.buttons,
      messages: languageState.texts.messages,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      description: "",
      website: "",
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      pinterest: "",
      youtube: "",
    },
  });

  const { description } = watch();

  const [descriptionHelperText, setDescriptionHelperText] = useState("");
  const [websiteHelperText, setWebsiteHelperText] = useState("");
  const [facebookHelperText, setFacebookHelperText] = useState("");
  const [instagramHelperText, setInstagramHelperText] = useState("");
  const [twitterHelperText, setTwitterHelperText] = useState("");
  const [linkedinHelperText, setLinkedinHelperText] = useState("");
  const [pinterestHelperText, setPinterestHelperText] = useState("");
  const [youtubeHelperText, setYoutubeHelperText] = useState("");

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const localLogOut = async () => {
    logoutUser();
    await signOutUser(getUserName());
    setUserState({ type: "logged-out" });
    setTimeout(() => {
      window.location.href = "/auth/";
    }, 1000);
  };

  const onSubmit = useCallback(
    async (
      /** @type {{ description: any; website: any; facebook: any; instagram: any; twitter: any; linkedin: any; pinterest: any; youtube: any; }} */ data
    ) => {
      setDescriptionHelperText("");
      const {
        description,
        website,
        facebook,
        instagram,
        twitter,
        linkedin,
        pinterest,
        youtube,
      } = data;
      if (ok) {
        setLoading(true);
        try {
          const socialMedia = {
            website,
            facebook,
            instagram,
            twitter,
            linkedin,
            pinterest,
            youtube,
          };
          await saveInfo({
            user: getUserName(),
            description,
            socialMedia,
          });
          showNotification("success", messages.saveSuccessful);
          setSettingsState({
            type: "set-generals",
            description,
            socialMedia,
          });
          setLoading(false);
          return true;
        } catch (err) {
          console.error(err);
          const { status, data } = err.response;
          if (status === 403) await localLogOut();
          else if (String(err) === "AxiosError: Network Error")
            showNotification("error", errors.notConnected);
          else showNotification("error", String(err));
        }
      }
      setLoading(false);
      return false;
    },
    [descriptionHelperText]
  );

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), ["socialMedia", "description"]);
        if (data !== undefined) {
          const { description, socialMedia } = data;
          const {
            website,
            facebook,
            instagram,
            twitter,
            linkedin,
            pinterest,
            youtube,
          } = socialMedia || {};

          reset({
            description,
            website,
            facebook,
            instagram,
            twitter,
            linkedin,
            pinterest,
            youtube,
          });
          setSettingsState({
            type: "set-socials",
            description,
            socialMedia,
          });
        }
      } catch (err) {
        console.error(err);
        const { status, data } = err.response;
        if (status === 403) await localLogOut();
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
        setError(true);
      }
      setLoading(false);
    }
  };

  const retry = () => fetch();

  const [ok, setOk] = useState(1);

  const validate = () => setOk(1);

  /**
   *
   * @param {*} e
   * @returns
   */
  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(0);
      switch (id) {
        case "website":
          return setWebsiteHelperText(errors.invalidUrl);
        case "facebook":
          return setFacebookHelperText(errors.invalidUrl);
        case "instagram":
          return setInstagramHelperText(errors.invalidUrl);
        case "twitter":
          return setTwitterHelperText(errors.invalidUrl);
        case "linkedin":
          return setLinkedinHelperText(errors.invalidUrl);
        case "pinterest":
          return setPinterestHelperText(errors.invalidUrl);
        case "youtube":
          return setYoutubeHelperText(errors.invalidUrl);
        default:
          return setDescriptionHelperText(errors.descriptionRequired);
      }
    }
  };

  const init = () => {
    if (settingsState.socialMedia)
      var {
        website,
        facebook,
        instagram,
        twitter,
        linkedin,
        pinterest,
        youtube,
      } = settingsState.socialMedia;
    reset({
      description: settingsState.description,
      website,
      facebook,
      instagram,
      twitter,
      linkedin,
      pinterest,
      youtube,
    });
    setLoading(false);
  };

  useEffect(() => {
    const textarea = document.getElementById("description");
    if (textarea !== null) textarea.setAttribute("maxlength", "255");
    if (!settingsState.description || !settingsState.socialMedia) retry();
    else init();
  }, []);

  const buttonRef = useRef(null);

  const executeSubmit = useCallback(() => {
    if (buttonRef !== null && buttonRef.current !== null) {
      // @ts-ignore
      buttonRef.current.click();
    }
  }, [buttonRef]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {loading ? <Loading className="loading" /> : null}
        <h2 className="title">{settings.titles.social}</h2>
        <button type="button" onClick={executeSubmit} className="submit mt-3">
          {buttons.save}
        </button>
        {!error ? (
          <>
            <SimpleInput
              id="description"
              inputProps={{
                className: `py-2 px-5 w-full rounded-2xl resize-none h-40 ${
                  descriptionHelperText.length > 0 ? "border-error" : ""
                }`,
                type: "textarea",
                required: true,
                placeholder: settings.inputs.description.placeholder,
                onInput: validate,
                onInvalid: invalidate,
                ...register("description"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.description.label}
              helperText={descriptionHelperText}
            />
            {description ? (
              <span className="half-behavior text-right">
                {description.length} / 255
              </span>
            ) : null}
            {/* website */}
            <SimpleInput
              id="website"
              leftIcon={
                <FontAwesomeIcon
                  icon={faEarthAmericas}
                  className={`absolute-icon-left text-2xl ${
                    websiteHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.any.placeholder,
                ...register("website"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.any.label}
              helperText={websiteHelperText}
            />
            {/* facebook */}
            <SimpleInput
              id="facebook"
              leftIcon={
                <FontAwesomeIcon
                  icon={faFacebook}
                  className={`absolute-icon-left text-2xl ${
                    facebookHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.facebook.placeholder,
                ...register("facebook"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.facebook.label}
              helperText={facebookHelperText}
            />
            {/* instagram */}
            <SimpleInput
              id="instagram"
              leftIcon={
                <FontAwesomeIcon
                  icon={faInstagram}
                  className={`absolute-icon-left text-2xl ${
                    instagramHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.instagram.placeholder,
                ...register("instagram"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.instagram.label}
              helperText={instagramHelperText}
            />
            {/* twitter */}
            <SimpleInput
              id="twitter"
              leftIcon={
                <FontAwesomeIcon
                  icon={faTwitter}
                  className={`absolute-icon-left text-2xl ${
                    twitterHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.twitter.placeholder,
                ...register("twitter"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.twitter.label}
              helperText={twitterHelperText}
            />
            {/* linkedin */}
            <SimpleInput
              id="linkedin"
              leftIcon={
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className={`absolute-icon-left text-2xl ${
                    linkedinHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.linkedin.placeholder,
                ...register("linkedin"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.linkedin.label}
              helperText={linkedinHelperText}
            />
            {/* pinterest */}
            <SimpleInput
              id="pinterest"
              leftIcon={
                <FontAwesomeIcon
                  icon={faPinterest}
                  className={`absolute-icon-left text-2xl ${
                    pinterestHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.pinterest.placeholder,
                ...register("pinterest"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.pinterest.label}
              helperText={pinterestHelperText}
            />
            {/* youtube */}
            <SimpleInput
              id="pinterest"
              leftIcon={
                <FontAwesomeIcon
                  icon={faYoutube}
                  className={`absolute-icon-left text-2xl ${
                    youtubeHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: "pl-10 py-2 px-5 w-full rounded-button",
                type: "url",
                onInput: validate,
                onInvalid: invalidate,
                placeholder: settings.inputs.social.urls.youtube.placeholder,
                ...register("youtube"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.social.urls.youtube.label}
              helperText={youtubeHelperText}
            />
            <button type="submit" ref={buttonRef} className="submit mt-3">
              {buttons.save}
            </button>
          </>
        ) : (
          <Error onRetry={retry} />
        )}
      </form>
    </>
  );
}
