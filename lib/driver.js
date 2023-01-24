//@ts-check

import db from "./db.json";

/**
 *
 * @param {String} table
 * @p
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
