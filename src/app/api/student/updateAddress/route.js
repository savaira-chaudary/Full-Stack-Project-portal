import Student from '@/src/model/student.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
    await connectDB();

    try {
        const { address, rollno } = await request.json();

        if (!address || !rollno) {
            return NextResponse.json(
                { success: false, message: "Address and rollno are required." },
                { status: 400 }
            );
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
            { address },
            { new: true }
        );

        if (!updatedStudent) {
            return NextResponse.json(
                { success: false, message: "Student not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Address updated.", student: updatedStudent },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error.", error: error.message },
            { status: 500 }
        );
    }
}
