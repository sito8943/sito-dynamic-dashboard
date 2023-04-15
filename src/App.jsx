/* eslint-disable react-hooks/exhaustive-deps */
import React, { Suspense, useEffect, useState, useMemo } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";

import { useScreenWidth } from "use-screen-width";

// some-javascript-utils
import { getUserLanguage } from "some-javascript-utils/browser";

// utils
//* logs
import {
  parseRows as logParseRows,
  tableQuery as logTableQuery,
} from "./views/Dashboard/Backup/parseLogs.js";
//* activity types
import {
  parseRows as activityTypeParseRows,
  tableQuery as activityTypeTableQuery,
} from "./views/Dashboard/ActivityTypes/parseRows.js";
//* activities
import {
  parseRows as activityParseRows,
  tableQuery as activityTableQuery,
} from "./views/Dashboard/Activities/parseRows.js";
//* users
import {
  parseRows as userParseRows,
  tableQuery as userTableQuery,
} from "./views/Dashboard/Users/parseRows.js";

// contexts
import { useMode } from "./contexts/ModeProvider";
import { useLanguage } from "./contexts/LanguageProvider";
import { SettingsProvider } from "./contexts/SettingsProvider";
import { CalendarProvider } from "./components/Inputs/Calendar/CalendarProvider.jsx";

// utils
import {
  logoutUser,
  userLogged,
  getUserApps,
  hasApps,
  hasExactApp,
} from "./utils/auth";

// services
import { validateBasicKey } from "./services/auth";
//* activity types
import { activityTypeList } from "./services/activityTypes/post.js";
//* activities
import { activityList } from "./services/activities/post.js";
//* users
import { userList } from "./services/users/post.js";
//* logs
import { logList } from "./services/blogs/post.js";
// import {sendMobileCookie, sendPcCookie} from "./services/analytics";
import config from "./config";

// components
const Printer = loadable((props) => import("./views/Printer/Printer"));
const ToTop = loadable((props) => import("./components/ToTop/ToTop"));
const Handler = loadable((props) => import("./components/Error/Handler"));

const CookieBox = loadable((props) =>
  import("./components/CookieBox/CookieBox")
);
const Notification = loadable((props) =>
  import("./components/Notification/Notification")
);
const BigLoading = loadable((props) =>
  import("./components/Loading/BigLoading")
);

// layouts
const View = loadable((props) => import("./layouts/View"));
const Auth = loadable((props) => import("./layouts/Auth.jsx"));
const Form = loadable((props) => import("./layouts/Form.jsx"));
const List = loadable((props) => import("./layouts/List.jsx"));
const TableContainer = loadable((props) =>
  import("./layouts/TableContainer.jsx")
);

// views
const SignOut = loadable((props) => import("./views/Auth/SignOut"));
const MapView = loadable((props) =>
  import("./views/Dashboard/Map/MapView.jsx")
);
const Backup = loadable((props) =>
  import("./views/Dashboard/Backup/Backup.jsx")
);
const Texts = loadable((props) => import("./views/Dashboard/Texts/Texts.jsx"));
const Home = loadable((props) => import("./views/Dashboard/Home/Home.jsx"));
const Settings = loadable((props) =>
  import("./views/Dashboard/Settings/Settings.jsx")
);
const Profile = loadable((props) =>
  import("./views/Dashboard/Profile/Profile.jsx")
);
const Map = loadable((props) => import("./views/Dashboard/Profile/Map.jsx"));
const ChangePassword = loadable((props) =>
  import("./views/Dashboard/Profile/ChangePassword.jsx")
);
const NotFound = loadable((props) => import("./views/NotFound/NotFound"));
//* auth
const SignIn = loadable((props) => import("./views/Auth/SignIn"));
const Recovery = loadable((props) => import("./views/Auth/Recovery"));

