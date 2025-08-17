import { NextResponse,NextRequest } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function GET(req: NextRequest) {
    try {
        await connect();
        const users = await User.find();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.error();
    }
}