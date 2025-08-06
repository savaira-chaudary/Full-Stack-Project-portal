import Student from '@/src/model/student.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin.model.js'

export async function PATCH(request) {
    await connectDB();

    try {
        const { email, sessions } = await request.json();

        if (!email || !sessions) {
            return NextResponse.json(
                { success: false, message: "Admin email and session are required." },
                { status: 401 }
            );
        }

        const ADMIN_EMAIL = await Admin.findOne({email})
        const ADMIN_SESSION = await Admin.find({sessions})

        if (email !== ADMIN_EMAIL || sessions !== ADMIN_SESSION) {
            return NextResponse.json(
                { success: false, message: "You are unauthorized." },
                { status: 401 }
            );
        }
        //updating address if authorized
        const { address, rollno } = await request.json();

        if (!address || !rollno) {
            return NextResponse.json(
                { success: false, message: "Address and rollno are required." },
                { status: 400 }
            );
        }

        const student = await Student.findOne({ rollno });
        if (!student) {
            return NextResponse.json({
                success: false,
                message: "Invalid rollno"
            }, { status: 401 });
        }

        const updatedStudent = await Student.findOneAndUpdate(
            student,
            { address },
            { new: true }
        );

        if (!updatedStudent) {
            return NextResponse.json(
                { success: false, message: "Student not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Address updated.", student: updatedStudent },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error.", error: error.message },
            { status: 500 }
        );
    }
}
