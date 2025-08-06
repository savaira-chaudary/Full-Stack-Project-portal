import { NextResponse } from 'next/server';
import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';

export async function POST(request) {
    await connectDB();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please provide both email and password"
                },
                { status: 400 }
            );
        }

        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password"
                },
                { status: 401 }
            );
        }

        const isMatch = await Teacher.findOne({password});
        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password"
                },
                { status: 401 }
            );
        }

         // Clear all teacher sessions on logout by emptying the sessions array
    teacher.sessions = [];
    await teacher.save();

        const response = NextResponse.json(
            {
                success: true,
                message: "Teacher logged out successfully"
            },
            { status: 200 }
        );

        return response;

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong during logout",
                error: error.message
            },
            { status: 500 }
        );
    }
}
 