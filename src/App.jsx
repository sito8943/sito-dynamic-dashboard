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
//* municipalities
import {
  parseRows as municipalitiesParseRows,
  tableQuery as municipalitiesTableQuery,
} from "./views/Dashboard/Municipalities/parseRows.js";
//* provinces
import {
  parseRows as provincesParseRows,
  tableQuery as provincesTableQuery,
} from "./views/Dashboard/Provinces/parseRows.js";
//* medicines
import {
  parseRows as medicinesParseRows,
  tableQuery as medicinesTableQuery,
} from "./views/Dashboard/Medicines/parseRows.js";
//* descriptions
import {
  parseRows as descriptionsParseRows,
  tableQuery as descriptionsTableQuery,
} from "./views/Dashboard/Descriptions/parseRows.js";
//* pharmaceuticGroups
import {
  parseRows as pharmaceuticGroupsParseRows,
  tableQuery as pharmaceuticGroupsTableQuery,
} from "./views/Dashboard/PharmaceuticGroups/parseRows.js";
//* centers
import {
  parseRows as centersParseRows,
  tableQuery as centersTableQuery,
} from "./views/Dashboard/Centers/parseRows.js";
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
//* medicines
import { descriptionList } from "./services/descriptions/post.js";
//* medicines
import { pharmaceuticGroupList } from "./services/pharmaceuticGroups/post.js";
//* medicines
import { medicineList } from "./services/medicines/post.js";
//* provinces
import { provinceList } from "./services/provinces/post.js";
//* municipalities
import { municipalityList } from "./services/municipalities/post.js";
//* municipalities
import { centerList } from "./services/centers/post.js";
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
                    exact
                    path="/"
                    element={
                      <Suspense>
                        <Auth />
                      </Suspense>
                    }
                  >
                    <Route index element={<SignIn />} />
                    <Route exact path="/recovery" element={<Recovery />} />
                  </Route>
                  <Route
                    exact
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
                </>
              ) : (
                <>
                  <Route
                    exact
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
                    exact
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
                    exact
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
                    exact
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
                      path="/provinces/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.provinces} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="province"
                            modelFetch={provinceList}
                            parseRows={provincesParseRows}
                            tableQuery={provincesTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/provinces/form"
                        element={<Form model="province" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/municipalities/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.municipalities} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="municipality"
                            modelFetch={municipalityList}
                            parseRows={municipalitiesParseRows}
                            tableQuery={municipalitiesTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/municipalities/form"
                        element={<Form model="municipality" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/medicines/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.medicines} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="medicine"
                            modelFetch={medicineList}
                            parseRows={medicinesParseRows}
                            tableQuery={medicinesTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/medicines/form"
                        element={<Form model="medicine" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/descriptions/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.descriptions} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="description"
                            modelFetch={descriptionList}
                            parseRows={descriptionsParseRows}
                            tableQuery={descriptionsTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/descriptions/form"
                        element={<Form model="description" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/pharmaceuticGroups/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer
                              tabs={tabsText.pharmaceuticGroups}
                            />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="pharmaceuticGroup"
                            modelFetch={pharmaceuticGroupList}
                            parseRows={pharmaceuticGroupsParseRows}
                            tableQuery={pharmaceuticGroupsTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/pharmaceuticGroups/form"
                        element={<Form model="pharmaceuticGroup" />}
                      />
                    </Route>
                    <Route
                      exact
                      path="/centers/"
                      element={
                        <Suspense>
                          <SettingsProvider>
                            <TableContainer tabs={tabsText.centers} />
                          </SettingsProvider>
                        </Suspense>
                      }
                    >
                      <Route
                        index
                        element={
                          <List
                            model="center"
                            modelFetch={centerList}
                            parseRows={centersParseRows}
                            tableQuery={centersTableQuery}
                          />
                        }
                      />
                      <Route
                        exact
                        path="/centers/form"
                        element={<Form model="center" />}
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
                exact
                path="/terms-conditions"
                element={
                  <Suspense>
                    <Printer text="terms" />
                  </Suspense>
                }
              />
              <Route
                exact
                path="/about"
                element={
                  <Suspense>
                    <Printer text="about" />
                  </Suspense>
                }
              />
              <Route
                exact
                path="/privacy-policy"
                element={
                  <Suspense>
                    <Printer text="privacyPolicy" />
                  </Suspense>
                }
              />
              <Route
                exact
                path="/cookie-policy"
                element={
                  <Suspense>
                    <Printer text="cookiesPolicy" />
                  </Suspense>
                }
              />
              <Route
                exact
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
