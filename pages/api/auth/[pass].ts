import type { NextApiRequest, NextApiResponse } from "next";
import type { IPost, IPosts, IBlock, IBlocks } from "../../../types/index";
import constants from "../../../lib/constants";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    success: boolean;
    token: string;
  }>
) {
  const { method } = req;
  const { pass } = req.query;

  switch (method) {
    case "GET":
      if (pass === constants.pass) {
        res.status(200).json({
          success: true,
          token: constants.pass,
        });
        return;
      }
      res.status(200).json({
        success: false,
        token: "",
      });
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
