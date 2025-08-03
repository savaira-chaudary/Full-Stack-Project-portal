import {Admin} from '@/src/model/admin'
import {dbConnect} from '@/src/lib/dbConnect'
import {ApiResponse} from '@/src/utils/ApiResponse'

export async function POST(request) {
    
    await dbConnect()

    try {
        const { email, password, name } = await request.json();

        if (!email || !password || !name) {
            return ApiResponse({ status: 400, message: 'All fields are required.' });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return ApiResponse({ status: 409, message: 'Admin already exists.' });
        }

        const newAdmin = new Admin({ email, password, name });
        await newAdmin.save();

        return ApiResponse({ status: 201, 
            message: 'Admin registered successfully.', data: { id: newAdmin._id, email, name } });

    } catch (error) {
        return ApiResponse.json({
            success: false,
            message: "Something went wrong while registeration",
            error: error.message
        }, { status: 500 });
    }
}