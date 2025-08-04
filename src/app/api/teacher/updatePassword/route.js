import { NextResponse } from 'next/server'
import Teacher from '@/src/model/teacher.model.js'
import connectDB from '@/src/lib/dbConnect'

export async function PATCH(request) {
    await connectDB()

    try {
        const { password , teacherId } = await request.json()
        if (!password || !teacherId) {
            return NextResponse.json({ message: 'Password is required' }, { status: 400 })
        }

                const teacher = await Teacher.findOne({ teacherId });
                if (!teacher) {
                    return NextResponse.json({
                        success: false,
                        message: "Invalid TeacherId"
                    }, { status: 401 });
                }
        
                const updatedTeacher = await Teacher.findOneAndUpdate(
                    teacher,
                    { password },
                    { new: true }
                );
        
                if (!updatedTeacher) {
                    return NextResponse.json(
                        { success: false, message: "Teacher not found." },
                        { status: 404 }
                    );
                }

        teacher.password = password
        await teacher.save()

        return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 })
    }
}
