"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterStudent() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    rollno: "",
    address: "",
    phone: ""
  });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/student/registerStudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      alert("Student registered successfully!");
      router.push("/dashboard/admin/students");
    } else {
      alert(data.message || "Error registering student.");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-black">Register Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md text-black">
        {Object.keys(form).map((field) => (
          <input
            key={field}
            type={field === "phone" ? "number" : "text"}
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={form[field]}
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Register
        </button>
      </form>
    </div>
  );
}
