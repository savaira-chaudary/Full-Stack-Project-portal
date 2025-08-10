"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterTeacher() {
  const [form, setForm] = useState({
    email: "",
    password: "", 
    fullName: "", 
    phone: "", 
    address: "", 
    subjectSpecialization: "", 
    qualification: "" , 
    teacherId: ""
 });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/student/registerTeacher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) {
      alert("Teacher registered successfully!");
      router.push("/dashboard/admin/teachers");
    } else {
      alert(data.message || "Error registering teacher.");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4 text-black">Register Teacher</h1>
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
