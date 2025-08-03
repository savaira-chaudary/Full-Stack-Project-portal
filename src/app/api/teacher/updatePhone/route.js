import {Teacher} from '@/src/model/teacher'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await dbConnect()

    try {
        const {password, email} = await request.json()
        if (!password || !email) {
            return ApiResponse(400, { message: "password/email is required"})
        }

        const teacherId = request.Teacher?._id;
        if (!teacherId) {
            return ApiResponse(401, { message: 'Unauthorized.' });
        }

         const updatedTeacher = await Teacher.findByIdAndUpdate(
            teacherId,
            { phone },
            { new: true }
        );

        if (!updatedTeacher) {
            return ApiResponse(404, { message: 'Teacher not found.' });
        }

        return ApiResponse(200, { message: 'Phone updated.', teacher: updatedTeacher });

    } catch (error) {
        return ApiResponse(500, { message: 'Server error.', error: error.message });
    }
}