// import Admin from '@/src/model/admin'
// import connectDB from '@/src/lib/dbConnect'
// import {ApiResponse} from '@/src/utils/ApiResponse'

// export async function PATCH(request) {
    
//     await connectDB()

//     try {
//         const { profilePicture } = await request.json();
//         if (!profilePicture) {
//             return ApiResponse(400, { message: 'Profile picture is required.' });
//         }

//         const adminId = request.admin?._id;
//         if (!adminId) {
//             return ApiResponse(401, { message: 'Unauthorized.' });
//         }

//         const updatedAdmin = await Admin.findByIdAndUpdate(
//             adminId,
//             { profilePicture },
//             { new: true }
//         );

//         if (!updatedAdmin) {
//             return ApiResponse(404, { message: 'Admin not found.' });
//         }

//         return ApiResponse(200, { message: 'Profile picture updated.', admin: updatedAdmin });
//     } catch (error) {
//         return ApiResponse(500, { message: 'Server error.', error: error.message });
//     }
// }

import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
  await connectDB();

  try {
    const { profilePicture } = await request.json();

    if (!profilePicture) {
      return NextResponse.json(
        { success: false, message: 'Profile picture is required.' },
        { status: 400 }
      );
    }

    // Replace this with actual token decoding or middleware-based auth
    const adminId = request.admin?._id;

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
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
