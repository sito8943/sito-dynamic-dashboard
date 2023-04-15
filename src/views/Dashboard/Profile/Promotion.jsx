// @ts-check

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import loadable from "@loadable/component";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoImage from "sito-image";

// contexts
import { useUser } from "../../../contexts/UserProvider.jsx";
import { useSettings } from "../../../contexts/SettingsProvider.jsx";
import { useLanguage } from "../../../contexts/LanguageProvider.jsx";
import { useNotification } from "../../../contexts/NotificationProvider.jsx";

// utils
import { getUserName, logoutUser, userLogged } from "../../../utils/auth";
import {
  findFirstLowerLetter,
  findFirstUpperLetter,
} from "../../../utils/parser.js";

// services
import { searchNew } from "../../../services/search/post.js";
import { load, saveInfo } from "../../../services/users/post.js";
import { signOutUser } from "../../../services/auth.js";
import { placeTypeList } from "../../../services/placeTypes/post.js";
import { removeImage } from "../../../services/photo";
// images
// @ts-ignore
import noProduct from "../../../assets/images/no-product.jpg";

import config from "../../../config";

// styles
import "./styles.css";

// components
import Loading from "../../../components/Loading/Loading.jsx";
const Error = loadable((props) =>
  import("../../../components/Error/Error.jsx")
);
const SimpleInput = loadable((props) =>
  import("../../../components/Inputs/SimpleInput.jsx")
);

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

export default function Promotion() {
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
  const { setUserState } = useUser();

  /**
   *
   * @param {string} ntype
   * @param {string} message
   * @returns
   */
  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [loading, setLoading] = useState(false);
  const [loadingPhotoPromotion, setLoadingPhotoPromotion] = useState(false);

  const [error, setError] = useState(false);
  const [photoPromotion, setPhotoPromotion] = useState({ url: "", fileId: "" });
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: {
      descriptionPromotion: "",
    },
  });

  const [descriptionPromotionHelperText, setDescriptionPromotionHelperText] =
    useState("");

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), [
          "photoPromotion",
          "descriptionPromotion",
        ]);
        if (data !== null) {
          if (data.photoPromotion) {
            setPhotoPromotion(data.photoPromotion);
            setPreview(data.photoPromotion.url);
          }
          reset({
            descriptionPromotion: data.descriptionPromotion,
          });
          setSettingsState({
            type: "set-generals",
            photoPromotion: data.photoPromotion,
            descriptionPromotion: data.descriptionPromotion,
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

  const uploadPhoto = useCallback((e) => {
    const file = document.getElementById("menu-photo-promotion");
    if (file !== null) file.click();
  }, []);

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
        default:
          return setDescriptionPromotionHelperText(errors.descriptionRequired);
      }
    }
  };

  const localLogOut = async () => {
    logoutUser();
    await signOutUser(getUserName());
    setUserState({ type: "logged-out" });
    setTimeout(() => {
      window.location.href = "/auth/";
    }, 1000);
  };

  const onSubmit = useCallback(
    async (/** @type {{ descriptionPromotion: String; }} */ data) => {
      setDescriptionPromotionHelperText("");
      const { descriptionPromotion } = data;
      if (ok) {
        setLoading(true);
        try {
          await saveInfo({
            user: getUserName(),
            // @ts-ignore
            descriptionPromotion: descriptionPromotion,
            photoPromotion: photoPromotion,
            lang: getUserLanguage(),
          });
          showNotification("success", messages.saveSuccessful);
          setSettingsState({
            type: "set-generals",
            descriptionPromotion: descriptionPromotion || "",
            photoPromotion: photoPromotion || { url: "", fileId: "" },
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
    [descriptionPromotionHelperText, photoPromotion]
  );

  useEffect(() => {
    const image = document.getElementById("no-image");
    if (image !== null) {
      image.onclick = uploadPhoto;
    }
    return () => {
      if (image !== null) {
        image.onclick = null;
      }
    };
  }, [uploadPhoto, loading, loadingPhotoPromotion]);

  const init = () => {
    setPhotoPromotion(settingsState.photoPromotion);
    reset({
      descriptionPromotion: settingsState.descriptionPromotion,
    });
    setLoading(false);
  };

  useEffect(() => {
    const textarea = document.getElementById("descriptionPromotion");
    if (textarea !== null) textarea.setAttribute("maxlength", "255");
    if (!settingsState.photoPromotion || !settingsState.descriptionPromotion)
      retry();
    else init();
  }, []);

  const onLoading = () => setLoadingPhotoPromotion(true);

  /**
   *
   * @param {*} res
   */
  const onSuccess = async (res) => {
    try {
      const { url, fileId } = res;
      if (photoPromotion) await removeImage(photoPromotion.fileId);
      setPhotoPromotion({ fileId, url });
      setPreview(url);
    } catch (err) {
      console.error(err);
      const { status, data } = err.response;
      if (status === 403) await localLogOut();
    }
    setLoadingPhotoPromotion(false);
  };

  const onError = (e) => {
    showNotification("error", errors.someWrong);
    setLoadingPhotoPromotion(false);
  };

  const goToEdit = async () => {
    /* if (getValues("menu") && getValues("menu").length) {
      const value = await onSubmit({
        menu: getValues("menu"),
        phone: getValues("phone"),
      });
      if (value) navigate("/menu/edit/");
    } else {
      setPublicNameHelperText(languageState.texts.errors.nameRequired);
      const menuInput = document.getElementById("menu");
      if (menuInput !== null) document.getElementById("menu").focus();
    } */
  };

  const { descriptionPromotion } = watch();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {loading ? <Loading className="loading" /> : null}
        <h2 className="title">{settings.titles.general}</h2>
        {!error ? (
          <>
            {/* Image */}
            <div className="flex half-behavior mt-3 flex-wrap items-start gap-2">
              <div className="responsive-image rounded-circle">
                {!loading ? (
                  <IKContext
                    publicKey={imagekitPublicKey}
                    urlEndpoint={imagekitUrl}
                    authenticationEndpoint={imagekitAuthUrl}
                    transformationPosition="path"
                  >
                    <IKUpload
                      id="menu-photo-promotion"
                      fileName={`${getUserName()}`}
                      onChange={onLoading}
                      onError={onError}
                      onSuccess={onSuccess}
                    />
                    {loadingPhotoPromotion ? (
                      <Loading className="relative rounded-2xl shadow-2xl bg-light-background dark:bg-dark-background" />
                    ) : (
                      <SitoImage
                        // @ts-ignore
                        id="no-image"
                        src={preview && preview !== "" ? preview : noProduct}
                        alt="user-image"
                        className="w-full h-full rounded-2xl cursor-pointer object-cover"
                      />
                    )}
                  </IKContext>
                ) : null}
              </div>
              <p className="self-center w-half ml-1">
                {settings.promotionImageSuggestion}
              </p>
            </div>
            <SimpleInput
              id="description"
              inputProps={{
                className: `py-2 px-5 w-full rounded-2xl resize-none h-40 ${
                  descriptionPromotionHelperText.length > 0
                    ? "border-error"
                    : ""
                }`,
                type: "textarea",
                required: true,
                placeholder: settings.inputs.description.placeholder,
                onInput: validate,
                onInvalid: invalidate,
                ...register("descriptionPromotion"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.description.label}
              helperText={descriptionPromotionHelperText}
            />
            {descriptionPromotion ? (
              <span className="half-behavior text-right">
                {descriptionPromotion.length} / 255
              </span>
            ) : null}
            <button type="submit" className="submit mt-3">
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
