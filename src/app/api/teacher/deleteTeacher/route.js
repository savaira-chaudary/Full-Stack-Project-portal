// import Teacher from '@/src/model/teacher'
// import connectDB from '@/src/lib/dbConnect'
// import { NextResponse } from 'next/server';

// export async function DELETE(request) {
    
//     await connectDB()
//    try {
//     const {password} = await request.json()
//     if (!password) {
//             return ApiResponse(400, { message: 'Password is required.' });
//         }

//         const teacherId  = request.teacher?._id;
//         if (!teacherId) {
//             return ApiResponse(400, { message: 'Teacher ID is required.' });
//         }

//         const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
//         if (!deletedTeacher) {
//             return ApiResponse(404, { message: 'Teacher not found.' });
//         }

//         return ApiResponse(200, { message: 'Teacher deleted successfully.' });
//    } catch (error) {
//     return ApiResponse(500, { message: 'Failed to delete Teacher.', error: error.message });
//    }
// }

import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/dbConnect';
import Teacher from '@/src/model/teacher';

export async function DELETE(request) {
    await connectDB();

    try {
        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { message: 'Password is required.' },
                { status: 400 }
            );
        }

        const teacherId = request.teacher?._id;
        if (!teacherId) {
            return NextResponse.json(
                { message: 'Teacher ID is required.' },
                { status: 400 }
            );
        }

        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
        if (!deletedTeacher) {
            return NextResponse.json(
                { message: 'Teacher not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Teacher deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to delete Teacher.',
                error: error.message
            },
            { status: 500 }
        );
    }
}
