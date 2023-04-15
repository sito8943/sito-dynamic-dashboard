import React, {
  useReducer,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
  Suspense,
} from "react";
import { useLocation } from "react-router-dom";
import { scrollTo } from "some-javascript-utils/browser.js";
import loadable from "@loadable/component";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { useScreenWidth } from "use-screen-width";

// contexts
import { useLanguage } from "../contexts/LanguageProvider.jsx";
import { useSettings } from "../contexts/SettingsProvider.jsx";
import { useNotification } from "../contexts/NotificationProvider.jsx";
import { useCalendar } from "../components/Inputs/Calendar/CalendarProvider.jsx";

// services
import {
  createModel,
  fetchModel,
  modifyModel,
  fetchList,
} from "../services/general";
import { restartUserPassword } from "../services/users/post";
import { searchNew } from "../services/search/post.js";
import { removeImage } from "../services/photo.js";

// utils
import { getUserName } from "../utils/auth.js";
import {
  parseQueries,
  parsePluralName,
  parseDateString,
} from "../utils/parser.js";

// components
import Loading from "../components/Loading/Loading.jsx";
import Switch from "../components/Inputs/Switch/Switch.jsx";

const Content = loadable((props) =>
  import("../components/Inputs/Content/Content.jsx")
);
const Calendar = loadable((props) =>
  import("../components/Inputs/Calendar/Calendar.jsx")
);
const PhotoUpload = loadable((props) =>
  import("../components/Inputs/PhotoUpload.jsx")
);
const PhotosUpload = loadable((props) =>
  import("../components/Inputs/PhotosUpload.jsx")
);
const Autocomplete = loadable((props) =>
  import("../components/Inputs/Autocomplete.jsx")
);
const SimpleInput = loadable((props) =>
  import("../components/Inputs/SimpleInput.jsx")
);
const SelectInput = loadable((props) =>
  import("../components/Inputs/SelectInput")
);
const MapComponent = loadable((props) => import("../components/Map/Map.jsx"));

