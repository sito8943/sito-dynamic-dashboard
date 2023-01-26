// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

import { saveModel } from "../../../lib/driver";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  try {
    const { model } = req.body;
    const result = await saveModel("presentations", model);
    res.status(200).json({ message: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
}
