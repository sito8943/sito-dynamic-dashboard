import axios from "axios";

import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

import { getAuth } from "../../auth/auth";
import config from "../../config";

/**
 *
 * @param {number} page
 * @param {number} count
 * @param {string} orderBy
 * @param {string[]} attributes
 * @param {any} query
 * @param {boolean} cleanCache
 * @returns
 */
export const userList = async (
  page = 1,
  count = 10,
  orderBy = "date",
  attributes = [],
  query = [],
  cleanCache = false
) => {
  try {
    if (!cleanCache)
      return JSON.parse(
        // @ts-ignore
        localStorage.getItem(
          `axios-cache:${localStorage.getItem("users-cache")}`
        )
      ).data;
  } catch (err) {}
  // @ts-ignore
  const response = await axios.post(
    `${config.apiUrl}user/list`,
    {
      page,
      count,
      orderBy,
      attributes,
      query,
      lang: getUserLanguage(),
    },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  // @ts-ignore
  localStorage.setItem("user", response.id);
  return await response.data;
};

/**
 *
 * @param {string} user
 * @param {String[]} attributes
 */
export const load = async (user, attributes) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/info`,
    { user, attributes },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 *
 * @param {object} options
 */
export const saveInfo = async (options) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/save-info`,
    { options },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 *
 
 */
export const restartUserPassword = async (user) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/restart-password`,
    { user },
    {
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 * Takes a user object, sends it to the API, and returns the response
 * @param {object} user - The user object that contains the user's information.
 * @returns The data from the response.
 */
export const createUser = async (user) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/create`,
    { ...user, create: true },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};

/**
 * Sends a POST request to the API with the user's ID and the ID of the user to delete
 * @param {string[]} users - The user id of the user you want to delete.
 * @returns The data is being returned.
 */
export const deleteUsers = async (users) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}user/delete-many`,
    { users },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKey)}`,
      },
    }
  );
  const data = await response.data;
  return data;
};
