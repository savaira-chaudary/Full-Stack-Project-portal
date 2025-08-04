import Student from '@/src/model/student.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
    await connectDB();

    try {
        const { email, username } = await request.json();

        if (!email || !username) {
            return NextResponse.json({
                success: false,
                message: "Please provide both email and fullName"
            }, { status: 400 });
        }

        const student = await Student.findOne({ email });

         const updatedStudent = await Student.findOneAndUpdate(
            student,
            { username },
            { email},
            { new: true }
        )
          if (!updatedStudent) {
            return NextResponse.json(
                { success: false, message: "Student not found." },
                { status: 404 }
            );
        }

       student.username = username;
       student.email = email
        await student.save();

        return NextResponse.json({
            success: true,
            message: "Student details updated successfully",
            data: {
                email: student.email,
                username: student.username
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred while updating Student details",
            error: error.message
        }, { status: 500 });
    }
}
