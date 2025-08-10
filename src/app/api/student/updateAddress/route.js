import Student from '@/src/model/student.model.js';
import connectDB from '@/src/lib/dbConnect';
import { NextResponse } from 'next/server';
import Admin from '@/src/model/admin.model.js';

export async function PATCH(request) {
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

        // Get address + rollno from request body
        const { address, rollno } = await request.json();

        if (!address || !rollno) {
            return NextResponse.json(
                { success: false, message: "Address and rollno are required." },
                { status: 400 }
            );
        }

        // Find and update student
        const student = await Student.findOne({ rollno });

        if (!student) {
            return NextResponse.json({
                success: false,
                message: "Student not found."
            }, { status: 404 });
        }

        const updatedStudent = await Student.findOneAndUpdate(
    { rollno },                  // find by rollno
    { address: address },        // set new address
    { new: true }
);

       return NextResponse.json(
    {
        success: true,
        message: "Address updated.",
        updatedAddress: updatedStudent.address
    },
    { status: 200 }
);


    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error.", error: error.message },
            { status: 500 }
        );
    }
}
