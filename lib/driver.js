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
