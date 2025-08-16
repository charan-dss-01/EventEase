import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";

export async function POST(request: NextRequest) {
  const { clerkUserId } = await request.json();

  const user = await User.findOne({ clerkId: clerkUserId });
  if(!user){
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  if (!user || !user.isCollegeLead) {
    return NextResponse.json({ success: false, message: "User is not College Lead" }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}