import { NextResponse } from 'next/server';
import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
    await connectDB();

    try {
        const { profilePicture , teacherId} = await request.json();

        if (!profilePicture || !teacherId) {
            return NextResponse.json(
                { message: "Profile picture required." },
                { status: 400 }
            );
        }

       const teacher = await Teacher.findOne({ teacherId });
              if (!teacher) {
                  return NextResponse.json({
                      success: false,
                      message: "TeacherId not found"
                  }, { status: 404 });
              }
      

        const updatedTeacher = await Teacher.findOneAndUpdate(
             teacher,
             { profilePicture },
             { new: true }
           );

        if (!updatedTeacher) {
            return NextResponse.json(
                { message: 'Teacher not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Profile picture updated.', teacher: updatedTeacher },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        );
    }
}
