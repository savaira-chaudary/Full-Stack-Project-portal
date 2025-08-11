"use client";
import { useState } from "react";

export default function UpdateEmailNamePage() {
  const [teacherId, setTeacherId] = useState("");
  const [email, setNewEmail] = useState("");
  const [username, setNewUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/teacher/updateNameEmail", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherId,
          email,
          username
        }),
      });

      const data = await res.json();
      setMessage(data.message || "Something happened.");
    } catch {
      setMessage("Error updating email & username.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Update Email & Username</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="teacherId"
          placeholder="Teacher Id"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="email"
          placeholder="New Email"
          value={email}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setNewUsername(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Update Email & Username
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
