import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
  await connectDB();

  try {
    const { profilePicture , email} = await request.json();

    if (!profilePicture || !email) {
      return NextResponse.json(
        { success: false, message: 'Profile picture and email is required.' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Admin not found"
            }, { status: 404 });
        }

    const updatedAdmin = await Admin.findOneAndUpdate(
      admin,
      { profilePicture },
      { new: true }
    );

    if (!updatedAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Profile picture updated.', admin: updatedAdmin },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}
