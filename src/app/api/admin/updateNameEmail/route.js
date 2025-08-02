import {Admin} from '@/src/model/admin'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function PATCH(request) {
    
await dbConnect()
  
try {
    const { email, fullName } = await request.json();
            if (!email || !fullName) {
                return ApiResponse.json({
                    success: false,
                    message: "Please provide both email and password"
                }, { status: 400 });
            }
    
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return ApiResponse.json({
                success: false,
                message: "Admin not found"
            }, { status: 404 });
        }
    
        admin.fullName = fullName;
        await admin.save();
    
        return ApiResponse.json({
            success: true,
            message: "Admin details updated successfully",
            data: {
                email: admin.email,
                fullName: admin.fullName
            }
        }, { status: 200 });
} catch (error) {
    return ApiResponse.json({
        success: false,
        message: "An error occurred while updating admin details",
        error: error.message
    }, { status: 500 });
}

}