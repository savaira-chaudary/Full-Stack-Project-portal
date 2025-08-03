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
        const response = ApiResponse.json({
            success: true,
            message: "Student logged out successfully"
        });

        // Remove the admin session cookie
        response.headers.set('Set-Cookie', 'adminToken=; Path=/; HttpOnly; Max-Age=0; SameSite=Strict');

        return response;
        } catch (error) {
        return ApiResponse.json({
            success: false,
            message: "Something went wrong during logout",
            error: error.message
        }, { status: 500 });
        }
} 