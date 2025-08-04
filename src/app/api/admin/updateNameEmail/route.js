import Admin from '@/src/model/admin.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server';

export async function PATCH(request) {
    
await connectDB()
  
try {
    const { email, fullName } = await request.json();
            if (!email || !fullName) {
                return NextResponse.json({
                    success: false,
                    message: "Please provide both email and password"
                }, { status: 400 });
            }
    
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Admin not found"
            }, { status: 404 });
        }
     
        const updatedAdmin = await Admin.findOneAndUpdate(
              admin,
              { email },
              { fullName},
              { new: true }
            );
        
            if (!updatedAdmin) {
              return NextResponse.json(
                { success: false, message: 'Admin not found.' },
                { status: 404 }
              );
            }

        admin.fullName = fullName;
        admin.email = email
        await admin.save();
    
        return NextResponse.json({
            success: true,
            message: "Admin details updated successfully",
            data: {
                email: admin.email,
                fullName: admin.fullName
            }
        }, { status: 200 });
} catch (error) {
    return NextResponse.json({
        success: false,
        message: "An error occurred while updating admin details",
        error: error.message
    }, { status: 500 });
}

}