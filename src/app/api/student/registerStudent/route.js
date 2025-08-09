import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'
import Admin from '@/src/model/admin.model.js'

export async function POST(request) {
    await connectDB();

    try {
         // Get cookie from request
        const cookieHeader = request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/admin_session=([^;]+)/);
        const sessionToken = tokenMatch ? tokenMatch[1] : null;

        if (!sessionToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No session token found in cookies." },
                { status: 401 }
            );
        }

        // Find admin with this session token
        const admin = await Admin.findOne({ 'sessions.token': sessionToken });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid session." },
                { status: 401 }
            );
        }

        const { email, password, username ,rollno, address, phone} = await request.json();

        if (!email || !password || !username || !rollno || !address || !phone) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return NextResponse.json(
                { success: false, message: 'Student already exists.' },
                { status: 409 }
            );
        }

        const newStudent = new Student({ email, password, username , rollno, address, phone});
        await newStudent.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Student registered successfully.',
                data: {
                    id: newStudent._id,
                    email: newStudent.email,
                    username: newStudent.username,
                    rollno: newStudent.rollno,
                    address: newStudent.address,
                    phone: newStudent.phone
                }
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while registration.",
                error: error.message
            },
            { status: 500 }
        );
    }
}
