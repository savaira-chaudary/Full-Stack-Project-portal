import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectDB();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Please provide both email and password" },
                { status: 400 }
            );
        }

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isMatch = await Teacher.findOne({password});
        if (!isMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Login successful",
                teacher: {
                    id: teacher._id,
                    email: teacher.email,
                    fullName: teacher.fullName
                }
            },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong",
                error: error.message
            },
            { status: 500 }
        );
    }
}


