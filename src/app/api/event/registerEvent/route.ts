import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Event from "@/models/eventModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { eventId, userId } = await request.json();

        console.log(eventId,userId);

        if (!eventId || !userId) {
            return NextResponse.json({
                success: false,
                message: "Missing eventId or userId"
            }, { status: 400 });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({
                success: false,
                message: "Event not found"
            }, { status: 404 });
        }
        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        if (event.totalParticipants >= event.capacity) {
            return NextResponse.json({
                success: false,
                message: "Event is already full"
            }, { status: 400 });
        }

        // Avoid duplicate registration
        if (event.registeredUsers.includes(userId)) {
            return NextResponse.json({
                success: false,
                message: "User already registered for this event"
            }, { status: 400 });
        }

        // Register user
        event.totalParticipants++;
        event.registeredUsers.push(userId);
        await event.save();

        // Update user
        user.eventsParticipated.push(eventId);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Event registered successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error("Registration error:", error.message || error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
