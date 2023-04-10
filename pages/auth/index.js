import React, { useState, useMemo, useEffect } from "react";

import { getUserLanguage, createCookie } from "some-javascript-utils/browser";
// some-javascript-utils

// styles
import styles from "../../styles/Login.module.css";

// contexts
import { useLanguage } from "../../context/LanguageProvider";
import { useNotification } from "../../context/NotificationProvider";

// utils
import { logUser, userLogged } from "../../lib/auth";

// services
import { login } from "../../services/auth";

// components
import Link from "../../components/Link/Link";
import Loading from "../../components/Loading/Loading";

// layouts
import Head from "../../layout/Head";
import Body from "../../layout/Body";

import config from "../../lib/config";

const Login = () => {
  const { setNotificationState } = useNotification();

  const showNotification = (ntype, message) =>
  setNotificationState({
    type: "set",
    ntype,
    message,
  });

  const { languageState, setLanguageState } = useLanguage();

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
  }, [setLanguageState]);

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(1);

  const [remember, setRemember] = useState(false);

  const loginText = useMemo(() => {
    return languageState.texts.Login;
  }, [languageState]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      showNotification("success", loginText.loginSuccessful);
      setTimeout(() => {
        if (userLogged()) window.location.href = "/";
      }, 100);
    } catch (err) {
      console.error(err);
      const { response } = err;
      if (response && response.status === 401)
        showNotification("error", languageState.texts.errors.wrong);
      else showNotification("error", String(err));
    }
    setLoading(false);
  };

  return (
    <>
      <Head />
      <Body>
        <div className="bg-dark-blood flex items-center justify-center w-viewport h-viewport">
          <form className={`${styles.form}`} onSubmit={submit}>
            <div className="bg-blood rounded-20px flex flex-col justify-between xs:p-mobil md:p-tablet h-full">
              <div className="flex flex-col gap-2.5">
                <h1 className="text-dodger text-h1-xs">{loginText.Title}</h1>
                <div>
                  <label className="text-dodger">
                    {loginText.Inputs.User.label}
                  </label>
                  <input
                    required
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder={loginText.Inputs.User.placeholder}
                    className="mt-2.5 text-dodger bg-dark-blood rounded-20px p-active border-red bg-none w-full"
                  />
                </div>
                <div className="mt-4">
                  <label className="text-dodger">
                    {loginText.Inputs.Password.label}
                  </label>
                  <input
                    required
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={loginText.Inputs.Password.placeholder}
                    className="mt-2.5 text-dodger bg-dark-blood rounded-20px p-active border-red bg-none w-full"
                  />
                </div>
                <div className="flex w-full justify-between mt-5">
                  <div className="flex items-center gap-2.5">
                    <input
                      id="remember"
                      type="checkbox"
                      checked={remember}
                      className="cursor-pointer"
                      onChange={() => setRemember(!remember)}
                    />
                    <label htmlFor="remember" className="text-dodger">
                      {loginText.Remember}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <button className="p-active rounded-20px bg-dodger transition ease duration-150 hover:text-white hover:bg-dark-dodger">
                      {loginText.Submit}
                    </button>
                  </div>
                </div>
              </div>
              <Link
                href="/forgot-password"
                className="text-dodger underline xs:mt-10"
              >
                {loginText.Forgot}
              </Link>
            </div>
          </form>
        </div>
      </Body>
    </>
  );
};

export default Login;
