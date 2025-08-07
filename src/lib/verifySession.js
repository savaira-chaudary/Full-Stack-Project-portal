import jwt from 'jsonwebtoken';
import Admin from '@/src/models/admin.model.js';

export async function verifySession(req) {
  const token = req.cookies?.token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin || admin.sessionToken !== token || new Date() > new Date(admin.sessionExpires)) {
      return null;
    }

    return admin;
  } catch {
    return null;
  }
}
