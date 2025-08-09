"use client";
import { useRouter } from "next/navigation";

export default function StudentDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/student/logoutStudent", { method: "POST" });
     localStorage.clear();
  sessionStorage.clear();
    router.replace("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Student Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

