/* eslint-disable import/prefer-default-export */

// @ts-check

import Axios from "axios";

// @ts-ignore
import { getAuth } from "../../auth/auth.js";

// cookies
// @ts-ignore
// @ts-ignore
import { getCookie } from "some-javascript-utils/browser";

import config from "../../config.js";

/**
 *
 * @param {number} page
 * @param {number} count
 * @param {string} orderBy
 * @param {boolean} cleanCache
 * @returns
 */
export const campaignList = async (
  page = 1,
  count = 10,
  orderBy = "date",
  cleanCache = false
) => {
  try {
    if (!cleanCache)
      return JSON.parse(
        // @ts-ignore
        localStorage.getItem(
          `axios-cache:${localStorage.getItem("campaign-cache")}`
        )
      ).data;
  } catch (err) {}

  localStorage.removeItem(`axios-cache:${localStorage.getItem("campaign-cache")}`);
  let parameters = "";
  if (page || count || orderBy.length) {
    parameters += "?";
    if (page) parameters += `page=${page}&`;
    if (count) parameters += `count=${count}&`;
    if (orderBy.length) parameters += `orderBy=${orderBy}`;
  }
  // @ts-ignore
  const response = await Axios({
    url: `${config.apiUrl}campaign/list${parameters}`,
    method: "get",
    headers: {
      ...getAuth,
      Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
    },
  });
  // @ts-ignore
  localStorage.setItem("campaign-cache", response.id);
  return await response.data;
};