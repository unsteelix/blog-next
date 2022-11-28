import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../lib/db";
import type { IPosts } from "../../types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const listPromises: Promise<any>[] = [];

    const posts: IPosts = db.posts;
    await res.revalidate("/");

    // Object.values(posts).forEach((p) => {
    //   listPromises.push(res.revalidate(`/post/${p.slug}`));
    // });

    // const result = await Promise.allSettled(listPromises);
    // console.log(result);

    return res.json({ revalidated: {} });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
