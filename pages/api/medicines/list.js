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
    const medicines = await fetchTable("medicines");
    res.status(200).json({ medicines: Object.values(medicines) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
