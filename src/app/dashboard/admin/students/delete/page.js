"use client";
import { useState } from "react";

export default function DeleteStudentPage() {
  const [rollno, setRollno] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/student/deleteStudent", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollno }),
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error deleting student.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Delete Student
        </h2>

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Roll No
            </label>
            <input
              type="text"
              value={rollno}
              onChange={(e) => setRollno(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
              placeholder="Enter student's roll no"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? "Deleting..." : "Delete Student"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes("success")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
