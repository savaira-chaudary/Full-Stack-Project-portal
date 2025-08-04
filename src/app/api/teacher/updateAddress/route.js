import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
    await connectDB();

    try {
        const { password,  teacherId , address } = await request.json();

        if (!password || !teacherId) {
            return NextResponse.json(
                { message: 'password and  teacherId is required' },
                { status: 400 }
            );
        }

       const teacher = await Teacher.findOne({  teacherId });
               if (!teacher) {
                   return NextResponse.json({
                       success: false,
                       message: "Invalid rollno"
                   }, { status: 401 });
               }
       
               const updatedTeacher = await Teacher.findOneAndUpdate(
                   teacher,
                   { address },
                   { new: true }
               );
       
               if (!updatedTeacher) {
                   return NextResponse.json(
                       { success: false, message: "Teacher not found." },
                       { status: 404 }
                   );
               }

        return NextResponse.json(
            { message: 'Address updated.', teacher: updatedTeacher },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        );
    }
}
