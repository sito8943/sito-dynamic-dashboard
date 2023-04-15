import React, { useState, memo, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoImage from "sito-image";

// components
import Loading from "../Loading/Loading.jsx";

// services
import { removeImage } from "../../services/photo.js";
import { signOutUser } from "../../services/auth.js";

// contexts
import { useSettings } from "../../contexts/SettingsProvider.jsx";
import { useLanguage } from "../../contexts/LanguageProvider.jsx";
import { useUser } from "../../contexts/UserProvider.jsx";

// utils
import { logoutUser, getUserName } from "../../utils/auth.js";

// images
// @ts-ignore
import noProduct from "../../assets/images/no-product.jpg";

import config from "../../config";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

function PhotoUpload({ id, photo, setPhoto, name, label, imageSuggestion }) {
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const { setSettingsState } = useSettings();
  const { languageState } = useLanguage();
  const { setUserState } = useUser();

  const inputRef = useRef();
  const [error, setError] = useState(false);

  const uploadPhoto = (e) => {
    if (inputRef !== null) inputRef.current.click();
  };

  const onLoading = () => setLoadingPhoto(true);

  const localLogOut = async () => {
    logoutUser();
    await signOutUser(getUserName());
    setUserState({ type: "logged-out" });
    setTimeout(() => {
      window.location.href = "/auth/";
    }, 1000);
  };

  /**
   *
   * @param {*} res
   */
  const onSuccess = async (res) => {
    try {
      const { url, fileId } = res;
      if (photo) await removeImage(photo.fileId);
      setPhoto({ fileId, url });
      try {
        const toSave = { type: `set-${id}` };
        toSave[id] = { fileId, url };
        setSettingsState(toSave);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      const { status, data } = err.response;
      if (status === 403) await localLogOut();
    }
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    showNotification("error", languageState.texts.errors.someWrong);
    setLoadingPhoto(false);
  };

  const removeLocalImage = async (fileId, index) => {
    try {
      await removeImage(fileId);
      setPhoto({ url: "", fileId: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="half-behavior mt-5">
      <label>{label}</label>
      <div className="flex flex-wrap items-start gap-2">
        <div className="responsive-image rounded-circle">
          {photo ? (
            <IKContext
              publicKey={imagekitPublicKey}
              urlEndpoint={imagekitUrl}
              authenticationEndpoint={imagekitAuthUrl}
              transformationPosition="path"
            >
              <IKUpload
                inputRef={inputRef}
                fileName={`${name}`}
                onChange={onLoading}
                onError={onError}
                onSuccess={onSuccess}
              />
              {loadingPhoto ? (
                <Loading className="relative rounded-2xl shadow-2xl bg-light-background dark:bg-dark-background" />
              ) : (
                <div className="h-full relative" onClick={uploadPhoto}>
                  {photo && photo.url !== "" ? (
                    <button
                      type="button"
                      onClick={() => removeLocalImage(fileId, i)}
                      className="absolute text-error hover:text-white top-0 right-0 w-icon h-icon z-10 rounded-circle hover:bg-error transition"
                    >
                      <FontAwesomeIcon icon={faTrash} color="transition " />
                    </button>
                  ) : null}
                  <SitoImage
                    // @ts-ignore
                    src={photo && photo.url !== "" ? photo.url : noProduct}
                    alt="user-image"
                    className="w-full h-full rounded-2xl cursor-pointer object-cover"
                  />
                </div>
              )}
            </IKContext>
          ) : null}
        </div>
        <p className="self-center w-half ml-1">{imageSuggestion}</p>
      </div>
    </div>
  );
}

const PhotoUploadMemo = memo(
  (props) => <PhotoUpload {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.id === newProps.id &&
    oldProps.photo === newProps.photo &&
    oldProps.setPhoto === newProps.setPhoto &&
    oldProps.name === newProps.name &&
    oldProps.label === newProps.label &&
    oldProps.imageSuggestion === newProps.imageSuggestion
  );
}

export default PhotoUploadMemo;
