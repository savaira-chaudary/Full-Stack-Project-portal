import {Admin} from '@/src/model/admin'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
    await dbConnect()

    try {
        const { profilePicture } = await request.json();
        if (!profilePicture) {
            return ApiResponse(400, { message: 'Profile picture is required.' });
        }

        const adminId = request.admin?._id;
        if (!adminId) {
            return ApiResponse(401, { message: 'Unauthorized.' });
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { profilePicture },
            { new: true }
        );

        if (!updatedAdmin) {
            return ApiResponse(404, { message: 'Admin not found.' });
        }

        return ApiResponse(200, { message: 'Profile picture updated.', admin: updatedAdmin });
    } catch (error) {
        return ApiResponse(500, { message: 'Server error.', error: error.message });
    }
}