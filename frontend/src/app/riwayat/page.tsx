"use client";

import Loading from "@/components/Loading";
import { useState, useEffect } from "react";
import { parse } from "cookie";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

// Define interfaces
interface User {
    id?: string;
}

interface TrashRecord {
    id: string;
    type: string;
    image: string;
    recommendation: string;
    time: string;
    user_id: string;
}

export default function Riwayat() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [trashRecords, setTrashRecords] = useState<TrashRecord[]>([]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 3; // Adjust as needed

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
                setUser({ id: decodedToken.id });

                if (decodedToken.id) {
                    fetchTrashData(decodedToken.id);
                }
            } catch (error) {
                console.error("Error initializing user:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeUser();
    }, [router]);

    const fetchTrashData = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/trash/user/${userId}`);
            const data = await response.json();
    
            if (data.statusText === "Ok") {
                const sortedRecords = data.data.sort((a: TrashRecord, b: TrashRecord) => 
                    new Date(b.time).getTime() - new Date(a.time).getTime()
                );
                setTrashRecords(sortedRecords);
            } else {
                console.error("Error fetching trash records:", data.msg);
            }
        } catch (error) {
            console.error("Error fetching trash data:", error);
        }
    };    

    // Pagination logic
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = trashRecords.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(trashRecords.length / recordsPerPage);

    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) return <Loading />;
    if (!user) return <Loading />;

    return (
        <div className="p-6 flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-6xl px-6">
                <h1 className="text-3xl font-bold text-black">Riwayat</h1>
                <p className="text-lg font-semibold text-blue-900 mt-2">File yang diproses</p>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full border-collapse border border-black bg-white">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-black px-4 py-2">Tanggal</th>
                                <th className="border border-black px-4 py-2">Waktu</th>
                                <th className="border border-black px-4 py-2">Tipe</th>
                                <th className="border border-black px-4 py-2">Rekomendasi</th>
                                <th className="border border-black px-4 py-2">Gambar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.length > 0 ? (
                                currentRecords.map((record) => {
                                    const dateTime = new Date(record.time);
                                    const date = dateTime.toLocaleDateString();
                                    const time = dateTime.toLocaleTimeString();

                                    return (
                                        <tr key={record.id} className="bg-gray-100 text-black">
                                            <td className="border border-black px-4 py-2 text-center">{date}</td>
                                            <td className="border border-black px-4 py-2 text-center">{time}</td>
                                            <td className="border border-black px-4 py-2 text-center">{record.type}</td>
                                            <td className="border border-black px-4 py-2 text-justify max-w-[500px]">{record.recommendation}</td>
                                            <td className="border border-black px-4 py-2 text-center">
                                                <img
                                                    src={`http://localhost:8080/api/trash/image/${record.image}`}
                                                    alt="Trash"
                                                    className="inline-block w-12 h-12 object-cover"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="border border-black px-4 py-2 text-center">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-black font-semibold">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-300 text-black rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
