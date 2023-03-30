import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';
import db from "../../../lib/db";
import type { IPosts } from "../../../types/index";



export async function POST( request: NextRequest ) {

  const posts: IPosts = await request.json();

  if (posts) {
    db.posts = posts;
    const updatedPosts = db.posts;
    return NextResponse.json(updatedPosts);
  }
}

export async function GET() {

  const posts = db.posts;
  
  return NextResponse.json(posts);
}





