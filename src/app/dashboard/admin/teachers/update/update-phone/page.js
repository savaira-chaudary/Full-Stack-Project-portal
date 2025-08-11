"use client";

import { useState } from "react";

export default function UpdatePhonePage() {
  const [teacherId, setTeacherId] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/teacher/updatePhone", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, phone }),
      });

      const data = await res.json();
      setMessage(data.message || "Something happened.");
    } catch (err) {
      setMessage("Error updating phone.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Update teacher Phone</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Teacher Id"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="New Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Update Phone
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}
