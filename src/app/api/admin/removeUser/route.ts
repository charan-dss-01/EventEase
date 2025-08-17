import { NextRequest,NextResponse } from "next/server";
import User from "@/models/userModel";
import Event from "@/models/eventModel";
import {connect} from "@/dbConfig/dbConfig";

export async function POST(request:NextRequest) {
    try{
        const { clerkId } = await request.json();
        const user = await User.findOne({ clerkId: clerkId });
        await connect();
        await User.findByIdAndDelete(user._id);
        await Event.deleteMany({ createdBy: user._id });
        return NextResponse.json({ message: "User removed successfully" });
    }catch (error) {
        return NextResponse.json({ message: "Error removing user" });
    }
}