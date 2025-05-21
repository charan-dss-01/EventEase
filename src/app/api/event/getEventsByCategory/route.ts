import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        await connect();

        const body = await request.json();
        const { category } = body;

        // Check if category is provided and is a valid string
        if (!category || typeof category !== "string") {
            return NextResponse.json({
                success: false,
                message: "Category is required and must be a string"
            }, { status: 400 });
        }

        const events = await Event.find({ category });

        return NextResponse.json({
            success: true,
            count: events.length,
            events
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching events by category:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}
