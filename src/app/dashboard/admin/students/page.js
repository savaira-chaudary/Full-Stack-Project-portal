"use client";
import Link from "next/link";

export default function StudentsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Students Management</h1>
      <div className="space-y-4">
        <Link href="/dashboard/admin/students/register" className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register Student
        </Link>
        <Link href="/dashboard/admin/students/update" className="block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Update Student
        </Link>
        <Link href="/dashboard/admin/students/delete" className="block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete Student
        </Link>
      </div>
    </div>
  );
}
