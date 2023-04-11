// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

// auth
import { login } from "../../../lib/controller/auth";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  console.info("Logging user");
  try {
    const { user, password, remember } = req.body;
    const result = await login(user, password, remember);
    if (result.status === 200) console.info(`${user} logged successful`);
    else if (result.status === 422)
      console.error(`${user} ${result.data.error}`);
    else console.error(result.error);
    res.status(result.status).send({ ...result });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
}
