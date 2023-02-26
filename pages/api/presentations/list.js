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
    const descriptions = await fetchTable("descriptions");
    res.status(200).json({ descriptions: Object.values(descriptions) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
