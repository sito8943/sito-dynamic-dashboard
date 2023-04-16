/* eslint-disable import/prefer-default-export */

// @ts-check

import axios from "axios";

// some-javascript-utils
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

// @ts-ignore
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
export const provinceList = async (
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
          `axios-cache:${localStorage.getItem("province-cache")}`
        )
      ) !== null
    ) {
      return JSON.parse(
        // @ts-ignore
        localStorage.getItem(
          `axios-cache:${localStorage.getItem("province-cache")}`
        )
      ).data;
    }
  } catch (err) {}

  localStorage.removeItem(
    `axios-cache:${localStorage.getItem("province-cache")}`
  );
  const response = await axios.post(
    `${config.apiUrl}province/list`,
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
  localStorage.setItem("province-cache", response.id);
  return response.data;
};
