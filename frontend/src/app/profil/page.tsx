"use client";

import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Define a custom interface for the decoded token
interface User {
    name?: string;
    picture?: string;
    email?: string;
    fname?: string;
    lname?: string;
}

export default function Profile() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const cookies = document.cookie;
                const parsedCookies = parse(cookies);
                const token = parsedCookies.auth_token;

                if (!token) {
                    await router.push("/");
                    return;
                }

                const decodedToken = jwtDecode(token) as User;
                setUser({
                    name: decodedToken.name,
                    picture: decodedToken.picture,
                    email: decodedToken.email,
                    fname: decodedToken.fname,
                    lname: decodedToken.lname,
                });
            } catch (error) {
                console.error("Error initializing user:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, [router]);

    if (loading) return <Loading />;
    if (!user) return <Loading />;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden" style={{ paddingTop: "70px" }}>
            <div className="flex flex-col md:flex-row items-center gap-10">
                {/* Profile Card */}
                <div 
                    className="flex flex-col justify-center items-center border rounded-lg bg-white p-6 shadow-lg"
                    style={{
                        width: "336px",
                        height: "403px",
                        borderRadius: "8px",
                        border: "1px solid #CCDFFF",
                    }}
                >
                    <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center border">
                        {user.picture ? (
                            <Image
                                src={user.picture}
                                alt="User Profile"
                                width={128} 
                                height={128}
                                className="rounded-full"
                            />
                        ) : (
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
                        )}
                    </div>
                    <h2 className="text-lg font-semibold mt-3 text-black">
                        {user.name || "Nama Pengguna"}
                    </h2>
                    <p className="text-blue-600 text-sm">{user.email}</p>
                </div>

                {/* Input Form */}
                <div className="flex flex-col gap-4">
                    <div className="w-80">
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Depan
                        </label>
                        <input
                            type="text"
                            value={user.fname || ""}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            readOnly
                        />
                    </div>

                    <div className="w-80">
                        <label className="block text-sm font-medium text-gray-700">
                            Nama Belakang
                        </label>
                        <input
                            type="text"
                            value={user.lname || ""}
                            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}