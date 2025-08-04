import Teacher from '@/src/model/teacher'
import connectDB from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function POST(request) {
    
    await connectDB()

    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return ApiResponse({ status: 400, message: 'All fields are required.' });
        }

        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return ApiResponse({ status: 409, message: 'Teacher already exists.' });
        }

        const newTeacher = new Teacher({ email, password, name });
        await newTeacher.save();

        return ApiResponse({ status: 201, 
            message: 'Teacher registered successfully.', data: { id: newTeacher._id, email, name } });

    } catch (error) {
        return ApiResponse.json({
            success: false,
            message: "Something went wrong while registeration",
            error: error.message
        }, { status: 500 });
    }
}