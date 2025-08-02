import {Admin} from '@/src/model/admin'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await dbConnect()

    try {
        const {password} = await request.json()
        if (!password) {
            return ApiResponse({ status: 400, message: 'Password is required' })
        }

        const adminId = request.admin?._id
        if (!adminId) {
            return ApiResponse({ status: 401, message: 'Unauthorized' })
        }

        const admin = await Admin.findById(adminId)
        if (!admin) {
            return ApiResponse({ status: 404, message: 'Admin not found' })
        }

        admin.password = password
        await admin.save()

        return ApiResponse({ status: 200, message: 'Password updated successfully' })
    } catch (error) {
        return ApiResponse({ status: 500, message: 'Internal server error', error: error.message })
    }
}