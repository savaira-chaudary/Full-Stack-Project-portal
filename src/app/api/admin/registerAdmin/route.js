import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/dbConnect';
import Admin from '@/src/model/admin.model.js';

export async function POST(request) {
  await connectDB(); // connect to MongoDB

  try {
    const { email, password, fullName } = await request.json();

    // Validate input
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { success: false, message: 'All fields (email, password, fullName) are required.' },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin already exists with this email.' },
        { status: 409 }
      );
    }

    // Create and save new admin
    const newAdmin = new Admin({ email, password, fullName });
    await newAdmin.save();

    // Return response
    return NextResponse.json(
      {
        success: true,
        message: 'Admin registered successfully.',
        data: {
          id: newAdmin._id,
          email: newAdmin.email,
          fullName: newAdmin.fullName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong while registration.',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
