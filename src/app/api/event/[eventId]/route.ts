import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  try {
    await connect();

    const { eventId } = params;

    if (!eventId) {
      return NextResponse.json({ success: false, message: "Missing eventId" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event }, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
