import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

export const dynamic = 'force-dynamic';


export async function POST(request: NextRequest) {
    try {
        await connect();

        const { clerkUserId } = await request.json();

        if (!clerkUserId) {
            return NextResponse.json({
                success: false,
                message: "Missing 'clerkUserId' in request body"
            }, { status: 400 });
        }

        // Find the user and populate the eventsCreated field
        const user = await User.findOne({ clerkId: clerkUserId }).populate("eventsCreated");

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            events: user.eventsCreated
        }, { status: 200 });

    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error("Error fetching user's created events:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}
