import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import { NextResponse,NextRequest } from "next/server";

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
  await connect();
  const { clerkUserId, collegeName, degree, yearOfPassing, agenda } = await request.json();
  const adminId="689ebcf180871b1ba59e6bf4";
  const admin = await User.findById(adminId);
  const user = await User.findOne({ clerkId: clerkUserId });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
  if (user.collegeLeadRequest === "pending") {
    return NextResponse.json({ success: false, message: "Request already pending" }, { status: 400 });
  }
  if(user.collegeLeadRequest === "approved") {
    return NextResponse.json({ success: false, message: "Request already approved" }, { status: 400 });
  }
  user.collegeLeadRequest = "pending";
  user.collegeInfo = {
    collegeName,
    degree,
    yearOfPassing,
    agenda
  };
  
  admin.requestedId.push(user._id);
  await admin.save();
  await user.save();

  return NextResponse.json({ success: true, message: "Request sent" });
}


export async function GET(request:NextRequest){
  await connect();
  const users = await User.find({ collegeLeadRequest: "pending" });
  return NextResponse.json({ success: true, data: users });
}
