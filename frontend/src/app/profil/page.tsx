"use client";

import { useState, useEffect } from "react";

export default function Profile() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({
        id: "12345",
        email: "Email Pengguna",
        firstName: "Nama Depan Pengguna",
        lastName: "Nama Belakang Pengguna",
        pictureUrl: "https://via.placeholder.com/150",
        role: "user",
        createdAt: "2024-03-21T12:00:00Z",
    });

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="flex items-start gap-10">
                {/* Kartu Profil */}
                <div
                    className="flex flex-col justify-center items-center border rounded-lg bg-white"
                    style={{
                        width: "336px",
                        height: "403px",
                        flexShrink: 0,
                        aspectRatio: "336/403",
                        borderRadius: "8px",
                        border: "1px solid #CCDFFF",
                        background: "#FFF",
                    }}
                >
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-16 h-16 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold mt-3 text-black">Nama Pengguna</h2>
                    <p className="text-blue-600 text-sm">{user.email}</p>
                </div>

                {/* Form Input */}
                <div className="flex flex-col gap-4">
                    <div
                        className="inline-flex flex-col items-start"
                        style={{ gap: "var(--sds-size-space-200)" }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Nama Depan</label>
                        <input
                            type="text"
                            value={user.firstName}
                            className="w-60 px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            readOnly
                        />
                    </div>

                    <div
                        className="inline-flex flex-col items-start"
                        style={{ gap: "var(--sds-size-space-200)" }}
                    >
                        <label className="block text-sm font-medium text-gray-700">Nama Belakang</label>
                        <input
                            type="text"
                            value={user.lastName}
                            className="w-60 px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
   