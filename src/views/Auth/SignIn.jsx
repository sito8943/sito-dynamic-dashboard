import { useForm } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import React, { useEffect, useState, useMemo } from "react";
import { Base64 } from "js-base64";
import loadable from "@loadable/component";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

// some-javascript-utils
import { createCookie, getCookie } from "some-javascript-utils/browser";

// contexts
import { useLanguage } from "../../contexts/LanguageProvider";
import { useNotification } from "../../contexts/NotificationProvider";

// utils
import { logUser, userLogged } from "../../utils/auth";
import { parseQueries, parseStringToArray } from "../../utils/parser";

// services
import { login } from "../../services/auth";

import config from "../../config";

// styles
import "./styles.css";

// components
import Loading from "../../components/Loading/Loading";
const SimpleInput = loadable((props) =>
  import("../../components/Inputs/SimpleInput")
);

Base64.extendString();

export default function SignIn() {
  const location = useLocation();

  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
    setNotificationState({
      type: "set",
      ntype,
      message,
    });

  const { languageState } = useLanguage();

  const { messages, errors, auth, buttons } = useMemo(() => {
    return {
      messages: languageState.texts.messages,
      errors: languageState.texts.errors,
      auth: languageState.texts.auth,
      buttons: languageState.texts.buttons,
    };
  }, [languageState]);

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(1);

  const [remember, setRemember] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const { user, password } = data;
    try {
      const response = await login(user, password, remember);
      const data = response.data;
      const { apps } = data;
      createCookie(
        config.basicKeyCookie,
        response.data.expiration,
        response.data.token
      );
      logUser(remember, user.split("@")[0], apps || {});
      showNotification("success", messages.loginSuccessful);
      setTimeout(() => {
        if (userLogged()) window.location.href = "/";
      }, 100);
    } catch (err) {
      console.error(err);
      const { response } = err;
      if (response && response.status === 401)
        showNotification("error", errors.wrong);
      else if (String(err) === "AxiosError: Network Error")
        showNotification("error", errors.notConnected);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(false);
  }, []);

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
        case "user":
          return showNotification("error", errors.nameRequired);
        default:
          return showNotification("error", errors.noEmptyPassword);
      }
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
    const passwordRef = document.getElementById("password");
    if (passwordRef !== null) passwordRef.focus();
  };

  const authenticator = async (queries) => {
    const queryParams = parseQueries(queries);
    const { auth, auth1, auth2, auth3 } = queryParams;
    if (auth && auth1 && auth2 && auth3) {
      const key = auth.fromBase64();
      const key1 = auth1.fromBase64();
      const key2 = auth2.fromBase64();
      const key3 = auth3.fromBase64();
      const parseKey3 = parseStringToArray(key3);
      createCookie(config.basicKeyCookie, key1, key);
      logUser(remember, key2, parseKey3 || []);
      showNotification("success", messages.loginSuccessful);
      setTimeout(() => {
        if (userLogged()) window.location.href = "/";
      }, 100);
    }
  };

  useEffect(() => {
    const { search } = location;
    if (search.length) authenticator(search);
  }, [location]);

  return (
    <div className="sign-in-container">
      <form className="sign-in" onSubmit={handleSubmit(onSubmit)}>
        {loading ? (
          <Loading className="absolute top-0 left-0 z-30 dark:bg-dark-background bg-light-background2 rounded-scard" />
        ) : null}
        <h2 className="text-h4 font-bold dark:text-white text-dark-background2">
          {auth.signIn}
        </h2>
        <SimpleInput
          label={auth.inputs.user.label}
          id="user"
          className="flex flex-col w-full gap-2"
          inputProps={{
            className: "p-button rounded-button w-full",
            type: "text",
            id: "user",
            required: true,
            onInput: validate,
            onInvalid: invalidate,
            ...register("user"),
          }}
        />
        <SimpleInput
          id="password"
          className="flex flex-col w-full gap-2"
          label={auth.inputs.password.label}
          inputProps={{
            className: "p-button rounded-button w-full",
            type: showPassword ? "text" : "password",
            id: "password",
            required: true,
            onInput: validate,
            onInvalid: invalidate,
            ...register("password"),
          }}
          rightIcon={
            <button
              tabIndex={-1}
              type="button"
              className="password-button absolute text-primary hover:text-pdark transition"
              onClick={togglePassword}
            >
              <FontAwesomeIcon icon={!showPassword ? faEye : faEyeSlash} />
            </button>
          }
        />
        <div className="cursor-pointer flex items-center justify-start gap-2">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            id="remember"
          />
          <label
            onClick={() => setRemember(!remember)}
            className="cursor-pointer"
          >
            {auth.inputs.remember.label}
          </label>
        </div>
        <button
          type="submit"
          className="p-button rounded-button text-white bg-primary transition hover:bg-pdark"
        >
          {buttons.signIn}
        </button>
        <span>
          {auth.register.text}
          <Link
            to="/auth/sign-up"
            className="underline text-primary hover:text-pdark transition ml-1"
          >
            {auth.register.link}
          </Link>
        </span>
      </form>
    </div>
  );
}
