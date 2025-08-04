import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function PATCH(request) {
    await connectDB()

    try {
        const { profilePicture , rollno } = await request.json()
        if (!profilePicture || !rollno) {
            return NextResponse.json(
                { success: false, message: 'Profile picture and rollno is required.' },
                { status: 400 }
            )
        }

       const student = await Student.findOne({ rollno });
        if (!student) {
            return NextResponse.json({
                success: false,
                message: "student not found"
            }, { status: 404 });
        }

    const updatedStudent = await Student.findOneAndUpdate(
      student,
      { profilePicture },
      { new: true }
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { success: false, message: 'Student not found.' },
        { status: 404 }
      );
    }

        return NextResponse.json(
            { success: true, message: 'Profile picture updated.', student: updatedStudent },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Server error.', error: error.message },
            { status: 500 }
        )
    }
}
