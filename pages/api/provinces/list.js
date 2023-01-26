// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

import { fetchTable } from "../../../lib/driver";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  try {
    const provinces = await fetchTable("provinces");
    res.status(200).json({ provinces: Object.values(provinces) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
