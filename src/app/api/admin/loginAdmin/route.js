import Admin from '@/src/model/admin.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request) {
    await connectDB();

    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "Please provide both email and password"
            }, { status: 400 });
        }

        const admin = await Admin.findOne({ email });

        if (!admin || !(await admin.isPasswordCorrect(password))) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }

        // Generate refresh token (secure random)
        const crypto = await import('crypto');
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const createdAt = new Date();
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Add session object to admin.sessions array
        const newSession = {
            token: refreshToken,
            createdAt,
            expiresAt
        };
        // Initialize sessions array if undefined
        admin.sessions = admin.sessions || [];

         // ✅ Check if session already exists → replace the first one
        if (admin.sessions.length > 0) {
            admin.sessions[0] = newSession;
        } else {
            admin.sessions.push(newSession);
        }

        // Optional: save latest refreshToken separately
        admin.refreshToken = refreshToken;

        // Save the updated admin document
        await admin.save();

        // Set cookie
        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                fullName: admin.fullName
            }
        });

        response.cookies.set('admin_session', refreshToken, {
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
