import Student from '@/src/model/student'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function DELETE(request) {
    
    await connectDB()
   try {
    const {password} = await request.json()
    if (!password) {
            return ApiResponse(400, { message: 'Password is required.' });
        }

        const studentId  = request.student?._id;
        if (!studentId) {
            return ApiResponse(400, { message: 'Student ID is required.' });
        }

        const deleteStudent = await Student.findByIdAndDelete(studentId);
        if (!deleteStudent) {
            return ApiResponse(404, { message: 'Student not found.' });
        }

        return ApiResponse(200, { message: 'Student deleted successfully.' });
   } catch (error) {
    return ApiResponse(500, { message: 'Failed to delete Student.', error: error.message });
   }
}