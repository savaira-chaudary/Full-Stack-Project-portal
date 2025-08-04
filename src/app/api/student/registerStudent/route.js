import Student from '@/src/model/student.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server'

export async function POST(request) {
    await connectDB();

    try {
        const { email, password, username ,rollno, address, phone} = await request.json();

        if (!email || !password || !username || !rollno || !address || !phone) {
            return NextResponse.json(
                { success: false, message: 'All fields are required.' },
                { status: 400 }
            );
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return NextResponse.json(
                { success: false, message: 'Student already exists.' },
                { status: 409 }
            );
        }

        const newStudent = new Student({ email, password, username , rollno, address, phone});
        await newStudent.save();

        return NextResponse.json(
            {
                success: true,
                message: 'Student registered successfully.',
                data: {
                    id: newStudent._id,
                    email: newStudent.email,
                    username: newStudent.username,
                    rollno: newStudent.rollno,
                    address: newStudent.address,
                    phone: newStudent.phone
                }
            },
            { status: 201 }
        );

    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while registration.",
                error: error.message
            },
            { status: 500 }
        );
    }
}
