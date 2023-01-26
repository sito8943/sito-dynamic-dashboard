// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

import { fetchTable } from "../../../lib/driver";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  const presentations = await fetchTable("presentations");
  res.status(200).json({ presentations: Object.values(presentations) });
}
