import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function DELETE(request) {
    await connectDB()

    try {
        const { password ,rollno } = await request.json()

        if (!password || !rollno) {
            return NextResponse.json(
                { success: false, message: 'Password and rollno is required.' },
                { status: 400 }
            )
        }

       const student = await Student.findOne({ rollno });
        if (!student) {
            return NextResponse.json(
                { success: false, message: 'Student not found.' },
                { status: 404 }
            );
        }

        const deletedStudent = await Student.findOneAndDelete({ rollno });
        if (!deletedStudent) {
            return NextResponse.json(
                { success: false, message: 'Failed to delete Student.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Student deleted successfully.' },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete student.', error: error.message },
            { status: 500 }
        )
    }
}
