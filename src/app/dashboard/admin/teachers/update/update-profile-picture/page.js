"use client";
import { useState } from "react";

export default function UpdateProfilePicturePage() {
  const [teacherId, setTeacherId] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/teacher/updateProfilePic", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, profilePicture }),
      });
      const data = await res.json();
      setMessage(data.message || "Something happened.");
    } catch {
      setMessage("Error updating profile picture.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-bold mb-4">Update Profile Picture</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="TeacherId"
          value={teacherId}
          onChange={(e) => setTeacherId(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className="w-full border rounded p-2"
          required
        />
        <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Update Profile Picture
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
