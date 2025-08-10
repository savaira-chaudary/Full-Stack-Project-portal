"use client";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Students Details Card */}
        <Link href="/dashboard/admin/students">
          <div className="bg-white shadow p-6 rounded-lg cursor-pointer hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Students Details</h2>
            <p className="text-gray-500">Manage students</p>
          </div>
        </Link>

        {/* Teachers Details Card */}
        <Link href="/dashboard/admin/teachers">
          <div className="bg-white shadow p-6 rounded-lg cursor-pointer hover:shadow-lg transition">
            <h2 className="text-xl font-semibold">Teachers Details</h2>
            <p className="text-gray-500">Manage teachers</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

