import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
  await connectDB();

  try {
    const { email, password } = await request.json();

    if (!password || !email) {
      return NextResponse.json(
        { success: false, message: 'Password and email is required' },
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
              { password },
              { new: true }
            );
        
            if (!updatedAdmin) {
              return NextResponse.json(
                { success: false, message: 'Admin not found.' },
                { status: 404 }
              );
            }

    admin.password = password;
    await admin.save();

    return NextResponse.json(
      { success: true, message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
