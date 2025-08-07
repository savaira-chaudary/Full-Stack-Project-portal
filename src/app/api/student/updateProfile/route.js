import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'
import Admin from '@/src/model/admin.model.js';

export async function PATCH(request) {
    await connectDB()

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
        //get student details
        const { profilePicture , rollno } = await request.json()
        if (!profilePicture || !rollno) {
            return NextResponse.json(
                { success: false, message: 'Profile picture and rollno is required.' },
                { status: 400 }
            )
        }

       const student = await Student.findOne({ rollno });
        if (!student) {
            return NextResponse.json({
                success: false,
                message: "student not found"
            }, { status: 404 });
        }

    const updatedStudent = await Student.findOneAndUpdate(
      student,
      { profilePicture },
      { new: true }
    );

        return NextResponse.json(
            { success: true, message: 'Profile picture updated.', ProfileUpdated: updatedStudent.profilePicture },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Server error.', error: error.message },
            { status: 500 }
        )
    }
}
