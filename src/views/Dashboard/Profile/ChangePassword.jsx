// @ts-check
import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import loadable from "@loadable/component";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import md5 from "md5";

// contexts
import { useUser } from "../../../contexts/UserProvider.jsx";
import { useLanguage } from "../../../contexts/LanguageProvider.jsx";
import { useNotification } from "../../../contexts/NotificationProvider.jsx";

// services
import { saveInfo } from "../../../services/users/post.js";
import { signOutUser } from "../../../services/auth.js";

// utils
import { passwordsAreValid } from "../../../utils/parser.js";
import { getUserName, logoutUser } from "../../../utils/auth.js";

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

export default function ChangePassword() {
  const { setUserState } = useUser();
  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const [error, setError] = useState(false);

  const [ok, setOk] = useState(1);

  const { register, reset, handleSubmit } = useForm({
    defaultValues: {
      rPassword: "",
      password: "",
    },
  });

  const [passwordHelperText, setPasswordHelperText] = useState("");
  const [rPasswordHelperText, setRPasswordHelperText] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRPassword, setShowRPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
    const passwordRef = document.getElementById("password");
    if (passwordRef !== null) passwordRef.focus();
  };

  const toggleRPassword = () => {
    setShowRPassword(!showRPassword);
    const passwordRRef = document.getElementById("rPassword");
    if (passwordRRef !== null) passwordRRef.focus();
  };

  const [loading, setLoading] = useState(false);

  const { languageState } = useLanguage();

  const { errors, messages, auth, settings } = useMemo(() => {
    return {
      errors: languageState.texts.errors,
      messages: languageState.texts.messages,
      auth: languageState.texts.auth,
      settings: languageState.texts.settings,
    };
  }, [languageState]);

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
        case "password":
          setPasswordHelperText(errors.noEmptyPassword);
        default:
          setRPasswordHelperText(errors.differentPassword);
      }
    }
  };

  const onSubmit = async (d) => {
    setLoading(true);
    setPasswordHelperText("");
    setRPasswordHelperText("");
    const { password, rPassword } = d;
    if (password === rPassword) {
      const passwordValidationResult = passwordsAreValid(
        password,
        rPassword,
        getUserName()
      );
      if (passwordValidationResult >= -1) {
        if (ok) {
          try {
            await saveInfo({
              user: getUserName(),
              password: md5(password).toString(),
              rPassword: md5(rPassword).toString(),
            });
            showNotification("success", messages.saveSuccessful);
            reset({ password: "", rPassword: "" });
          } catch (err) {
            console.error(err);
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
      } else {
        switch (passwordValidationResult) {
          case 0:
            setPasswordHelperText(errors.passwordLengthValidation);
            break;
          case 1:
            setPasswordHelperText(errors.passwordCharacterValidation);
            break;
          default:
            setPasswordHelperText(errors.passwordNameValidation);
            break;
        }
      }
    } else setRPasswordHelperText(errors.differentPassword);

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {loading ? <Loading className="loading" /> : null}
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {settings.titles.security}
        </h2>
        {!error ? (
          <>
            <SimpleInput
              id="password"
              className="input-field half-behavior"
              label={auth.inputs.password.label}
              inputProps={{
                className: `pr-10 py-2 pl-5 rounded-button ${
                  passwordHelperText.length > 0 ? "border-error border-2" : ""
                } w-full`,
                type: showPassword ? "text" : "password",
                id: "password",
                required: true,
                onInput: validate,
                onInvalid: invalidate,
                ...register("password"),
              }}
              helperText={passwordHelperText}
              rightIcon={
                <button
                  tabIndex={-1}
                  type="button"
                  className="absolute-icon-right absolute text-primary hover:text-pdark transition"
                  onClick={togglePassword}
                >
                  <FontAwesomeIcon icon={!showPassword ? faEye : faEyeSlash} />
                </button>
              }
            />
            <SimpleInput
              id="rPassword"
              className="input-field half-behavior"
              label={auth.inputs.rPassword.label}
              inputProps={{
                className: `pr-10 py-2 pl-5 rounded-button ${
                  rPasswordHelperText.length > 0 ? "border-error border-2" : ""
                } w-full`,
                type: showRPassword ? "text" : "password",
                id: "rPassword",
                required: true,
                onInput: validate,
                onInvalid: invalidate,
                ...register("rPassword"),
              }}
              helperText={rPasswordHelperText}
              rightIcon={
                <button
                  tabIndex={-1}
                  type="button"
                  className="absolute-icon-right absolute text-primary hover:text-pdark transition"
                  onClick={toggleRPassword}
                >
                  <FontAwesomeIcon icon={!showRPassword ? faEye : faEyeSlash} />
                </button>
              }
            />
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
