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

        // Generate a new refresh token (use a secure random string)
        const crypto = await import('crypto');
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Add session to teacher.sessions
        teacher.sessions.push({
            token: refreshToken,
            createdAt: new Date(),
            expiresAt
        });

        // Optionally, update the latest refreshToken field
        teacher.refreshToken = refreshToken;

        await teacher.save();

        const response = NextResponse.json(
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

        response.cookies.set('teacher_session', refreshToken, {
         httpOnly: true,
         secure: true,
         sameSite: 'strict',
         path: '/',
         maxAge: 30 * 24 * 60 * 60,
         });

        return response;

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


