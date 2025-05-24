/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import Event from "@/models/eventModel";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const {clerkUserId} = await request.json();
        const user=await User.findOne({clerkId:clerkUserId})
        if(!user){
            return NextResponse.json({
                success:false,
                message:"User not found",
            },{status:404});
        }
        const events=await User.findOne({clerkId:clerkUserId}).populate("eventsParticipated");
        return NextResponse.json({
            success:true,
            events:events?.eventsParticipated,
        },{status:200});
        
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error:any) {
        console.log(error.message);
        return NextResponse.json({
            success:false,
            message:error.message,
        },{status:500});
    }
}