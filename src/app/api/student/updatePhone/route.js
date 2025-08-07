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
         // get student details       
        const { password, rollno , phone} = await request.json()
        if (!password || !rollno || !phone) {
            return NextResponse.json(
                { message: "password and rollno and phone is required" },
                { status: 400 }
            )
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
            { phone },
            { new: true }
        );

        return NextResponse.json(
            { message: 'Phone updated.', updatedPhone: updatedStudent.phone },
            { status: 200 }
        )

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        )
    }
}
