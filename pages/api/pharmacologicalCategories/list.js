// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

import { fetchTable } from "../../../lib/driver";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  const types = await fetchTable("pharmacologicalCategories");
  res.status(200).json({ types: Object.values(types) });
}
