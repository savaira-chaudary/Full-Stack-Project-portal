import {Teacher} from '@/src/model/teacher'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function DELETE(request) {
    
    await dbConnect()
   try {
    const {password} = await request.json()
    if (!password) {
            return ApiResponse(400, { message: 'Password is required.' });
        }

        const teacherId  = request.teacher?._id;
        if (!teacherId) {
            return ApiResponse(400, { message: 'Teacher ID is required.' });
        }

        const deletedTeacher = await Teacher.findByIdAndDelete(teacherId);
        if (!deletedTeacher) {
            return ApiResponse(404, { message: 'Teacher not found.' });
        }

        return ApiResponse(200, { message: 'Teacher deleted successfully.' });
   } catch (error) {
    return ApiResponse(500, { message: 'Failed to delete Teacher.', error: error.message });
   }
}