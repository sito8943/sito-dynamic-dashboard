// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
//@ts-check

// auth
import { verifyBearer, headers } from "../../../lib/auth";

/**
 *
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  if (req.headers.authorization) {
    if (req.headers.authorization.indexOf("Bearer ") === 0) {
      const verified = verifyBearer(req.headers.authorization);
      if (verified) {
        try {
          const { user, app } = req.body;
          // @ts-ignore
          const result = await signOut(user, app);
          res.status(result.status).send(result.data);
          return;
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: err });
          return;
        }
      }
    }
  }
  res.status(403).send({ error: "unauthorized" });
}
