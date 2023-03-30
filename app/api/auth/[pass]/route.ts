import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server';

import constants from "../../../../lib/constants";


export async function GET( request: NextRequest, { params }: { params: {pass: string}}) {

  const { pass } = params;

  if (pass === constants.pass) {
    return NextResponse.json({
      success: true,
      token: constants.pass,
    });
  }
  
  return NextResponse.json({
    success: false,
    token: "",
  });
}
