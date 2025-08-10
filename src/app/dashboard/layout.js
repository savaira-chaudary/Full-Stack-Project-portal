"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logoutAdmin", { method: "POST" });
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen text-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex-1 space-y-4">
          <Link
            href="/dashboard/admin/profile"
            className="block hover:text-gray-300"
          >
            Admin Profile
          </Link>
          <Link
            href="/dashboard/admin/students"
            className="block hover:text-gray-300"
          >
            Students Details
          </Link>
          <Link
            href="/dashboard/admin/teachers"
            className="block hover:text-gray-300"
          >
            Teachers Details
          </Link>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-6 w-full px-4 py-2 bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}
