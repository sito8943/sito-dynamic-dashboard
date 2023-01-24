// @ts-check

import { fetchTable } from "./driver";

/**
 *
 * @param {Object} model
 * @param {any[]} attributes
 */
export const parseAttributes = async (model, attributes = []) => {
  if (attributes.length) {
    const parsedModel = {};
    for (const attribute of attributes) {
      if (typeof attribute === "string")
        parsedModel[attribute] = model[attribute];
      else {
        const [toDo, toFetch] = attribute;
        const toFetchResponse = await fetchTable(toFetch, toDo, model[toFetch]);
        if (toFetchResponse) parsedModel[toFetch] = toFetchResponse[toDo];
      }
    }
    return parsedModel;
  }
  return model;
};
