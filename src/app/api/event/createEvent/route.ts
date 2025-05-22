import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Event from "@/models/eventModel";
import User from "@/models/userModel";
import cloudinary from "@/lib/cloudinary";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const { title, description, date, location, image, category, clerkUserId, capacity } = await request.json();

        await connect();

        if(!title || !description || !date || !location || !image || !category || !clerkUserId){
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return NextResponse.json({
                success: false,
                message: "Invalid date format"
            }, { status: 400 });
        }

        // Upload image to Cloudinary
        let imageUrl;
        try {
            if (!image) {
                throw new Error('No image provided');
            }

            console.log('Uploading to Cloudinary with config:', {
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY ? 'exists' : 'missing',
                api_secret: process.env.CLOUDINARY_API_SECRET ? 'exists' : 'missing'
            });

            const result = await cloudinary.uploader.upload(image, {
                folder: "event_images",
                resource_type: "auto"
            });
            imageUrl = result.secure_url;
        } catch (error: any) {
            console.error('Cloudinary upload error:', error);
            return NextResponse.json({
                success: false,
                message: `Failed to upload image: ${error.message}`
            }, { status: 500 });
        }

        if (title.length > 100) {
            return NextResponse.json({
                success: false,
                message: "Title must be less than 100 characters"
            }, { status: 400 });
        }

        if (description.length > 1000) {
            return NextResponse.json({
                success: false,
                message: "Description must be less than 1000 characters"
            }, { status: 400 });
        }

        const mongoUser = await User.findOne({ clerkId: clerkUserId });
        if (!mongoUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        // const existingEvent = await Event.findOne({
        //     title,
        //     date: eventDate,
        //     location
        // });

        // if (existingEvent) {
        //     return NextResponse.json({
        //         success: false,
        //         message: "An event with the same title, date, and location already exists"
        //     }, { status: 409 });
        // }

        const event = await Event.create({ 
            title, 
            description, 
            date: eventDate, 
            location, 
            image: imageUrl, // Use Cloudinary URL
            category,
            createdBy: mongoUser._id,
            totalParticipants:0,
            registeredUsers:[],
            capacity:capacity,
            tickets:[]
        });

        // Add event ID to the user's eventsCreated array
        mongoUser.eventsCreated.push(event._id);
        await mongoUser.save();

        return NextResponse.json({
            success: true,
            event,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Event creation error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || "Something went wrong"
        }, { status: 500 });
    }
}