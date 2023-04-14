/* eslint-disable no-use-before-define */
// @ts-check

import config from "./config";

import CryptoJS from "crypto-js";

export var keys = [];
export var connections = {};
export const usersOnline = {};
export const verifyBearer = (auth) => {
  const credentials = auth.split(" ")[1];
  const bytes = CryptoJS.AES.decrypt(credentials, "ireasantiago.com");
  var token = bytes.toString(CryptoJS.enc.Utf8);
  const [user, password] = token.split("[!]");
  if (
    Object.values(keys).find(
      (item) => user === item.user && password === item.password
    )
  )
    return { user };
  return false;
};

export const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

/* eslint-disable import/prefer-default-export */
export const getAuth = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

// @ts-ignore
import { deleteCookie, getCookie } from "some-javascript-utils/browser";

export const getUserName = () => {
  let name = "";

  // @ts-ignore
  const local = localStorage.getItem(config.userCookie);

  name = local !== null ? local : "";
  if (!name) {
    // @ts-ignore
    const session = sessionStorage.getItem(config.userCookie);
    name = session !== null ? session : "";
  }
  return name;
};

export const getUserApps = () => {
  let apps = {};

  // @ts-ignore
  const local = localStorage.getItem(config.appsCookie);

  apps = local !== null ? JSON.parse(local) : undefined;
  if (!apps) {
    // @ts-ignore
    const session = sessionStorage.getItem(config.appsCookie);
    apps = session !== null ? JSON.parse(session) : {};
  }
  return apps;
};

export const hasApps = () => {
  return Object.keys(getUserApps()).length > 0;
};

/**
 * If remember is true, it stores user data to localStorage, otherwise it stores it in sessionStorage
 * @param {boolean} remember - a boolean value that determines whether the user should be remembered or not.
 * @param {string} user - The user object that you want to store in the browser.
 * @param {string[]} apps - User apps
 */
export const logUser = (remember, user, apps) => {
  // @ts-ignore
  // if (remember) {
    localStorage.setItem(config.userCookie, user);
    localStorage.setItem(config.appsCookie, JSON.stringify(apps));
  // }
  /* // @ts-ignore
  else {
    sessionStorage.setItem(config.userCookie, user);
    sessionStorage.setItem(config.appsCookie, JSON.stringify(apps));
  } */
};

/**
 * If the user is logged in, return true, otherwise return false.
 */
export const userLogged = () =>
  // @ts-ignore
  getCookie(config.basicKeyCookie).length > 0;

export const logoutUser = () =>
  // @ts-ignore
  deleteCookie(config.basicKeyCookie);

export const userData = () => {
  let user = {};
  // @ts-ignore
  const local = JSON.parse(localStorage.getItem(config.userCookie));

  user = local !== null ? local : {};
  if (!user.user) {
    // @ts-ignore
    const session = JSON.parse(sessionStorage.getItem(config.userCookie));
    user = session !== null ? session : {};
  }
  return user;
};
