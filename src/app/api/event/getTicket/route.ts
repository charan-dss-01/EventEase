import { NextRequest, NextResponse } from "next/server";
import Ticket from "@/models/ticketModel";
import Event from "@/models/eventModel";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { eventId, userId } = await request.json();

        if (!eventId || !userId) {
            return NextResponse.json({
                success: false,
                message: "Missing eventId or userId"
            }, { status: 400 });
        }

        // Find the ticket
        const ticket = await Ticket.findOne({
            eventId,
            userId
        }).populate({
            path: 'eventId',
            select: 'title date location category'
        });

        if (!ticket) {
            return NextResponse.json({
                success: false,
                message: "Ticket not found"
            }, { status: 404 });
        }

        // Get user details
        const user = await User.findOne({ clerkId: userId });
        
        // Format the response
        const formattedTicket = {
            ticketId: ticket.ticketId,
            eventId: ticket.eventId._id,
            userId: ticket.userId,
            createdAt: ticket.createdAt,
            status: ticket.status,
            event: {
                title: ticket.eventId.title,
                date: ticket.eventId.date,
                location: ticket.eventId.location,
                category: ticket.eventId.category
            },
            user: user ? {
                fullName: user.fullName,
                username: user.username
            } : null
        };

        return NextResponse.json({
            success: true,
            ticket: formattedTicket
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching ticket:", error.message || error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
} 