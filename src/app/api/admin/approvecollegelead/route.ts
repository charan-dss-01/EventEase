import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  const { clerkUserId, targetUserId, action } = await request.json();
  const adminUser = await User.findOne({ clerkId: clerkUserId });
  if (!adminUser || !adminUser.isAdmin) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
  }

  const user = await User.findOne({ clerkId: targetUserId });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  if (user.collegeLeadRequest !== "pending") {
    return NextResponse.json({ success: false, message: "No pending request" }, { status: 400 });
  }

  if (action === "approve") {
    user.role = "collegeLead";
    user.collegeLeadRequest = "approved";
  } else if (action === "reject") {
    user.collegeLeadRequest = "rejected";
  } else {
    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  }

  await user.save();
  return NextResponse.json({ success: true, message: `Request ${action}d` });
}