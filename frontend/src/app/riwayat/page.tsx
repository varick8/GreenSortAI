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
    const [windowWidth, setWindowWidth] = useState(0);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    
    // Set records per page based on screen size
    const getRecordsPerPage = () => {
        return windowWidth < 1024 ? 6 : 3; // 6 for sm/md, 3 for lg and above
    };

    useEffect(() => {
        // Initialize window width
        setWindowWidth(window.innerWidth);
        
        // Set up resize listener
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            // Reset to page 1 when screen size changes to avoid pagination issues
            setCurrentPage(1);
        };
        
        window.addEventListener('resize', handleResize);
        
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
        
        // Clean up event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
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

    // Pagination logic with dynamic records per page
    const recordsPerPage = getRecordsPerPage();
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
        <div className="p-4 md:p-6 lg:p-4 flex flex-col items-center justify-center bg-white">
            <div className="w-full max-w-full md:max-w-6xl px-2 md:px-6 lg:px-4 py-4">
                <h1 className="text-2xl md:text-3xl lg:text-2xl font-bold text-black">Riwayat</h1>
                <p className="text-base md:text-lg lg:text-base font-semibold text-blue-900 mt-2">
                    File yang diproses 
                </p>

                {/* Table container with horizontal scroll for all screen sizes */}
                <div className="w-full overflow-x-auto mt-4 pb-4">
                    <table className="w-full min-w-max border-collapse border border-black bg-white">
                        <thead>
                            <tr className="bg-white text-black">
                                <th className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-sm md:text-base lg:text-sm">Tanggal</th>
                                <th className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-sm md:text-base lg:text-sm">Waktu</th>
                                <th className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-sm md:text-base lg:text-sm">Tipe</th>
                                <th className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-sm md:text-base lg:text-sm">Rekomendasi</th>
                                <th className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-sm md:text-base lg:text-sm">Gambar</th>
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
                                            <td className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-center text-sm md:text-base lg:text-sm">{date}</td>
                                            <td className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-center text-sm md:text-base lg:text-sm">{time}</td>
                                            <td className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-center text-sm md:text-base lg:text-sm">{record.type}</td>
                                            <td className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-justify text-sm md:text-base lg:text-sm md:min-w-[300px] lg:min-w-[400px]">{record.recommendation}</td>
                                            <td className="border border-black px-2 md:px-4 lg:px-3 py-2 md:py-3 lg:py-2 text-center">
                                                <img
                                                    src={`http://localhost:8080/api/trash/image/${record.image}`}
                                                    alt="Trash"
                                                    className="inline-block w-10 h-10 md:w-16 md:h-16 lg:w-12 lg:h-12 object-cover"
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="border border-black px-4 py-2 md:py-3 lg:py-2 text-center text-sm md:text-base lg:text-sm">
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls - smaller for desktop */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-4 space-x-2 md:space-x-4 lg:space-x-3">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="px-3 py-1 md:px-5 md:py-2 lg:px-4 lg:py-1.5 bg-gray-300 text-black rounded disabled:opacity-50 text-sm md:text-base lg:text-sm"
                        >
                            Previous
                        </button>
                        <span className="text-black font-semibold text-sm md:text-base lg:text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 md:px-5 md:py-2 lg:px-4 lg:py-1.5 bg-gray-300 text-black rounded disabled:opacity-50 text-sm md:text-base lg:text-sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}