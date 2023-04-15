/* eslint-disable import/prefer-default-export */

// @ts-check

import axios from "axios";

// some-javascript-utils
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

// @ts-ignore
import { getAuth } from "../../auth/auth";

// services
import { fetchList } from "../general";

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
export const logList = async (
  page = 1,
  count = 10,
  orderBy = "date",
  attributes = [],
  query = [],
  cleanCache = false
) => {
  try {
    if (
      !cleanCache &&
      JSON.parse(
        // @ts-ignore
        localStorage.getItem(
          `axios-cache:${localStorage.getItem("placeType-cache")}`
        )
      ) !== null
    ) {
      return JSON.parse(
        // @ts-ignore
        localStorage.getItem(
          `axios-cache:${localStorage.getItem("placeType-cache")}`
        )
      ).data;
    }
  } catch (err) {}

  localStorage.removeItem(
    `axios-cache:${localStorage.getItem("placeType-cache")}`
  );
  const response = await axios.post(
    `${config.apiUrl}general/list`,
    {
      collection: "logs",
      page,
      count,
      orderBy,
      attributes,
      value: query,
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
  localStorage.setItem("placeType-cache", response.id);
  return response.data;
};
