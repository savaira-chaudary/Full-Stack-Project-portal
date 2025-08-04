import { NextResponse } from 'next/server';
import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function PATCH(request) {
    await connectDB();

    try {
        const { password, teacherId , phone } = await request.json();

        if (!password || !teacherId) {
            return NextResponse.json(
                { message: "Password and Id are required." },
                { status: 400 }
            );
        }
         const teacher = await Teacher.findOne({ teacherId });
                if (!teacher) {
                    return NextResponse.json({
                        success: false,
                        message: "Invalid ID"
                    }, { status: 401 });
                }

         const updatedTeacher = await Teacher.findOneAndUpdate(
                    teacher,
                    { phone },
                    { new: true }
                );
        if (!updatedTeacher) {
            return NextResponse.json(
                { message: 'Teacher not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Phone updated.', teacher: updatedTeacher },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        );
    }
}
