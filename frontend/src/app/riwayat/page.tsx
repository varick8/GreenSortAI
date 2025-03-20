"use client";

import { useState, useEffect } from "react";

export default function Riwayat() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500); // Simulasi loading selama 1.5 detik
    }, []);

    if (loading) {
        return <p className="text-center mt-10 text-lg">Loading...</p>;
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-3xl font-bold text-black">Riwayat</h1>
            <p className="text-lg font-semibold text-blue-900 mt-2">File yang diproses</p>

            <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse border border-black bg-white">
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="border border-black px-4 py-2">Tanggal</th>
                            <th className="border border-black px-4 py-2">Waktu</th>
                            <th className="border border-black px-4 py-2">Tipe</th>
                            <th className="border border-black px-4 py-2">Rekomendasi</th>
                            <th className="border border-black px-4 py-2">Gambar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="bg-gray-300 text-black">
                            <td className="border border-black px-4 py-2">Lorem Ipsum</td>
                            <td className="border border-black px-4 py-2">Lorem Ipsum</td>
                            <td className="border border-black px-4 py-2">Lorem Ipsum</td>
                            <td className="border border-black px-4 py-2 font-bold">Lorem Ipsum</td>
                            <td className="border border-black px-4 py-2 text-center">
                                <img src="https://via.placeholder.com/30" alt="Icon" className="inline-block" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
