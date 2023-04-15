// @ts-check
import React, {
  useReducer,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
const Switch = loadable((props) =>
  import("../../../components/Inputs/Switch/Switch.jsx")
);
const Scheduler = loadable((props) =>
  import("../../../components/Scheduler/Scheduler.jsx")
);
const SimpleInput = loadable((props) =>
  import("../../../components/Inputs/SimpleInput.jsx")
);
const Autocomplete = loadable((props) =>
  import("../../../components/Inputs/Autocomplete")
);

export default function Schedule() {
  const { setUserState } = useUser();
  const { languageState } = useLanguage();

  const { settings, buttons, messages } = useMemo(() => {
    return {
      settings: languageState.texts.settings,
      buttons: languageState.texts.buttons,
      messages: languageState.texts.messages,
    };
  }, [languageState]);

  const { setNotificationState } = useNotification();
  const { settingsState, setSettingsState } = useSettings();

  const [creatingTemplate, setCreatingTemplate] = useState(false);

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [error, setError] = useState(false);

  const [currentDay, setCurrentDay] = useState({ current: "DOM", old: "DOM" });

  const [startTimeHelperText, setStartTimeHelperText] = useState("");
  const [endTimeHelperText, setEndTimeHelperText] = useState("");

  const [startTime, setStartTime] = useState(
    `${
      String(new Date().getHours()).length === 1
        ? `0${new Date().getHours()}`
        : new Date().getHours()
    }:${
      String(new Date().getMinutes()).length === 1
        ? `0${new Date().getMinutes()}`
        : new Date().getMinutes()
    }`
  );
  const [endTime, setEndTime] = useState(
    `${
      String(new Date().getHours()).length === 1
        ? `0${new Date().getHours()}`
        : new Date().getHours()
    }:${
      String(new Date().getMinutes()).length === 1
        ? `0${new Date().getMinutes()}`
        : new Date().getMinutes()
    }`
  );

  const scheduleReducer = (scheduleState, action) => {
    const { type } = action;
    switch (type) {
      case "init": {
        const { days } = settings.inputs.schedule;
        const { initial } = action;
        const newDays = {};
        if (initial)
          Object.keys(initial).forEach((item) => {
            newDays[item] = {
              day: item,
              startTime: initial[item].startTime,
              endTime: initial[item].endTime,
              fullTime: initial[item].fullTime,
              dayType: settings.inputs.schedule.dayTypes[0].id,
            };
          });
        else
          Object.keys(days).forEach((item) => {
            newDays[item] = {
              day: item,
              startTime,
              endTime,
              fullTime: false,
              dayType: settings.inputs.schedule.dayTypes[0].id,
            };
          });

        return newDays;
      }
      case "change-day-start-time": {
        const { activeDay, newStartTime } = action;
        const newDays = { ...scheduleState };
        newDays[activeDay].startTime = newStartTime;
        return newDays;
      }
      case "change-day-end-time": {
        const { activeDay, newEndTime } = action;
        const newDays = { ...scheduleState };
        newDays[activeDay].endTime = newEndTime;
        return newDays;
      }
      case "change-day-full-time": {
        const { activeDay, fullTime } = action;
        const newDays = { ...scheduleState };
        newDays[activeDay].fullTime = fullTime;
        return newDays;
      }
      case "change-day-type": {
        const { activeDay, dayType } = action;
        const newDays = { ...scheduleState };
        newDays[activeDay].type = dayType;
        return newDays;
      }
      case "set-day": {
        const { currentDay, toCopy } = action;
        const newDays = { ...scheduleState };
        newDays[currentDay] = { ...newDays[toCopy] };
        return newDays;
      }
      default:
        return scheduleState;
    }
  };

  const [schedule, setSchedule] = useReducer(scheduleReducer, undefined);

  const handleDay = useCallback(
    (newDay) => setCurrentDay({ old: currentDay.current, current: newDay }),
    [currentDay]
  );

  useEffect(() => {
    if (creatingTemplate && currentDay.current !== currentDay.old) {
      // @ts-ignore
      setSchedule({
        type: "set-day",
        currentDay: currentDay.current,
        toCopy: currentDay.old,
      });
    }
  }, [currentDay, creatingTemplate]);

  const [ok, setOk] = useState(1);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    setOk(1);
  };

  const invalidate = (e) => {
    e.preventDefault();
    if (ok) {
      const { id } = e.target;
      e.target.focus();
      setOk(0);
      switch (id) {
        default:
          break;
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (ok) {
      try {
        setLoading(true);

        await saveInfo({
          user: getUserName(),
          schedule,
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
  };

  const fetch = async () => {
    if (userLogged()) {
      setLoading(true);
      setError(false);
      try {
        const data = await load(getUserName(), ["schedule", "publicName"]);

        if (data) {
          if (data.schedule)
            // @ts-ignore
            setSchedule({ type: "init", initial: data.schedule });
          // @ts-ignore
          else setSchedule({ type: "init" });

          setSettingsState({
            type: "set-schedule",
            schedule: data.schedule ? data.schedule : undefined,
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
    // @ts-ignore
    setSchedule({ type: "init", initial: settingsState.schedule });
    setLoading(false);
  };

  useEffect(() => {
    if (!settingsState.schedule) retry();
    else init();
  }, []);

  const handleCreatingTemplate = useCallback(() => {
    setCurrentDay({ current: currentDay.current, old: currentDay.current });
    setCreatingTemplate(!creatingTemplate);
  }, [currentDay]);

  return (
    <>
      <form onSubmit={onSubmit} className="form">
        {loading ? <Loading className="loading" /> : null}
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {settings.titles.schedule}
        </h2>
        {!error ? (
          <>
            <Scheduler
              activeDay={currentDay.current}
              onChange={handleDay}
              className="flex-wrap"
              schedule={schedule}
            />
            <div className="mt-5 flex items-center justify-start w-full gap-2 h-full">
              <button
                type="button"
                onClick={handleCreatingTemplate}
                className={`${creatingTemplate ? "submit" : "secondary"}`}
              >
                {creatingTemplate
                  ? settings.inputs.schedule.makingTemplate
                  : settings.inputs.schedule.makeTemplate}
              </button>
              {!loading && schedule ? (
                <Switch
                  id="full-time"
                  label={settings.inputs.schedule.fullTime}
                  value={schedule[currentDay.current].fullTime}
                  onChange={() =>
                    // @ts-ignore
                    setSchedule({
                      type: "change-day-full-time",
                      activeDay: currentDay.current,
                      fullTime: !schedule[currentDay.current].fullTime,
                    })
                  }
                />
              ) : null}
            </div>
            {!loading && schedule ? (
              <div className="flex flex-col w-full">
                <SimpleInput
                  id="startTime"
                  className="input-field half-behavior"
                  label={settings.inputs.schedule.labels.start}
                  inputProps={{
                    className: `px-5 py-2 rounded-button w-full`,
                    type: "time",
                    id: "startTime",
                    required: true,
                    onInput: validate,
                    onInvalid: invalidate,
                    value: schedule[currentDay.current].startTime,
                    onChange: (e) =>
                      // @ts-ignore
                      setSchedule({
                        type: "change-day-start-time",
                        activeDay: currentDay.current,
                        newStartTime: e.target.value,
                      }),
                  }}
                  helperText={startTimeHelperText}
                />
                <SimpleInput
                  id="endTime"
                  className="input-field half-behavior"
                  label={settings.inputs.schedule.labels.end}
                  inputProps={{
                    className: `px-5 py-2 rounded-button w-full`,
                    type: "time",
                    id: "endTime",
                    required: true,
                    onInput: validate,
                    onInvalid: invalidate,
                    value: schedule[currentDay.current].endTime,
                    onChange: (e) =>
                      // @ts-ignore
                      setSchedule({
                        type: "change-day-end-time",
                        activeDay: currentDay.current,
                        newEndTime: e.target.value,
                      }),
                  }}
                  helperText={endTimeHelperText}
                />
                <Autocomplete
                  emptyText={settings.inputs.schedule.empty}
                  extensible={false}
                  placeholder=""
                  single
                  id="dayType"
                  inputType="text"
                  className="input-field half-behavior relative"
                  inputClassName={`px-5 py-2 rounded-button w-full`}
                  label={settings.inputs.schedule.labels.dayType}
                  options={settings.inputs.schedule.dayTypes}
                  list={[
                    settings.inputs.schedule.dayTypes.find(
                      (item) => item.id === schedule[currentDay.current].dayType
                    ),
                  ]}
                  onOptionSelect={(e, newValue) =>
                    // @ts-ignore
                    setSchedule({
                      type: "change-day-type",
                      activeDay: currentDay.current,
                      dayType: newValue[0].id,
                    })
                  }
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
