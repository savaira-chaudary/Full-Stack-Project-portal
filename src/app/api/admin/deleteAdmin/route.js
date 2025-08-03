import Admin from '@/src/model/admin'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function DELETE(request) {
    
    await connectDB()
   try {
    const {password} = await request.json()
    if (!password) {
            return ApiResponse(400, { message: 'Password is required.' });
        }

        const adminId  = request.admin?._id;
        if (!adminId) {
            return ApiResponse(400, { message: 'Admin ID is required.' });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(adminId);
        if (!deletedAdmin) {
            return ApiResponse(404, { message: 'Admin not found.' });
        }

        return ApiResponse(200, { message: 'Admin deleted successfully.' });
   } catch (error) {
    return ApiResponse(500, { message: 'Failed to delete admin.', error: error.message });
   }
}