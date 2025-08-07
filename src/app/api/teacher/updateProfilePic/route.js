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

        const { profilePicture , teacherId} = await request.json();

        if (!profilePicture || !teacherId) {
            return NextResponse.json(
                { message: "Profile picture required." },
                { status: 400 }
            );
        }

       const teacher = await Teacher.findOne({ teacherId });
              if (!teacher) {
                  return NextResponse.json({
                      success: false,
                      message: "TeacherId not found"
                  }, { status: 404 });
              }
      

        const updatedTeacher = await Teacher.findOneAndUpdate(
            teacher,
             { profilePicture },
             { new: true }
           );

        return NextResponse.json(
            { message: 'Profile picture updated.', teacherProfilePic: updatedTeacher.profilePicture },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { message: 'Server error.', error: error.message },
            { status: 500 }
        );
    }
}
