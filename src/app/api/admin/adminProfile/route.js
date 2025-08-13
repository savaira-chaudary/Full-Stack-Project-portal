import Admin from '@/src/model/admin.model.js'
import connectDB from '@/src/lib/dbConnect'
import { NextResponse } from 'next/server';

export async function GET(request) {
    await connectDB()
    try {
        // Get cookie from request
        const cookieHeader = request.headers.get('cookie') || '';
        const tokenMatch = cookieHeader.match(/admin_session=([^;]+)/);
        const sessionToken = tokenMatch ? tokenMatch[1] : null;

        if (!sessionToken) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: No session token found in cookies." },
                { status: 401 }
            );
        }

        // Find admin with this session token
        const admin = await Admin.findOne({ 'sessions.token': sessionToken });

        if (!admin) {
            return NextResponse.json(
                { success: false, message: "Unauthorized: Invalid session." },
                { status: 401 }
            );
        }
        return NextResponse.json({ success: true, admin });
    } catch (error) {
          return NextResponse.json({ success: false, message: err.message }, { status: 500 });
    }
}