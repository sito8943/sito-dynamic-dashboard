//@ts-check
import db from "./db.json";

import { v4 as uuid } from "uuid";

/**
 *
 * @param {String} collection
 * @param {Object} model
 * @return message => ok || error
 */
export const saveModel = async (collection, model) => {
  const token = uuid();
  db[collection][token] = { ...model, id: token };
  return "ok";
};

/**
 *
 * @param {string} table
 * @param {object} model
 * @returns
 */
export const updateModel = async (table, model) => {
  if (!table) return undefined;
  const collection = db[table];
  collection[model.id] = { ...collection[model.id], ...model };
  return "ok";
};

/**
 *
 * @param {String} table
 * @param {any} attribute
 * @param {any} value
 * @returns
 */
export const fetchTable = async (
  table,
  attribute = undefined,
  value = undefined
) => {
  if (!attribute && !value) return db[table] || {};
  if (attribute && value && attribute === "id") return db[table][attribute];
  if (attribute && value) {
    for (const item of Object.values(db[table]))
      if (item.id === value) return item;
  }
  return undefined;
};

/**
 *
 * @param {string} table
 * @param {any} attribute
 * @param {any} query
 * @returns
 */
export const fetchModel = async (table, attribute, query) => {
  if (!table) return undefined;
  const collection = db[table];
  if (!collection) return undefined;
  let element;
  switch (typeof query) {
    default: {
      // string
      element = collection[query];
      break;
    }
  }
  if (!element) return undefined;
  return element;
};
