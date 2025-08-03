import Student from '@/src/model/student'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await connectDB()

    try {
        const {password} = await request.json()
        if (!password) {
            return ApiResponse({ status: 400, message: 'Password is required' })
        }

        const studentId = request.student?._id
        if (!studentId) {
            return ApiResponse({ status: 401, message: 'Unauthorized' })
        }

        const student = await Student.findById(studentId)
        if (!student) {
            return ApiResponse({ status: 404, message: 'Student not found' })
        }

        student.password = password
        await student.save()

        return ApiResponse({ status: 200, message: 'Password updated successfully' })
    } catch (error) {
        return ApiResponse({ status: 500, message: 'Internal server error', error: error.message })
    }
}