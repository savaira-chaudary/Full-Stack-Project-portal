import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function POST(request) {
     await connectDB()

    try {
        const { email, password, username } = await request.json();
        if (!email || !password || !username) {
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

        const isMatch = await Student.findOne({password});
        if (!isMatch) {
            return NextResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }
        
        return NextResponse.json({
            success: true,
            message: "Login successful",
            student: {
                id: student._id,
                email: student.email,
                username: student.username
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