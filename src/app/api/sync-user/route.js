// pages/api/sync-user.js
import { connect } from '@/dbConfig/dbConfig';
import User from '@/models/userModel';
import { NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method !== 'POST') return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });

  const { clerkId, email } = await req.json();

  await connect();

  let user = await User.findOne({ clerkId });

  if (!user) {
    user = await User.create({
      clerkId,
      email,
      events: [],
    });
  }
  await user.save();

  return NextResponse.json({ success: true, user }, { status: 200 });
}