function App() {
  const widthViewport = useScreenWidth();
  const { setModeState } = useMode();
  const { languageState, setLanguageState } = useLanguage();

  const { tabsText } = useMemo(() => {
    return {
      tabsText: languageState.texts.tabs,
    };
  }, [languageState]);

  useEffect(() => {
    // if (widthViewport.screenWidth > 900) sendPcCookie();
    // else sendMobileCookie();
  }, [widthViewport]);

  const fetch = async () => {
    try {
      const value = await validateBasicKey();
      if (!value) {
        logoutUser();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else localStorage.setItem("user", value);
    } catch (err) {
      if (String(err) !== "AxiosError: Network Error") {
        logoutUser();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      setLanguageState({ type: "set", lang: getUserLanguage(config.language) });
    } catch (err) {
      console.error(err);
    }
    try {
      document.body.className = "dark:bg-dark-background2 bg-light-background2";
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        localStorage.setItem("theme", "dark");
        setModeState({ type: "set", to: false });
      } else {
        document.documentElement.classList.add("list");
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
        setModeState({ type: "set", to: true });
      }
    } catch (err) {
      console.error(err);
    }
    if (userLogged()) fetch();
    setLoading(false);
  }, []);

  return (
    <div className="App">
      <Handler>
        <BigLoading visible={loading} />

        <Suspense>
          <BrowserRouter>
            <CookieBox />
            <Notification />
            <ToTop />
            <Routes>
              {!userLogged() ? (
                <>
                  <Route
                    path="/auth/"
                    element={
                      <Suspense>
                        <Auth />
                      </Suspense>
                    }
                  >
                    <Route index element={<SignIn />} />
                    <Route exact path="/auth/recovery" element={<Recovery />} />
                  </Route>
                  <Route path="*" element={<NotFound index="/auth/" />} />
                </>
              ) : (
                <>
                  <Route
                    path="/"
                    element={
                      <Suspense>
                        <View />
                      </Suspense>
                    }
                  >
                    <Route index element={<Home />} />
                  </Route>
                  <Route
                    path="/backup/"
                    element={
                      <Suspense>
                        <TableContainer tabs={tabsText.backup} />
                      </Suspense>
                    }
                  >
                    <Route index element={<Backup />} />

                    <Route
                      exact
                      path="/backup/logs"
                      element={
                        <List
                          model="log"
                          noAction
                          modelFetch={logList}
                          parseRows={logParseRows}
                          tableQuery={logTableQuery}
                        />
                      }
                    />
                  </Route>
                  <Route
                    path="/texts/"
                    element={
                      <Suspense>
                        <TableContainer />
                      </Suspense>
                    }
                  >
                    <Route index element={<Texts />} />
                  </Route>
                  <Route
                    path="/profile/"
                    element={
                      <Suspense>
                        <SettingsProvider>
                          <TableContainer
                            tabs={tabsText.settings}
                            responsive={1700}
                          />
                        </SettingsProvider>
                      </Suspense>
                    }
                  >
                    <Route index element={<Settings />} />
                  </Route>
                  <>
                    <Route
                      exact
                      path="/map/"
                      element={
                        <Suspense>
                          <TableContainer />
                        </Suspense>
                      }
                    >
                      <Route index element={<MapView />} />
                    </Route>

                    <Route
                      exact
                      path="/activityTypes/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.activityTypes} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="activityType"
                            modelFetch={activityTypeList}
                            parseRows={activityTypeParseRows}
                            tableQuery={activityTypeTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/activityTypes/form"
                        element={<Form model="activityType" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/activities/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.activities} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="activity"
                            modelFetch={activityList}
                            parseRows={activityParseRows}
                            tableQuery={activityTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/activities/form"
                        element={<Form model="activity" />}
                      />
                    </Route>

                    <Route
                      exact
                      path="/users/"
                      element={
                        <SettingsProvider>
                          <TableContainer tabs={tabsText.users} />
                        </SettingsProvider>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="user"
                            modelFetch={userList}
                            parseRows={userParseRows}
                            tableQuery={userTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/users/form"
                        element={<Form model="user" />}
                      />
                    </Route>
                  </>
                </>
              )}

              <Route
                path="/auth/sign-out"
                element={
                  <Suspense>
                    <SignOut />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense>
                    <NotFound />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </Handler>
    </div>
  );
}

export default App;
