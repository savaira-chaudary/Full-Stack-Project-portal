import Student from '@/src/model/student'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function POST(request) {
     await connectDB()

    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return ApiResponse.json({
                success: false,
                message: "Please provide both email and password"
            }, { status: 400 });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return ApiResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }

        const isMatch = await student.isPasswordCorrect(password);
        if (!isMatch) {
            return ApiResponse.json({
                success: false,
                message: "Invalid email or password"
            }, { status: 401 });
        }
        
        return ApiResponse.json({
            success: true,
            message: "Login successful",
            student: {
                id: student._id,
                email: student.email,
                name: student.name
            }
        }, { status: 200 });

    } catch (error) {
        return ApiResponse.json({
            success: false,
            message: "Something went wrong",
            error: error.message
        }, { status: 500 });
    }
}