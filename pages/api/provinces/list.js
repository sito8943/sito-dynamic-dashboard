// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import db from "../db.json";

export default function handler(req, res) {
  const { provinces } = db;
  res.status(200).json({ provinces: Object.values(provinces) });
}
