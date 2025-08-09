"use client";
import { useRouter } from "next/navigation";

export default function TeacherDashboard() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/teacher/logoutTeacher", { method: "POST" });
     localStorage.clear();
  sessionStorage.clear();
    router.replace("/login");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Teacher Dashboard</h1>
      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}

