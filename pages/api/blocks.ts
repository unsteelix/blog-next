import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import type { IPost, IPosts, IBlock, IBlocks } from "../../types/index";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPosts>
) {
  const { method } = req;

  switch (method) {
    case "POST":
      const { postId, blocks }: { postId: string; blocks: IBlocks } = req.body;
      if (postId && blocks) {
        db.posts[postId].blocks = blocks;
        const updatedBlocks = db.posts[postId].blocks;
        res.status(200).json(updatedBlocks);
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
