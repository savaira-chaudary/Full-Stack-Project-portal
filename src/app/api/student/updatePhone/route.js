import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function PATCH(request) {
    await connectDB()

    try {
        const { password, rollno , phone} = await request.json()
        if (!password || !rollno || !phone) {
            return NextResponse.json(
                { message: "password and rollno and phone is required" },
                { status: 400 }
            )
        }

       const student = await Student.findOne({ rollno });
        if (!student) {
            return NextResponse.json({
                success: false,
                message: "Invalid rollno"
            }, { status: 401 });
        }

        const updatedStudent = await Student.findOneAndUpdate(
            student,
            { phone },
            { new: true }
        );

        if (!updatedStudent) {
            return NextResponse.json(
                { success: false, message: "Student not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Phone updated.', student: updatedStudent },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        )
    }
}
