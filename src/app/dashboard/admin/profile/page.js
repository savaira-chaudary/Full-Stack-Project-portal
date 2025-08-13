"use client";
import { useEffect, useState } from 'react';

export default function AdminProfile() {
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        fetch('/api/admin/adminProfile')
            .then(res => res.json())
            .then(data => setAdmin(data.admin))
            .catch(err => console.error(err));
    }, []);

    if (!admin) return <p>Loading...</p>;

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md bg-white rounded-xl shadow-lg p-6'>
            <h1 className='text-gray-700 text-5xl font-bold'>Admin Profile</h1>
            <h1 className='text-2xl font-bold text-gray-500'>FullName:</h1>
            <h2 className='text-blue-600 font-semibold'>{admin.fullName}</h2>
            <p className='text-2xl font-bold text-gray-500'>Email Address:</p>
            <p className='text-blue-600 font-semibold'>{admin.email}</p>
            <p className='text-2xl font-bold text-gray-500'>Role:</p>
            <p className='text-blue-600 font-semibold'>{admin.role}</p>
            {admin.profilePicture && <img src={admin.profilePicture} alt="Profile" />}
            </div>
        </div>
    );
}
