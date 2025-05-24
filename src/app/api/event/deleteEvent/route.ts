import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import User from "@/models/userModel";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connect();

    const body = await request.json();

    // Validate request body
    if (!body.eventId || !body.clerkUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: eventId and clerkUserId",
        },
        { status: 400 }
      );
    }

    const { eventId, clerkUserId } = body;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: "Event not found",
        },
        { status: 404 }
      );
    }

    // Find user
    const mongoUser = await User.findOne({ clerkId: clerkUserId });
    if (!mongoUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Authorization check
    if (event.createdBy.toString() !== mongoUser._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this event",
        },
        { status: 403 }
      );
    }

    // Delete event
    await Event.findByIdAndDelete(eventId);
    mongoUser.eventsCreated = mongoUser.eventsCreated.filter(
        (id: string) => id.toString() !== eventId
      );
    await mongoUser.save();
    return NextResponse.json(
      {
        success: true,
        message: "Event deleted successfully",
      },
      { status: 200 }
    );
  } 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Error deleting event:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
