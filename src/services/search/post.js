/* eslint-disable import/prefer-default-export */
import axios from "axios";
import {getAuth} from "../../auth/auth";
import config from "../../config";

import {getCookie} from "some-javascript-utils/browser";

/**
 *
 * @param {string} text
 * @param {string} attribute
 * @param {string} models
 * @returns
 */
export const search = async (text, attribute, models) => {
    const response = await axios.post(
        `${config.apiUrl}search`,
        {text, attribute, models},
        {
            headers: {...getAuth, Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,},
        }
    );
    return await response.data;
};

/**
 *
 * @param {string[]} ids
 * @param {string} models
 * @returns
 */
export const searchIds = async (ids, models) => {
    const response = await axios.post(
        `${config.apiUrl}search/array-ids`,
        {ids, models},
        {
            headers: {...getAuth, Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,},
        }
    );
    return await response.data;
};

/**
 *
 * @param {string} text
 * @param {string[]} models
 * @param {string} attribute
 * @param {number} page
 * @param {number} count
 * @returns
 */
export const searchNew = async (
    text,
    models,
    attribute = "",
    attributes = [],
    page = 1,
    count = 10
) => {
    const response = await axios.post(
        `${config.apiUrl}search/new`,
        {text, models, attribute, attributes, page, count},
        {
            headers: {
                ...getAuth,
                Authorization: `Bearer ${getCookie(config.basicKeyCookie)}`,
            },
        }
    );
    return await response.data;
};
