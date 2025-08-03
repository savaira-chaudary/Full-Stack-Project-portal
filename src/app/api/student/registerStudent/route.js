import {Student} from '@/src/model/student'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function POST(request) {
    
    await dbConnect()

    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return ApiResponse({ status: 400, message: 'All fields are required.' });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return ApiResponse({ status: 409, message: 'Student already exists.' });
        }

        const newStudent = new Student({ email, password, name });
        await newStudent.save();

        return ApiResponse({ status: 201, 
            message: 'Student registered successfully.', data: { id: newStudent._id, email, name } });

    } catch (error) {
        return ApiResponse.json({
            success: false,
            message: "Something went wrong while registeration",
            error: error.message
        }, { status: 500 });
    }
}