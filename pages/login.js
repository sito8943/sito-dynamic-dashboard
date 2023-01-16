import React, { useState, useMemo } from "react";

// styles
import styles from "../styles/Login.module.css";

// contexts
import { useLanguage } from "../context/LanguageProvider";

// components
import Link from "./components/Link/Link";

// layouts
import Head from "./layout/Head";
import Body from "./layout/Body";

const Login = () => {
  const { languageState } = useLanguage();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(false);

  const loginText = useMemo(() => {
    return languageState.texts.Login;
  }, [languageState]);

  const submit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <Head />
      <Body>
        <div className="bg-dark-blood flex items-center justify-center w-viewport h-viewport">
          <form onSubmit={submit}>
            <div
              className={`${styles.form} bg-blood rounded-20px flex flex-col justify-between p-mobil`}
            >
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
                  <div className="flex" items-center>
                    <button className="p-active rounded-20px bg-dodger transition ease duration-150 hover:text-white hover:bg-dark-dodger">
                      {loginText.Submit}
                    </button>
                  </div>
                </div>
              </div>
              <Link href="/forgot-password" className="text-dodger underline">
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
