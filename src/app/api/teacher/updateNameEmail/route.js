import { NextResponse } from 'next/server';
import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
    await connectDB();

    try {
        const { email, fullName ,teacherId} = await request.json();
        if (!email || !fullName) {
            return NextResponse.json({
                success: false,
                message: "Please provide both email and fullName"
            }, { status: 400 });
        }

        const teacher = await Teacher.findOne({ teacherId });

        const updatedTeacher = await Teacher.findOneAndUpdate(
                    teacher,
                    { fullName },
                    { email},
                    { new: true }
                )
                  if (!updatedTeacher) {
                    return NextResponse.json(
                        { success: false, message: "Student not found." },
                        { status: 404 }
                    );
                }

        teacher.fullName = fullName;
        await teacher.save();

        return NextResponse.json({
            success: true,
            message: "Teacher details updated successfully",
            data: {
                email: teacher.email,
                fullName: teacher.fullName
            }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred while updating Teacher details",
            error: error.message
        }, { status: 500 });
    }
}
