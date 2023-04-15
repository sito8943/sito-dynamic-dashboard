import axios from "axios";
import config from "../config";
// @ts-ignore
import { getAuth } from "../auth/auth";

// cookies
// @ts-ignore
import { getCookie, getUserLanguage } from "some-javascript-utils/browser";

export const pingSender = async (model) => {
  const response = await axios({
    url: `${config.apiUrl}general/ping?model=${model}`,
    method: "get",
    headers: {
      ...getAuth,
      Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
    },
  });
  const data = await response.data;
  const { date } = data;
  if (localStorage.getItem(model) !== null) {
    if (Number(localStorage.getItem(model)) < date || data.error)
      localStorage.removeItem(model);
    else return false;
  } else localStorage.setItem(model, date);
  localStorage.setItem(model, date);
  return true;
};

/**
 * @param {string} collection
 * @param {object} model - The place object that contains the place's information.
 * @returns The data from the response.
 */
export const createModel = async (collection, model) => {
  // @ts-ignore
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}general/save`,
    { model, collection, create: true },
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
 * @param {String} collection
 * @param {string[]} models - The place id of the place you want to delete.
 * @returns The data is being returned.
 */
export const deleteModels = async (collection, models) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}general/delete-many`,
    { models, collection },
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
 * @param {string} collection
 * @param {object} model - Place data: name, lastname, email, password, rpassword
 * @returns The data is being returned.
 */
export const modifyModel = async (collection, model) => {
  const response = await axios.post(
    // @ts-ignore
    `${config.apiUrl}general/save`,
    { collection, model },
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
 *
 * @param {string} value
 * @param {string} collection
 * @param {string[]} attributes
 * @param {string} attribute
 * @param {string} comparison
 * @returns
 */
// @ts-ignore
export const fetchModel = async (
  value,
  collection,
  attributes = [],
  attribute = "id",
  comparison = "equal"
) => {
  let response;
  try {
    response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}general/fetch`,
      {
        value,
        collection,
        attributes,
        attribute,
        comparison,
      },
      {
        // @ts-ignore
        headers: {
          ...getAuth,
          Authorization: `Bearer ${getCookie(config.basicKey)}`,
        },
      }
    );
    return await response.data;
  } catch (err) {
    return { error: String(err) };
  }
};

/**
 *
 * @param {string} value
 * @param {string} collection
 * @param {string[]} attributes
 * @param {string} attribute
 * @param {string} comparison
 * @returns
 */
// @ts-ignore
export const fetchList = async (
  value,
  collection,
  page = 1,
  count = 10,
  orderBy = "date",
  attributes = []
) => {
  let response;

  try {
    response = await axios.post(
      // @ts-ignore
      `${config.apiUrl}general/list`,
      {
        value,
        collection,
        page,
        count,
        orderBy,
        attributes,
        lang: getUserLanguage(),
      },
      {
        // @ts-ignore
        headers: {
          ...getAuth,
          Authorization: `Bearer ${getCookie(config.basicKey)}`,
        },
      }
    );
    return await response.data;
  } catch (err) {
    return { error: String(err) };
  }
};
