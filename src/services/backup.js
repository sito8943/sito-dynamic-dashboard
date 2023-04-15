import axios from "axios";
import config from "../config";
// @ts-ignore
import { getAuth } from "../auth/auth";

// cookies
// @ts-ignore
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

// utils
import { getUserName } from "../utils/auth";

/**
 * @param {object} json
 * @returns The data from the response.
 */
export const uploadBackup = async (json) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}backup/upload`,
    { json, user: getUserName() },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 * @param {number} id
 * @returns The data from the response.
 */
export const restoreBackup = async (id) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}backup/restore`,
    { id, user: getUserName() },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 * @param {number} id
 * @returns The data from the response.
 */
export const downloadBackup = async (id) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}backup/download`,
    { id, user: getUserName() },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 
 * @returns The data from the response.
 */
export const createBackup = async () => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}backup/create`,
    { user: getUserName() },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};

/**
 * @param {string} id
 * @returns The data from the response.
 */
export const executeBackup = async (id) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}backup/execute`,
    { id, user: getUserName() },
    {
      // @ts-ignore
      headers: {
        ...getAuth,
        Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
      },
    }
  );
  return await response.data;
};
