import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        await connect();
        const { eventId } = await request.json();
        
        console.log("Searching for event with ID:", eventId);
        
        const event = await Event.findById(eventId);
        console.log("Found event:", event);

        if (!event) {
            return NextResponse.json({
                success: false,
                message: "Event not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            event
        }, { status: 200 });   
    }
    catch(error: any) {
        console.error("Error in getSingleEvent:", error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}