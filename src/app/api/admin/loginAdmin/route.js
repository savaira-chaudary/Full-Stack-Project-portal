import Admin from '@/src/model/admin.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server';

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

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }

        // Generate a new refresh token (use a secure random string)
        const crypto = await import('crypto');
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

        // Add session to admin.sessions
        admin.sessions.push({
            token: refreshToken,
            createdAt: new Date(),
            expiresAt
        });

        // Optionally, update the latest refreshToken field
        admin.refreshToken = refreshToken;

        await admin.save();

        return NextResponse.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                fullName: admin.fullName
            }
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}