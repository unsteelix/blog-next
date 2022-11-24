import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import type { IPost, IPosts, IBlock, IBlocks } from "../../types/index";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<IPosts>
) {
  const { method } = req;

  let posts: IPosts = {};

  switch (method) {
    case "GET":
      posts = db.posts;
      res.status(200).json(posts);
      break;
    case "POST":
      posts = req.body;
      if (posts) {
        db.posts = posts;
        const updatedPosts = db.posts;
        res.status(200).json(updatedPosts);
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
