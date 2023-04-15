import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

// sito components
import SitoImage from "sito-image";

// components
import Error from "../Error/Error.jsx";
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

import config from "../../config.js";

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

export default function PhotoUpload({
  id,
  photo,
  setPhoto,
  name,
  label,
  imageSuggestion,
}) {
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

      setPhoto([...photo, { fileId, url }]);
      try {
        const toSave = { type: `set-${id}` };
        toSave[id] = [...photo, { fileId, url }];
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
      photo.splice(index, 1);
      setPhoto([...photo]);
    } catch (err) {
      console.error(err);
    }
  };

  const PhotoMemo = memo(
    ({ fileId, url, i }) => (
      <div className="image-header" key={fileId}>
        <button
          type="button"
          onClick={() => removeLocalImage(fileId, i)}
          className="absolute text-error hover:text-white top-0 right-0 w-icon h-icon z-10 rounded-circle hover:bg-error transition"
        >
          <FontAwesomeIcon icon={faTrash} color="transition " />
        </button>
        <SitoImage
          // @ts-ignore
          src={url}
          alt="user-image"
          className="w-full h-full"
        />
      </div>
    ),
    arePropsEqual
  );

  function arePropsEqual(oldProps, newProps) {
    return (
      oldProps.fileId === newProps.fileId &&
      oldProps.url === newProps.url &&
      oldProps.i === newProps.i
    );
  }

  const printPhotos = useCallback(() => {
    if (photo)
      return photo.map(({ fileId, url }, i) => (
        <PhotoMemo key={fileId} {...{ fileId, url, i }} />
      ));
    return null;
  }, [photo]);

  return (
    <div className="mt-5">
      <label>{label}</label>
      <div className="image-container">
        {printPhotos()}

        <div className="image-header rounded-circle">
          {photo ? (
            <IKContext
              publicKey={imagekitPublicKey}
              urlEndpoint={imagekitUrl}
              authenticationEndpoint={imagekitAuthUrl}
              transformationPosition="path"
            >
              <IKUpload
                folder="/headerImages"
                inputRef={inputRef}
                fileName={`${name}`}
                onChange={onLoading}
                onError={onError}
                onSuccess={onSuccess}
              />
              {loadingPhoto ? (
                <Loading className="cursor-auto relative rounded-2xl shadow-2xl bg-light-background dark:bg-dark-background" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center border-dashed border-1 border-dark-background dark:border-light-background2 rounded-2xl"
                  onClick={uploadPhoto}
                >
                  <FontAwesomeIcon
                    icon={faAdd}
                    className="dark:text-light-background"
                  />
                </div>
              )}
            </IKContext>
          ) : null}
        </div>
      </div>
      <p className="self-center w-half ml-1">{imageSuggestion}</p>
    </div>
  );
}

PhotoUpload.propTypes = {};
