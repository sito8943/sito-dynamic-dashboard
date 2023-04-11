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
          if (verified.user === "admin")
            res
              .status(200)
              .send({ status: 200, data: { user: verified.user } });
          else res.status(200).send({ status: 200, data: false });
          return;
        } catch (err) {
          console.error(err);
          res.status(500).send({ error: err });
          return;
        }
      }
    }
  }
  res.send({ status: 200, data: { error: "unauthorized" } });
}
