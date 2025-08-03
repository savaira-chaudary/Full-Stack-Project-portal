import {Teacher} from '@/src/model/teacher'
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
    
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return ApiResponse.json({
                success: false,
                message: "Teacher not found"
            }, { status: 404 });
        }
    
        teacher.fullName = fullName;
        await teacher.save();
    
        return ApiResponse.json({
            success: true,
            message: "Teacher details updated successfully",
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