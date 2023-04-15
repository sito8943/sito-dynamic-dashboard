// @ts-check

/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useReducer,
  useState,
  useMemo,
} from "react";
import loadable from "@loadable/component";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// imagekitio-react
import { IKContext, IKUpload } from "imagekitio-react";

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
const Autocomplete = loadable((props) =>
  import("../../../components/Inputs/Autocomplete")
);
const SimpleInput = loadable((props) =>
  import("../../../components/Inputs/SimpleInput")
);

// sito components
const SitoImage = loadable((props) => import("sito-image"));

const { imagekitUrl, imagekitPublicKey, imagekitAuthUrl } = config;

export default function Profile(props) {
  const navigate = useNavigate();

  /**
   *
   * @param {*} placeTypesState
   * @param {*} action
   * @returns
   */
  const placeTypesReducer = (placeTypesState, action) => {
    const { type } = action;
    switch (type) {
      case "set": {
        const { array } = action;
        return [...array];
      }
      case "add": {
        const { array } = action;
        array.forEach((/** @type {{ id: any; }} */ item) => {
          if (
            !placeTypesState.find(
              (/** @type {{ id: any; }} */ jtem) => item.id === jtem.id
            )
          )
            placeTypesState.push(item);
        });
        return [...placeTypesState];
      }
      default:
        return [];
    }
  };

  const [placeTypes, setPlaceTypes] = useReducer(placeTypesReducer, []);
  const [loadingPlaceTypes, setLoadingPlaceTypes] = useState(false);
  const [currentType, setCurrentType] = useState("");

  const inputChange = (event) => setCurrentType(event.target.value);

  const fetchPlaceTypes = useCallback(async () => {
    setLoadingPlaceTypes(true);
    try {
      const response = await searchNew(
        currentType,
        ["placeTypes"],
        "name",
        ["name", "id"],
        1,
        -1
      );
      const { list } = await response;
      setPlaceTypes({ type: "add", array: list });
    } catch (err) {
      console.error(err);
      const { status, data } = err.response;
      if (status === 403) await localLogOut();
      showNotification("error", String(err));
    }
    setLoadingPlaceTypes(false);
  }, [currentType]);

  const [timeOut, setTimeOut] = useState(null);
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    if (currentType.length) {
      setLoadingPlaceTypes(true);
      setTimeOut(
        // @ts-ignore
        setTimeout(() => {
          setAsk(true);
        }, 1000)
      );
    }
  }, [currentType]);

  useEffect(() => {
    if (ask) {
      fetchPlaceTypes();
      setAsk(false);
    }
  }, [ask]);

  const [types, setTypes] = useState([]);

  /**
   *
   * @param {*} event
   * @param {*} newValue
   * @returns
   */
  const handleTypes = (event, newValue) => setTypes(newValue);

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
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [loadingPlacePlaceTypes, setLoadingPlacePlaceTypes] = useState(false);

  const [error, setError] = useState(false);
  const [photo, setPhoto] = useState({ url: "", fileId: "" });
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, reset, getValues, watch } = useForm({
    defaultValues: {
      publicName: "",
      phone: "",
    },
  });

  const [oldName, setOldName] = useState("");
  const [publicNameHelperText, setPublicNameHelperText] = useState("");

  /**
   *
   * @param {*} data
   */
  const fetchPlaceTypePlaces = async (data) => {
    try {
      if (data.types) {
        const query = {};
        data.types.forEach(
          (/** @type {string | number} */ item) => (query[item] = item)
        );
        const responsePlaceTypes = await placeTypeList(
          1,
          -1,
          "id",
          ["id", "name"],
          query
        );
        const { list } = responsePlaceTypes;
        if (list) setTypes(list);
      }
    } catch (err) {
      console.error(err);
      const { status } = err.response;
      if (status === 403) await localLogOut();
      showNotification("error", String(err));
    }
    setLoadingPlacePlaceTypes(false);
  };

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), [
          "photo",
          "types",
          "publicName",
          "phone",
        ]);
        if (data !== null) {
          if (data.photo) {
            setPhoto(data.photo);
            setPreview(data.photo.url);
          }
          if (data.types) fetchPlaceTypePlaces(data);
          setOldName(data.publicName);
          reset({
            publicName: data.publicName,
            phone: data.phone,
          });
          setSettingsState({
            type: "set-generals",
            menu: data.publicName,
            phone: data.phone,
            photo: data.photo,
            types: data.types,
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
    const file = document.getElementById("menu-photo");
    if (file !== null) file.click();
  }, []);

  const phoneValue = watch(["phone"]);

  const [phoneHelperText, setPhoneHelperText] = useState("");

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
        case "phone":
          return setPhoneHelperText(errors.phoneRequired);
        default:
          return setPublicNameHelperText(errors.nameRequired);
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
    async (/** @type {{ publicName: any; phone: any; }} */ data) => {
      setPublicNameHelperText("");
      setPhoneHelperText("");
      const { publicName, phone } = data;
      if (phoneHelperText.length > 0 && (!phone || phone.length)) {
        const phoneInput = document.getElementById("phone");
        if (phoneInput !== null) phoneInput.focus();
      } else {
        if (ok) {
          setLoading(true);
          try {
            await saveInfo({
              user: getUserName(),
              oldName,
              publicName,
              phone: phone || "",
              photo: photo || "",
              // @ts-ignore
              types: types || [],
              lang: getUserLanguage(),
            });
            showNotification("success", messages.saveSuccessful);
            setSettingsState({
              type: "set-generals",
              publicName,
              phone: phone || "",
              preview: photo ? photo.url : "",
              photo: photo || "",
              types: types || [],
            });
            setLoading(false);
            return true;
          } catch (err) {
            console.error(err);
            const { status, data } = err.response;
            if (status === 403) await localLogOut();
            const { error } = data;
            if (error.indexOf("public-name") > -1) {
              setPublicNameHelperText(errors.publicNameTaken);
              const menuInput = document.getElementById("publicName");
              if (menuInput !== null) menuInput.focus();
            } else if (String(err) === "AxiosError: Network Error")
              showNotification("error", errors.notConnected);
            else showNotification("error", String(err));
          }
        }
      }
      setLoading(false);
      return false;
    },
    [phoneHelperText, photo, types]
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
  }, [uploadPhoto, loading, loadingPhoto]);

  const init = () => {
    setPhoto(settingsState.photo);
    setPreview(settingsState.preview);
    setTypes(settingsState.business);
    setOldName(settingsState.publicName);
    setTypes(settingsState.types);
    reset({
      publicName: settingsState.publicName,
      phone: settingsState.phone,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (
      !settingsState.photo ||
      !settingsState.preview ||
      !settingsState.business ||
      !settingsState.menu
    )
      retry();
    else init();
  }, []);

  const onLoading = () => setLoadingPhoto(true);

  /**
   *
   * @param {*} res
   */
  const onSuccess = async (res) => {
    try {
      const { url, fileId } = res;
      if (photo) await removeImage(photo.fileId);
      setPhoto({ fileId, url });
      setPreview(url);
    } catch (err) {
      console.error(err);
      const { status, data } = err.response;
      if (status === 403) await localLogOut();
    }
    setLoadingPhoto(false);
  };

  const onError = (e) => {
    showNotification("error", errors.someWrong);
    setLoadingPhoto(false);
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

  useEffect(() => {
    const [value] = phoneValue;
    if (
      value &&
      (findFirstLowerLetter(value) > -1 || findFirstUpperLetter(value) > -1)
    )
      setPhoneHelperText(errors.invalidPhone);
  }, [phoneValue]);

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
                      id="menu-photo"
                      fileName={`${getUserName()}`}
                      onChange={onLoading}
                      onError={onError}
                      onSuccess={onSuccess}
                    />
                    {loadingPhoto ? (
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
                {settings.imageSuggestion}
              </p>
            </div>
            {/* public name */}
            <SimpleInput
              id="publicName"
              inputProps={{
                className: `py-2 px-5 w-full rounded-button ${
                  publicNameHelperText.length > 0 ? "border-error" : ""
                }`,
                type: "text",
                required: true,
                onInput: validate,
                onInvalid: invalidate,
                ...register("publicName"),
              }}
              className="input-field half-behavior"
              label={settings.inputs.publicName.label}
              helperText={publicNameHelperText}
            />
            {/* phone */}
            <SimpleInput
              className="input-field half-behavior"
              id="phone"
              label={settings.inputs.phone.label}
              leftIcon={
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className={`absolute-icon-left text-2xl ${
                    phoneHelperText.length > 0
                      ? "text-error"
                      : "text-white-hover"
                  }`}
                />
              }
              inputProps={{
                className: `pl-10 py-2 pr-5 rounded-button ${
                  phoneHelperText.length > 0 ? "border-error border-2" : ""
                } w-full`,
                type: "tel",
                id: "phone",
                required: true,
                onInput: validate,
                onInvalid: invalidate,
                ...register("phone"),
              }}
              helperText={phoneHelperText}
            />
            {/* business */}
            {!loadingPlacePlaceTypes ? (
              <Autocomplete
                emptyText={settings.inputs.business.empty}
                extensible
                placeholder=""
                single={false}
                id="business"
                inputType="text"
                inputValue={currentType}
                inputValueChange={inputChange}
                className="input-field half-behavior relative"
                inputClassName={`px-5 py-2 rounded-button ${
                  phoneHelperText.length > 0 ? "border-error" : ""
                } w-full`}
                label={settings.inputs.business.label}
                loadingComponent={<Loading className="w-full h-full" />}
                loadingEffect={loadingPlaceTypes}
                options={placeTypes}
                list={types}
                onOptionSelect={handleTypes}
              />
            ) : (
              <Loading className="half-behavior relative h-40" />
            )}
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
