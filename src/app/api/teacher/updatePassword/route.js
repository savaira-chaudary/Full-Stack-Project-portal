import {Teacher} from '@/src/model/teacher'
import {connectDB} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await connectDB()

    try {
        const {password} = await request.json()
        if (!password) {
            return ApiResponse({ status: 400, message: 'Password is required' })
        }

        const teacherId = request.Teacher?._id
        if (!teacherId) {
            return ApiResponse({ status: 401, message: 'Unauthorized' })
        }

        const teacher = await Teacher.findById(teacherId)
        if (!teacher) {
            return ApiResponse({ status: 404, message: 'Teacher not found' })
        }

        teacher.password = password
        await teacher.save()

        return ApiResponse({ status: 200, message: 'Password updated successfully' })
    } catch (error) {
        return ApiResponse({ status: 500, message: 'Internal server error', error: error.message })
    }
}