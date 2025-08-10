"use client";
import Link from "next/link";

export default function TeachersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Teachers Management</h1>
      <div className="space-y-4">
        <Link href="/dashboard/admin/teachers/register" className="block bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register teacher
        </Link>
        <Link href="/dashboard/admin/teachers/update" className="block bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Update teacher
        </Link>
        <Link href="/dashboard/admin/teachers/delete" className="block bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600">
          Delete teacher
        </Link>
      </div>
    </div>
  );
}