export default function Form({ model }) {
  const { languageState } = useLanguage();

  const {
    messages,
    errors,
    models,
    tooltips,
    settings,
    buttons,
    table,
    labels,
  } = useMemo(() => {
    return {
      labels: languageState.texts.labels,
      table: languageState.texts.table,
      messages: languageState.texts.messages,
      errors: languageState.texts.errors,
      models: languageState.texts.models,
      tooltips: languageState.texts.tooltips,
      settings: languageState.texts.settings,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [showAuxButton, setShowAuxButton] = useState(false);
  const [auxResponsiveButton, setAuxResponsiveButton] = useState(false);
  const [showToTop, setShowToTop] = useState(false);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 100) setShowToTop(true);
      else setShowToTop(false);
    },
    [setShowToTop]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  const widthViewport = useScreenWidth();
  useEffect(() => {
    if (widthViewport.screenWidth > 900) setAuxResponsiveButton(false);
    else setAuxResponsiveButton(true);
  }, [widthViewport]);

  try {
    var { calendarState, setCalendarState } = useCalendar();
  } catch (err) {}

  const location = useLocation();

  const [promotion, setPromotion] = useState(false);
  const handlePromotion = useCallback(
    () => setPromotion(!promotion),
    [setPromotion, promotion]
  );

  //* Location
  const [lat, setLat] = useState(0);
  const [latHelperText, setLatHelperText] = useState("");
  const [lng, setLng] = useState(0);
  const [lngHelperText, setLngHelperText] = useState("");

  function capturePoint(e) {
    const { lngLat } = e;
    setLat(lngLat.lat);
    setLng(lngLat.lng);
  }

  //* Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const onEditorChange = useCallback(
    (nEditorState) => setEditorState(nEditorState),
    [setEditorState]
  );

  const [panoramic, setPanoramic] = useState(undefined);
  const [headerImages, setHeaderImages] = useState(undefined);
  const [photo, setPhoto] = useState(undefined);
  const [photoPromotion, setPhotoPromotion] = useState(undefined);
  const [descriptionPromotionHelperText, setDescriptionPromotionHelperText] =
    useState("");

  const { reset, handleSubmit, register, watch, getValues } = useForm({
    defaultValues: {
      name: "",
      descriptionPromotion: "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setSettingsState({ type: "any-changes", to: true });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const { name, descriptionPromotion } = watch();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [idToModify, setIdToModify] = useState(undefined);

  const restartPassword = useCallback(async () => {
    try {
      await restartUserPassword(idToModify);
      showNotification("info", messages.restorePassword);
    } catch (error) {
      console.error(error);
      showNotification("error", errors.someWrong);
    }
  }, [idToModify]);

  const mainRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (
        mainRef !== null &&
        mainRef.current.offsetHeight + 150 > window.innerHeight
      ) {
        setShowAuxButton(true);
      } else setShowAuxButton(false);
    }, 1000);
  }, [loading, mainRef]);
  // const [classifications, setClassifications] = useState([]);

  const [ok, setOk] = useState(true);

  const validate = () => {
    setOk(true);
  };

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(false);
      switch (id) {
        case "lng":
          return setLngHelperText(errors.lngRequired);
        case "lat":
          return setLatHelperText(errors.latRequired);
          break;
        case "descriptionPromotion":
          return setDescriptionPromotionHelperText(errors.descriptionRequired);
        default:
          return setHelperTexts({
            type: "set",
            id,
            value: errors[`${id}Required`],
          });
      }
    }
  };
  
  const onSubmit = async (data) => {
    setLoading(true);
    setHelperTexts({ type: "clear" });
    setDescriptionPromotionHelperText("");
    if (ok) {
      try {
        let toSaveData = {
          date: new Date().getTime(),
          visibility: true,
          id: idToModify,
          user: getUserName(),
          promotion,
          ...data,
        };
        //* lists
        if (Object.values(lists).length)
          toSaveData = { ...toSaveData, ...lists };
        //* content
        if (lat && lng) toSaveData.location = { lat, lng };
        if (editorState) {
          const parsedContent = draftToHtml(
            convertToRaw(editorState.getCurrentContent())
          );
          if (parsedContent !== "<p></p>\n")
            toSaveData.content = draftToHtml(
              convertToRaw(editorState.getCurrentContent())
            );
        }
        //* for events and campaigns
        if (
          calendarState &&
          calendarState.date &&
          calendarState.startTime &&
          calendarState.endTime
        ) {
          toSaveData.calendar = { ...calendarState };
          toSaveData.calendar.date = [
            parseDateString(toSaveData.calendar.date[0]),
            parseDateString(toSaveData.calendar.date[1]),
          ];
        }
        //* photo
        if (photo.url && photo.url.length) toSaveData.photo = photo;
        if (promotion) {
          toSaveData.promotion = promotion;
          if (photoPromotion.url && photoPromotion.url.length)
            //* photo promotion
            toSaveData.photoPromotion = photoPromotion;
        }
        //* panoramic
        if (panoramic.url && panoramic.url.length) toSaveData.pano = panoramic;
        //* header images
        if (headerImages.length && headerImages[0].url !== "")
          toSaveData.headerImages = headerImages;

        //* services call
        toSaveData.date = new Date().getTime();
        if (idToModify) await modifyModel(parsePluralName(model), toSaveData);
        else await createModel(parsePluralName(model), toSaveData);

        //? notifying
        showNotification("success", messages.saveSuccessful);
        //* resetting
        const resetValues = { ...data };
        Object.keys(resetValues).forEach((item) => {
          resetValues[item] = "";
        });
        reset({
          id: "",
          ...resetValues,
        });
        //* lists
        setLists({ type: "clear" });
        //* photo
        setPhoto({ url: "", fileId: "" });
        //* headerImages
        setHeaderImages([]);
        //* photo promotion
        setPhotoPromotion({ url: "", fileId: "" });
        //* promotion
        setPromotion(false);
        //? settings state
        setSettingsState({ type: "reset" });
        //? calendar
        try {
          setCalendarState({ type: "reset" });
        } catch (err) {}
        //? content
        setEditorState(EditorState.createEmpty());
        //? proper id
        setIdToModify("");
      } catch (err) {
        console.error(err);
        if (String(err) === "AxiosError: Network Error")
          showNotification("error", errors.notConnected);
        else showNotification("error", String(err));
      }
    }
    setLoading(false);
  };

  const localFetchRemoteList = async (
    data,
    localCollection,
    remoteCollection
  ) => {
    const query = {};
    data.forEach((/** @type {string | number} */ item) => (query[item] = item));
    const response = await fetchList(query, remoteCollection, 1, -1, "id", [
      "id",
      "name",
    ]);
    const { list } = response;
    setLists({ type: "set", id: localCollection, value: list });
  };

  const fetch = async (toModify = undefined) => {
    setLoading(true);
    try {
      const inputLists = Object.values(models[model].form.inputs)
        .filter((item) => item.list)
        .map((item) => item.props.id);
      const remoteLists = Object.values(models[model].form.inputs)
        .filter((item) => item.list && item.remote)
        .map((item) => item.props.id);
      setLists({ type: "init", inputs: inputLists });
      setOptions({ type: "init", inputs: inputLists });
      setRemoteInputs({ type: "init", inputs: remoteLists });
      setHelperTexts({
        type: "init",
        inputs: Object.values(models[model].form.inputs).map(
          (item) => item.props.id
        ),
      });
      if (toModify) {
        const response = await fetchModel(toModify, parsePluralName(model));
        const { data } = response;

        if (data.promotion) setPromotion(data.promotion);
        //* fetching content
        if (data.content)
          setEditorState(
            EditorState.createWithContent(
              ContentState.createFromBlockArray(htmlToDraft(data.content))
            )
          );

        //* fetching location
        if (data.location) {
          setLat(data.location.lat);
          setLng(data.location.lng);
        }
        //* fetching calendar
        if (data.calendar)
          setCalendarState({ type: "init", initial: data.calendar });
        else if (
          model === "event" ||
          model === "campaign" ||
          model === "survey"
        )
          setCalendarState({ type: "init" });
        //* activity types
        if (data.activityTypes)
          await localFetchRemoteList(
            data.activityTypes,
            "activityTypes",
            "activityTypes"
          );
        //* activities
        if (data.activities)
          await localFetchRemoteList(
            data.activities,
            "activities",
            "activities"
          );
        //* places
        if (data.places)
          await localFetchRemoteList(data.places, "places", "places");
        //* fetching category
        if (data.category)
          await localFetchRemoteList(
            data.category,
            "category",
            "productCategories"
          );
        //* fetching classification
        if (data.classification)
          setLists({
            type: "set",
            id: "classification",
            value: data.classification,
          });
        //* fetching placeTypes
        if (data.placeType)
          await localFetchRemoteList(
            data.placeType,
            "placeTypes",
            "placeTypes"
          );
        //* fetching types
        if (data.types)
          await localFetchRemoteList(data.types, "types", "types");
        //* fetching social media
        if (data.socialMedias)
          setLists({
            type: "set",
            id: "socialMedias",
            value: data.socialMedias,
          });
        //* fetching services
        if (data.services)
          setLists({
            type: "set",
            id: "services",
            value: data.services,
          });
        if (data.apps) setLists({ type: "set", id: "apps", value: data.apps });
        //* fetching state
        if (data.state)
          setLists({
            type: "set",
            id: "state",
            value: [table.local.userStates[data.state]],
          });
        //* fetching panoramic
        if (data.pano) {
          setSettingsState({
            type: "set-old-panoramic",
            photo: data.pano,
          });
          setPanoramic(data.pano);
        } else setPanoramic({ url: "", fileId: "" });
        //* fetching header images
        if (data.headerImages) {
          setSettingsState({
            type: "set-old-headerImages",
            photo: data.headerImages,
          });
          setHeaderImages(data.headerImages);
        } else setHeaderImages([]);
        //* fetching photo
        if (data.photo) {
          setSettingsState({ type: "set-old-photo", photo: data.photo });
          setPhoto(data.photo);
        } else setPhoto({ url: "", fileId: "" });
        //* fetching photo promotion
        if (data.photoPromotion) {
          setSettingsState({
            type: "set-old-photo-promotion",
            photo: data.photoPromotion,
          });
          setPhotoPromotion(data.photoPromotion);
        } else setPhotoPromotion({ url: "", fileId: "" });
        reset({ ...data });
      } else {
        setPanoramic({ url: "", fileId: "" });
        setHeaderImages([]);
        setPhoto({ url: "", fileId: "" });
        setPhotoPromotion({ url: "", fileId: "" });
        if (model === "event" || model === "campaign" || model === "survey")
          setCalendarState({ type: "init" });
      }
    } catch (err) {
      console.error(err);
      if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  const retry = (toModify = undefined) => fetch(toModify);

  const printImageUpload = useCallback(
    (item) => {
      return (
        <PhotoUpload
          imageSuggestion={models[model].imageSuggestion}
          id="photo"
          name={name}
          photo={photo}
          setPhoto={setPhoto}
          label={item.label}
        />
      );
    },
    [photo, setPhoto, name]
  );

  const printPanoramicUpload = useCallback(
    (item) => {
      return (
        <PhotoUpload
          id="panoramic"
          imageSuggestion={tooltips.panoramic}
          name={`${name}-panoramic`}
          photo={panoramic}
          setPhoto={setPanoramic}
          label={item.label}
        />
      );
    },
    [panoramic, setPanoramic, name]
  );

  const printImagesUpload = useCallback(
    (item) => {
      return (
        <PhotosUpload
          id="headerImages"
          imageSuggestion={tooltips.headerImages}
          name={`${name}-headerImage-${headerImages?.length}`}
          photo={headerImages}
          setPhoto={setHeaderImages}
          label={item.label}
        />
      );
    },
    [headerImages, setHeaderImages, name]
  );

  const fetchRemoteModel = async (remoteValue, id) => {
    try {
      const response = await searchNew(
        remoteValue,
        [id],
        "name",
        ["name", "id"],
        1,
        -1
      );
      const { list } = await response;
      setOptions({ type: "set", id, value: list });
    } catch (err) {
      console.error(err);
      const { status, data } = err.response;
      if (status === 403) await localLogOut();
      showNotification("error", String(err));
    }
  };

  function remoteInputsReducer(remoteInputState, action) {
    const { type } = action;
    switch (type) {
      case "init": {
        const { inputs } = action;
        const newList = { ...remoteInputState };
        inputs.forEach((id) => {
          newList[id] = [];
        });
        return newList;
      }
      case "set": {
        const { id, value } = action;
        const newList = { ...remoteInputState };
        newList[id] = value;
        fetchRemoteModel(value, id);
        setSettingsState({ type: "any-changes", to: true });
        return newList;
      }
      default:
        return remoteInputState;
    }
  }

  const [remoteInputs, setRemoteInputs] = useReducer(remoteInputsReducer, []);

  const optionsReducer = (optionsState, action) => {
    const { type } = action;
    switch (type) {
      case "init": {
        const { inputs } = action;
        const newList = { ...optionsState };
        inputs.forEach((id) => {
          newList[id] = [];
        });
        return newList;
      }
      case "set": {
        const { id, value } = action;
        const newList = { ...optionsState };
        newList[id] = value;
        return newList;
      }
      default:
        return optionsState;
    }
  };

  const [options, setOptions] = useReducer(optionsReducer, {});

  const listReducer = (listState, action) => {
    const { type } = action;
    switch (type) {
      case "init": {
        const { inputs } = action;
        const newList = { ...listState };
        inputs.forEach((id) => {
          newList[id] = [];
        });
        return newList;
      }
      case "set": {
        const { id, value } = action;
        const newList = { ...listState };
        newList[id] = value;
        setSettingsState({ type: "any-changes", to: true });
        return newList;
      }
      case "clear":
        const newList = { ...listState };
        Object.keys(newList).forEach((item) => {
          newList[item] = "";
        });
        return newList;
      default:
        return listState;
    }
  };

  const [lists, setLists] = useReducer(listReducer, {});

  const helperTextReducer = (helperTextState, action) => {
    const { type } = action;
    switch (type) {
      case "init": {
        const { inputs } = action;
        const newList = { ...helperTextState };
        inputs.forEach((id) => {
          newList[id] = [];
        });
      }
      case "set": {
        const { id, value } = action;
        const newList = { ...helperTextState };
        newList[id] = value;
        return newList;
      }
      case "clear":
        return {};
      default:
        return helperTextState;
    }
  };

  const [helperTexts, setHelperTexts] = useReducer(helperTextReducer, {});

  useEffect(() => {
    const queryParams = parseQueries(location.search);
    if (!queryParams.id) {
      scrollTo(0);
      retry();
    } else {
      setIdToModify(queryParams.id);
      retry(queryParams.id);
    }
  }, [location]);

  const removeBeforeLoad = async () => {
    if (
      settingsState.oldPanoramic &&
      panoramic.url !== settingsState.oldPanoramic.url
    )
      removeImage(panoramic.fileId);
    if (settingsState.oldPhoto && photo.url !== settingsState.oldPhoto.url)
      removeImage(photo.fileId);
    if (
      settingsState.oldPhotoPromotion &&
      photoPromotion.url !== settingsState.oldPhotoPromotion.url
    )
      removeImage(photoPromotion.fileId);
  };

  useEffect(() => {
    if (settingsState.anyChange)
      window.onbeforeunload = function (e) {
        removeBeforeLoad();

        e.preventDefault();
        return "¿Desea recargar la página web?";
      };
    else window.onbeforeunload = null;
  }, [settingsState, photo]);

  const parsePaste = (e) => {
    e.preventDefault();

    let paste = (e.clipboardData || window.clipboardData).getData("text");
    paste = paste.toUpperCase();
    const splitByComma = paste.split(",");
    if (splitByComma.length === 2) {
      const [lat, lng] = splitByComma;
      setLat(Number(lat));
      setLng(Number(lng.replace(/ /g, "")));
    }
  };

  const printLatInput = useCallback(
    () => (
      <SimpleInput
        id="lat"
        className="input-field flex-1"
        label={settings.inputs.map.labels.lat}
        inputProps={{
          className: `px-5 py-2 rounded-button w-full`,
          type: "number",
          id: "lat",
          required: true,
          onInput: validate,
          onInvalid: invalidate,
          onPaste: parsePaste,
          value: lat,
          onChange: (e) => setLat(Number(e.target.value)),
        }}
        helperText={latHelperText}
      />
    ),
    [lat]
  );

  const printLngInput = useCallback(
    () => (
      <SimpleInput
        id="lng"
        className="input-field flex-1"
        label={settings.inputs.map.labels.lng}
        inputProps={{
          className: `px-5 py-2 rounded-button w-full`,
          type: "number",
          id: "lng",
          required: true,
          onInput: validate,
          onInvalid: invalidate,
          onPaste: parsePaste,
          value: lng,
          onChange: (e) => setLng(e.target.value),
        }}
        helperText={lngHelperText}
      />
    ),
    [lng]
  );

  return (
    <form
      ref={mainRef}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full mt-2 relative"
    >
      {showAuxButton && !auxResponsiveButton ? (
        <div className="flex items-center gap-2 mt-3 appear">
          {model === "user" ? (
            <button
              className="secondary"
              type="button"
              onClick={restartPassword}
            >
              {buttons.restartPassword}
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="submit"
          >
            {buttons.save}
          </button>
        </div>
      ) : null}
      <Suspense>
        {loading ? (
          <Loading className="absolute w-full h-full top-0 left-0 bg-white dark:bg-dark-background2 rounded-2xl" />
        ) : null}
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {idToModify
            ? `${models[model].titles.modifying} ${
                getValues().name || getValues().title || getValues().user
              }`
            : models[model].titles.insert}
        </h2>

        {!loading
          ? Object.values(models[model].form.inputs)
              .filter((item) => (!idToModify && item.initial) || idToModify)
              .map((item) => (
                <div key={item.props.id}>
                  {item.list ? (
                    <>
                      {!item.remote ? (
                        <Autocomplete
                          emptyText={item.empty}
                          extensible={item.extensible}
                          single={item.single}
                          id={item.props.id}
                          chipsIcon={item.chipsIcon}
                          inputType={item.props.type}
                          placeholder={item.props.placeholder}
                          className="input-field half-behavior relative"
                          inputClassName={`px-5 py-2 rounded-button ${
                            helperTexts[item.props.id] > 0 ? "border-error" : ""
                          } w-full`}
                          label={item.label}
                          options={
                            item.local
                              ? Object.values(table.local[item.list])
                              : options[item.props.id]
                          }
                          list={lists[item.props.id]}
                          onOptionSelect={(e, newValue) => {
                            setLists({
                              type: "set",
                              id: item.props.id,
                              value: newValue,
                            });
                          }}
                        />
                      ) : (
                        <SelectInput
                          emptyText={item.empty}
                          extensible={item.extensible}
                          single={item.single}
                          id={item.props.id}
                          chipsIcon={item.chipsIcon}
                          inputType={item.props.type}
                          placeholder={item.props.placeholder}
                          className="input-field half-behavior relative"
                          inputClassName={`px-5 py-2 rounded-button ${
                            helperTexts[item.props.id] > 0 ? "border-error" : ""
                          } w-full`}
                          label={item.label}
                          inputValue={remoteInputs[item.props.id]}
                          inputValueChange={(e) =>
                            setRemoteInputs({
                              type: "set",
                              id: item.props.id,
                              value: e.target.value,
                            })
                          }
                          options={options[item.props.id]}
                          list={lists[item.props.id]}
                          onOptionSelect={(e, newValue) => {
                            setLists({
                              type: "set",
                              id: item.props.id,
                              value: newValue,
                            });
                          }}
                        />
                      )}
                    </>
                  ) : null}
                  {item.props.type === "photo" ? (
                    <>{printImageUpload(item)}</>
                  ) : null}
                  {item.props.type === "panoramic" ? (
                    <>{printPanoramicUpload(item)}</>
                  ) : null}
                  {item.props.type === "headerImages" ? (
                    <>{printImagesUpload(item)}</>
                  ) : null}
                  {item.props.type === "calendar" ? (
                    <div className="mt-8">
                      <label>{item.label}</label>
                      <Calendar className="half-behavior mt-2" />
                    </div>
                  ) : null}
                  {item.props.type === "content" ? (
                    <div className="mt-8">
                      <label>{item.label}</label>
                      <Content
                        className="half-behavior mt-2"
                        value={editorState}
                        onChange={onEditorChange}
                      />
                    </div>
                  ) : null}
                  {item.props.type === "map" ? (
                    <div className="mt-8 half-behavior">
                      <label>{item.label}</label>
                      <div className="flex flex-col w-full">
                        <div className="times-rows">
                          {printLatInput()}
                          {printLngInput()}
                        </div>
                        <MapComponent
                          sx={{
                            width: "100%",
                            height: "500px",
                            marginTop: "20px",
                          }}
                          point={{
                            latitude: lat,
                            longitude: lng,
                            headerImages: headerImages.length
                              ? headerImages
                              : [photo],
                          }}
                          onClick={capturePoint}
                        />
                      </div>
                    </div>
                  ) : null}
                  {!item.list &&
                  item.props.type !== "map" &&
                  item.props.type !== "headerImages" &&
                  item.props.type !== "panoramic" &&
                  item.props.type !== "photo" &&
                  item.props.type !== "content" &&
                  item.props.type !== "calendar" ? (
                    <SimpleInput
                      id={item.props.id}
                      inputProps={{
                        className: `py-2 px-5 w-full ${
                          item.props.type !== "textarea"
                            ? "rounded-button"
                            : "rounded-2xl h-40"
                        } resize-none ${
                          helperTexts[item.props.id] ? "border-error" : ""
                        }`,
                        onInput: validate,
                        onInvalid: invalidate,
                        ...item.props,
                        ...register(item.props.id),
                      }}
                      className="input-field half-behavior"
                      label={item.label}
                      helperText={helperTexts[item.props.id]}
                    />
                  ) : null}
                </div>
              ))
          : null}
        {!loading && models[model].canPromotion ? (
          <div className="mt-8">
            <Switch
              value={promotion}
              onChange={handlePromotion}
              label={labels.promotion}
            />
            {promotion ? (
              <div>
                {/* Image */}
                <PhotoUpload
                  imageSuggestion={settings.promotionImageSuggestion}
                  id="photo-promotion"
                  name={name}
                  photo={photoPromotion}
                  setPhoto={setPhotoPromotion}
                  label={labels.photoPromotion}
                />
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
                  label={labels.descriptionPromotion}
                  helperText={descriptionPromotionHelperText}
                />
                {descriptionPromotion ? (
                  <span className="half-behavior text-right">
                    {descriptionPromotion.length} / 255
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-center gap-2  mt-3">
          {model === "user" ? (
            <button
              className="secondary"
              type="button"
              onClick={restartPassword}
            >
              {buttons.restartPassword}
            </button>
          ) : null}
          <button
            type="submit"
            className={`my-ease ${
              auxResponsiveButton
                ? `save-responsive ${showToTop ? "mr-10" : ""}`
                : "submit "
            }`}
          >
            {auxResponsiveButton ? (
              <FontAwesomeIcon icon={faSave} />
            ) : (
              buttons.save
            )}
          </button>
        </div>
      </Suspense>
    </form>
  );
}
