import Admin from '@/src/model/admin.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server';

export async function DELETE(request) {
    await connectDB();
    
    try {
        const { password, email } = await request.json();

        if (!password || !email) {
            return NextResponse.json(
                { success: false, message: 'Password and email are required.' },
                { status: 400 }
            );
        }

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json(
                { success: false, message: 'Admin not found.' },
                { status: 404 }
            );
        }

        const deletedAdmin = await Admin.findOneAndDelete({ email });
        if (!deletedAdmin) {
            return NextResponse.json(
                { success: false, message: 'Failed to delete admin.' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Admin deleted successfully.' },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Failed to delete admin.', error: error.message },
            { status: 500 }
        );
    }
}
