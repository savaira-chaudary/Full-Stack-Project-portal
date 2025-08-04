import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectDB();

    try {
        const { email, password, fullName, phone, address, subjectSpecialization, qualification , teacherId} = await request.json();

        if (!email || !password || !fullName) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const existingTeacher = await Teacher.findOne({ teacherId });
        if (existingTeacher) {
            return NextResponse.json(
                { success: false, message: 'Teacher already exists.' },
                { status: 409 }
            );
        }

        const newTeacher = new Teacher({ email, password, fullName ,phone,address,subjectSpecialization,qualification,teacherId});
        await newTeacher.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Teacher registered successfully.',
                data: { id: newTeacher._id, email, fullName ,phone,address,subjectSpecialization,qualification,teacherId}
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: 'Something went wrong while registration',
                error: error.message
            },
            { status: 500 }
        );
    }
}
