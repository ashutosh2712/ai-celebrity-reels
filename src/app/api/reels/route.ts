// GET /api/reels

import { NextRequest, NextResponse } from "next/server";

import { reels } from "@/data";

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    return new NextResponse(JSON.stringify(reels), { status: 200 });
  } catch (error) {
    console.log("reels fetch error:", error);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
