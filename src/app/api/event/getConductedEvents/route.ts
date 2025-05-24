import { NextRequest, NextResponse } from "next/server";
import Event from "@/models/eventModel";
import User from "@/models/userModel";
import Ticket from "@/models/ticketModel";
import { connect } from "@/dbConfig/dbConfig";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { clerkUserId } = await request.json();

        if (!clerkUserId) {
            return NextResponse.json({
                success: false,
                message: "Missing clerkUserId"
            }, { status: 400 });
        }

        // Find the user
        const user = await User.findOne({ clerkId: clerkUserId });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Find all events created by the user and populate necessary fields
        const events = await Event.find({ createdBy: user._id })
            .sort({ date: 1 }) // Sort by date ascending
            .populate({
                path: 'tickets',
                model: Ticket
            });

        console.log(`Found ${events.length} events for user ${user._id}`);

        return NextResponse.json({
            success: true,
            events
        }, { status: 200 });
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
        console.error("Error fetching conducted events:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
} 