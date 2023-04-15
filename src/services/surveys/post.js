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
export const surveyList = async (
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
          `axios-cache:${localStorage.getItem("survey-cache")}`
        )
      ).data;
  } catch (err) {}

  // @ts-ignore
  const response = await axios.post(
    `${config.apiUrl}survey/list`,
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
  console.log(response);
  // @ts-ignore
  localStorage.setItem("survey", response.id);
  return await response.data;
};
