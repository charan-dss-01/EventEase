import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try{
        await connect();
        const {eventId} = await request.json();
        const event = await Event.findById(eventId);
        return NextResponse.json({
            success: true,
            event
        }, {status: 200});   
    }
    catch(error:any){
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, {status: 500});
    }
}