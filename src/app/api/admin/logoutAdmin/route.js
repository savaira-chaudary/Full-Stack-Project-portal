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
        const response = NextResponse.json({
            success: true,
            message: "Admin logged out successfully"
        });

        // Remove the admin session cookie
        response.headers.set('Set-Cookie', 'adminToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');

        return response;
        } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong during logout",
            error: error.message
        }, { status: 500 });
        }
} 
