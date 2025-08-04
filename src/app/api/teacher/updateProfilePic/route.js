import Teacher from '@/src/model/teacher'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await connectDB()

    try {
        const { profilePicture } = await request.json();
        if (!profilePicture) {
            return ApiResponse(400, { message: "profile picture required" });
        }

        const teacherId = request.teacher?._id;
        if (!teacherId) {
            return ApiResponse(401, { message: 'Unauthorized.' });
        }

        const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { profilePicture },
            { new: true }
        );

        if (!updatedTeacher) {
            return ApiResponse(404, { message: 'Teacher not found.' });
        }

        return ApiResponse(200, { message: 'Profile picture updated.', teacher: updatedTeacher });
    } catch (error) {
        return ApiResponse(500, { message: 'Server error.', error: error.message });
    }
}