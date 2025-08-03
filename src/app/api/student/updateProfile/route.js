import {Student} from '@/src/model/student'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await dbConnect()

    try {
        const { profilePicture } = await request.json();
        if (!profilePicture) {
            return ApiResponse(400, { message: "profile picture required" });
        }

        const studentId = request.student?._id;
        if (!studentId) {
            return ApiResponse(401, { message: 'Unauthorized.' });
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            { profilePicture },
            { new: true }
        );

        if (!updatedStudent) {
            return ApiResponse(404, { message: 'Student not found.' });
        }

        return ApiResponse(200, { message: 'Profile picture updated.', student: updatedStudent });
    } catch (error) {
        return ApiResponse(500, { message: 'Server error.', error: error.message });
    }
}