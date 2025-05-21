import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import User from "@/models/userModel";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        await connect();
        const events = await Event.find();
        return NextResponse.json({events}, {status: 200});
    }
    catch(error:any){
        return NextResponse.json({message: "Internal Server Error"}, {status: 500});
    }
}
