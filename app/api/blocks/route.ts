import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import db from "../../../lib/db";
import type { IBlocks } from "../../../types/index";



export async function POST( request: NextRequest ) {

  const { postId, blocks }: { postId: string; blocks: IBlocks } = await request.json();

  if (postId && blocks) {
    db.posts[postId].blocks = blocks;
    const updatedBlocks = db.posts[postId].blocks;

    return NextResponse.json(updatedBlocks);
  }
}