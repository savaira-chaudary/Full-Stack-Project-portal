import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/dbConnect';
import Teacher from '@/src/model/teacher.model.js';
import Admin from '@/src/model/admin.model.js';

export async function DELETE(request) {
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
        
        const { password, teacherId } = await request.json();

        if (!password || !teacherId) {
            return NextResponse.json(
                { message: 'Password is required.' },
                { status: 400 }
            );
        }

        const teacher = await Teacher.findOne({ teacherId });
                if (!teacher) {
                    return NextResponse.json(
                        { success: false, message: 'teacher not found.' },
                        { status: 404 }
                    );
                }
        

       const deletedTeacher = await Teacher.findOneAndDelete({ teacherId });
               if (!deletedTeacher) {
                   return NextResponse.json(
                       { success: false, message: 'Failed to delete Teacher.' },
                       { status: 404 }
                   );
               }

        return NextResponse.json(
            { message: 'Teacher deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Failed to delete Teacher.',
                error: error.message
            },
            { status: 500 }
        );
    }
}
