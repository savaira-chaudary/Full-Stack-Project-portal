import Admin from '@/src/model/admin'
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

        const isMatch = await admin.isPasswordCorrect(password);
        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            message: "Login successful",
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
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