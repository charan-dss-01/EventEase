/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Ticket from "@/models/ticketModel";
import Event from "@/models/eventModel";
import { connect } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
    try {
        await connect();

        const { ticketId, eventId } = await request.json();

        if (!ticketId || !eventId) {
            return NextResponse.json({
                success: false,
                message: "Missing ticketId or eventId"
            }, { status: 400 });
        }

        console.log("Verifying ticket:", { ticketId, eventId });

        // First find the event to ensure it exists
        const event = await Event.findById(eventId);
        if (!event) {
            return NextResponse.json({
                success: false,
                message: "Event not found"
            }, { status: 404 });
        }
        console.log("Event found:", event);
        console.log("Event id:", eventId);
        console.log("Ticket id:", ticketId);

        // Find the ticket - Modified to search in event's tickets array
        const ticket = await Ticket.findOne({
            ticketId: ticketId,
             eventId: eventId
        });

        console.log("Found ticket:", ticket);

        if (!ticket) {
            return NextResponse.json({
                success: false,
                message: "Invalid ticket ID for this event"
            }, { status: 404 });
        }

        // Check if ticket is already used
        if (ticket.status === 'used') {
            return NextResponse.json({
                success: false,
                message: "Ticket has already been used"
            }, { status: 400 });
        }

        // Check if ticket is cancelled
        if (ticket.status === 'cancelled') {
            return NextResponse.json({
                success: false,
                message: "Ticket has been cancelled"
            }, { status: 400 });
        }

        // Check if event date matches current date
        const eventDate = new Date(event.date);
        const currentDate = new Date();
        
        // Reset time part for date comparison
        eventDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        if (eventDate.getTime() !== currentDate.getTime()) {
            const daysUntilEvent = Math.ceil((eventDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            return NextResponse.json({
                success: false,
                message: daysUntilEvent > 0 
                    ? `Event is in ${daysUntilEvent} days` 
                    : "Event has already passed",
                daysUntilEvent
            }, { status: 400 });
        }

        // Mark ticket as used
        ticket.status = 'used';
        await ticket.save();

        return NextResponse.json({
            success: true,
            message: "Ticket verified successfully",
            ticket: {
                ticketId: ticket.ticketId,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                status: ticket.status
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error("Ticket verification error:", error.message || error);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
} 