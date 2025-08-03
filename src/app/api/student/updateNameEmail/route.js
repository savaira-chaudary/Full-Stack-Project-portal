import {Student} from '@/src/model/student'
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
    
        const student = await Student.findOne({ email });
        if (!student) {
            return ApiResponse.json({
                success: false,
                message: "Student not found"
            }, { status: 404 });
        }
    
        student.fullName = fullName;
        await student.save();
    
        return ApiResponse.json({
            success: true,
            message: "Student details updated successfully",
            data: {
                email: admin.email,
                fullName: admin.fullName
            }
        }, { status: 200 });
} catch (error) {
    return ApiResponse.json({
        success: false,
        message: "An error occurred while updating Student details",
        error: error.message
    }, { status: 500 });
}

}