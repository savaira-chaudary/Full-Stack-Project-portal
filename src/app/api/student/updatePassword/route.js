import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function PATCH(request) {
    await connectDB()

    try {
        const { password, rollno } = await request.json()

        if (!password || !rollno) {
            return NextResponse.json(
                { success: false, message: 'Password and rollno is required' },
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
            { password },
            { new: true }
        );

        if (!updatedStudent) {
            return NextResponse.json(
                { success: false, message: "Student not found." },
                { status: 404 }
            );
        }
        student.password= password
        await student.save()

        return NextResponse.json(
            { success: true, message: 'Password updated successfully' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: error.message },
            { status: 500 }
        )
    }
}
