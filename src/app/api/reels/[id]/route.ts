// GET /api/reels/[id]

import { NextRequest, NextResponse } from "next/server";

import { reels } from "@/app/data"; //import dummy data

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  try {
    const reel = reels.find((r) => r.id === id);
    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }

    return NextResponse.json(reel, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
