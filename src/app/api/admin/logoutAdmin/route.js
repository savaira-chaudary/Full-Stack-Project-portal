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
    // Clear all admin sessions on logout by emptying the sessions array
    admin.sessions = [];
    await admin.save();

        const response = NextResponse.json({
            success: true,
            message: "Admin logged out successfully"
        });

        // Clear the admin session cookie
  response.cookies.set("admin_session", "", {
         httpOnly: true,
         secure: true,
         sameSite: "strict",
         path: "/",
         expires: new Date(0) // expire immediately
  });
        return response;
        } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong during logout",
            error: error.message
        }, { status: 500 });
        }
} 
