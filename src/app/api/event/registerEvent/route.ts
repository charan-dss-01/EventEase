import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import Event from "@/models/eventModel";
import Ticket from "@/models/ticketModel";
import { connect } from "@/dbConfig/dbConfig";

// Function to generate a random ticket ID
function generateTicketId() {
    const prefix = 'TICKET';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

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

        // Find the event and ensure it exists
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({
                success: false,
                message: "Event not found"
            }, { status: 404 });
        }

        // Find the user and ensure it exists
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // Check if event is full
        if (event.totalParticipants >= event.capacity) {
            return NextResponse.json({
                success: false,
                message: "Event is already full"
            }, { status: 400 });
        }

        // Initialize arrays if they don't exist
        if (!event.registeredUsers) {
            event.registeredUsers = [];
        }
        if (!event.tickets) {
            event.tickets = [];
        }
        if (!user.eventsParticipated) {
            user.eventsParticipated = [];
        }

        // Check for duplicate registration
        if (event.registeredUsers.includes(userId)) {
            return NextResponse.json({
                success: false,
                message: "User already registered for this event"
            }, { status: 400 });
        }

        // Generate ticket ID and create ticket
        const ticketId = generateTicketId();
        const ticket = await Ticket.create({
            ticketId,
            eventId,
            userId,
            status: 'active'
        });

        // Update event
        event.totalParticipants += 1;
        event.registeredUsers.push(userId);
        event.tickets.push(ticket._id);
        await event.save();

        // Update user
        user.eventsParticipated.push(eventId);
        await user.save();

        return NextResponse.json({
            success: true,
            message: "Event registered successfully",
            ticketId: ticket.ticketId
        }, { status: 200 });

    } catch (error: any) {
        console.error("Registration error:", error.message || error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}
