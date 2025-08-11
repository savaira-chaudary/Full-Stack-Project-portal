import { NextResponse } from 'next/server';
import Teacher from '@/src/model/teacher.model.js';
import connectDB from '@/src/lib/dbConnect';
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
                
        const {teacherId , phone } = await request.json();

        if (!teacherId) {
            return NextResponse.json(
                { message: "Id are required." },
                { status: 400 }
            );
        }
         const teacher = await Teacher.findOne({ teacherId });
                if (!teacher) {
                    return NextResponse.json({
                        success: false,
                        message: "Invalid ID"
                    }, { status: 401 });
                }

         const updatedTeacher = await Teacher.findOneAndUpdate(
                    { teacherId},
                    { phone },
                    { new: true }
                );
        if (!updatedTeacher) {
            return NextResponse.json(
                { message: 'Teacher not found.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'Phone updated.', teacherphone: updatedTeacher.phone },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        );
    }
}
