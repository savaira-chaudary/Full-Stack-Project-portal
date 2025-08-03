// import Admin from '@/src/model/admin'
// import connectDB from '@/src/lib/dbConnect'

// export async function PATCH(request) {
    
//     await connectDB()

//     try {
//         const {password} = await request.json()
//         if (!password) {
//             return Response({ status: 400, message: 'Password is required' })
//         }

//         const adminId = request.admin?._id
//         if (!adminId) {
//             return ApiResponse({ status: 401, message: 'Unauthorized' })
//         }

//         const admin = await Admin.findById(adminId)
//         if (!admin) {
//             return ApiResponse({ status: 404, message: 'Admin not found' })
//         }

//         admin.password = password
//         await admin.save()

//         return ApiResponse({ status: 200, message: 'Password updated successfully' })
//     } catch (error) {
//         return ApiResponse({ status: 500, message: 'Internal server error', error: error.message })
//     }
// }

import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
  await connectDB();

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      );
    }

    // Simulated auth (replace with real auth middleware/session extraction)
    const adminId = request.admin?._id;
    if (!adminId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin not found' },
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
