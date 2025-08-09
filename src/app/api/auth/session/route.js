import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const cookies = req.cookies;
  let role = null;

  try {
    if (cookies.get("admin_session")) {
      const token = cookies.get("admin_session").value;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      role = decoded.role;
    } else if (cookies.get("teacher_session")) {
      const token = cookies.get("teacher_session").value;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      role = decoded.role;
    } else if (cookies.get("student_session")) {
      const token = cookies.get("student_session").value;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      role = decoded.role;
    }
  } catch (err) {
    // If token invalid/expired, role stays null
    console.error("Invalid or expired token:", err.message);
  }

  return NextResponse.json({ role });
}
