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

        // get student username and email
        const { email, username, rollno} = await request.json();

        if (!rollno) {
            return NextResponse.json({
                success: false,
                message: "Please provide rollno"
            }, { status: 400 });
        }

        const student = await Student.findOne({ rollno });
         if (!student) {
            return NextResponse.json({
                success: false,
                message: "Student not found."
            }, { status: 404 });
        }
       
        const updatedStudent = await Student.findOneAndUpdate(
    { rollno },                               // find by current rollno
    { username: username, email: email },   // update username and email
    { new: true }
        );

       return NextResponse.json(
            { success: true, message: "username and email updated successfully.", student: updatedStudent },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "An error occurred while updating Student details",
            error: error.message
        }, { status: 500 });
    }
}
