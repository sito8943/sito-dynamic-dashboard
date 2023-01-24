// @ts-check

import ky from "ky-universal";
import { useQuery } from "@tanstack/react-query";

// parsers
import { parseAttributes } from "../lib/parser";

/**
 *
 * @param {Number} page
 * @param {Number} count
 * @param {String[]} attributes
 * @param {Object[]} where
 */
export const fetchModel = async (
  model = "provinces",
  page = 1,
  count = 10,
  attributes = [],
  where = []
) => {
  const parsed = await ky(`http://localhost:3000/api/${model}/list`).json();
  // @ts-ignore
  const result = parsed[model];
  if (result) {
    const toReturn = [];
    for (
      let i = page * count;
      i < count * (page + 1) && i < result.length;
      i += 1
    ) {
      const parsedItem = await parseAttributes(result[i], attributes);
      toReturn.push(parsedItem);
    }
    return toReturn;
  }

  return undefined;
};

/**
 * @param {Number} page
 * @param {Number} count
 * @param {String[]} attributes
 * @param {Object[]} where
 * @returns
 */
export const useModel = (
  model = "provinces",
  page = 0,
  count = 10,
  attributes = [],
  where = []
) => {
  return useQuery({
    queryKey: [model, page, count, attributes, where],
    queryFn: () => fetchModel(model, page, count, attributes, where),
  });
};
