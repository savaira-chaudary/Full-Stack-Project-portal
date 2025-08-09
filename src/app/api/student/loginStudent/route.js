import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function POST(request) {
     await connectDB()

    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Please provide both email and password"
            }, { status: 400 });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }

       // Generate a new refresh token (use a secure random string)
        const crypto = await import('crypto');
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Add session to student.sessions
        student.sessions.push({
            token: refreshToken,
            createdAt: new Date(),
            expiresAt
        });

        // Optionally, update the latest refreshToken field
        student.refreshToken = refreshToken;

        await student.save();

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            student: {
                id: student._id,
                email: student.email,
                username: student.username
            }
        }, { status: 200 });

         response.cookies.set('student_session', refreshToken, {
           httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 30 * 24 * 60 * 60, // 30 days
         });

         return response;

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}