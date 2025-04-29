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
        <div className="flex items-center justify-center bg-white min-h-screen">
            <div className="flex flex-col md:flex-col lg:flex-row items-center gap-8 md:gap-20 lg:gap-10 w-full max-w-md md:max-w-2xl lg:max-w-4xl px-4">
                {/* Profile Card */}
                <div 
                    className="flex flex-col justify-center items-center border rounded-lg bg-white p-5 md:p-8 lg:p-8 shadow-lg w-full md:w-96 lg:w-96"
                    style={{
                        borderRadius: "8px",
                        border: "1px solid #CCDFFF",
                    }}
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 lg:w-36 lg:h-36 bg-gray-100 rounded-full flex items-center justify-center border">
                        {user.picture ? (
                            <Image
                                src={user.picture}
                                alt="User Profile"
                                width={160} 
                                height={160}
                                className="rounded-full w-full h-full object-cover"
                            />
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-16 h-16 md:w-20 md:h-20 lg:w-20 lg:h-20 text-gray-400"
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
                    <h2 className="text-xl md:text-2xl lg:text-2xl font-semibold mt-4 text-black">
                        {user.name || "Nama Pengguna"}
                    </h2>
                    <p className="text-base md:text-lg lg:text-lg text-blue-600">{user.email}</p>
                </div>

                {/* Input Form */}
                <div className="flex flex-col gap-5 md:gap-6 lg:gap-6 w-full">
                    <div className="w-full">
                        <label className="block text-base md:text-lg lg:text-lg font-semibold text-gray-700">
                            Nama Depan
                        </label>
                        <input
                            type="text"
                            value={user.fname || ""}
                            className="w-full text-black px-4 py-3 md:px-5 md:py-4 lg:px-4 lg:py-3 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-base md:text-lg lg:text-lg"
                            readOnly
                        />
                    </div>

                    <div className="w-full">
                        <label className="block text-base md:text-lg lg:text-lg font-semibold text-gray-700">
                            Nama Belakang
                        </label>
                        <input
                            type="text"
                            value={user.lname || ""}
                            className="w-full text-black px-4 py-3 md:px-5 md:py-4 lg:px-4 lg:py-3 mt-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-base md:text-lg lg:text-lg"
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}