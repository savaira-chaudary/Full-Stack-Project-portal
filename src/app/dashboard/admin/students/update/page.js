"use client";

import Link from "next/link";

export default function UpdateStudentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Student Details</h1>
      <p className="mb-6 text-gray-600">
        Select the detail you want to update:
      </p>

      <ul className="space-y-3">
        <li>
          <Link
            href="/dashboard/admin/students/update/update-address"
            className="block bg-white shadow hover:shadow-lg rounded-lg p-4 text-blue-600 font-medium transition"
          >
            Update Address
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/admin/students/update/update-phone"
            className="block bg-white shadow hover:shadow-lg rounded-lg p-4 text-blue-600 font-medium transition"
          >
            Update Phone
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/admin/students/update/update-email-name"
            className="block bg-white shadow hover:shadow-lg rounded-lg p-4 text-blue-600 font-medium transition"
          >
            Update Email & Username
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/admin/students/update/update-password"
            className="block bg-white shadow hover:shadow-lg rounded-lg p-4 text-blue-600 font-medium transition"
          >
            Update Password
          </Link>
        </li>
        <li>
          <Link
            href="/dashboard/admin/students/update/update-profile-picture"
            className="block bg-white shadow hover:shadow-lg rounded-lg p-4 text-blue-600 font-medium transition"
          >
            Update Profile Picture
          </Link>
        </li>
      </ul>
    </div>
  );
}