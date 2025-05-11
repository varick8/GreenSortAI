'use client';

import { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import Loading from '@/components/Loading';
import { Upload, X } from 'lucide-react';
import { jwtDecode } from "jwt-decode";
import { parse } from 'cookie';
import Image from 'next/image';

interface Prediction {
    className: string;
    probability: number;
}

interface User {
    id: string;
}

function getRecommendation(predictionClass: string): string {
    switch (predictionClass.toLowerCase()) {
        case 'b3':
            return "Gunakan tempat sampah B3 khusus. Hindari membuang ke tempat sampah biasa.";
        case 'anorganic':
            return "Simpan untuk daur ulang atau manfaatkan kembali jika memungkinkan.";
        case 'organic':
            return "Buang ke komposter atau tempat sampah organik untuk dijadikan pupuk.";
        default:
            return "Jenis sampah tidak dikenali. Mohon periksa kembali.";
    }
}

export default function ScanSampah() {
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [prediction, setPrediction] = useState<Prediction[] | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendation, setRecommendation] = useState<string | null>(null);

    const modelURL = process.env.NEXT_PUBLIC_MODEL_URL;

    useEffect(() => {
        async function loadModelAndUser() {
            if (!modelURL) {
                setError("Model URL is missing. Please check your environment variables.");
                setIsLoading(false);
                return;
            }

            try {
                // Load model
                const modelJson = `${modelURL}model.json`;
                const metadataJson = `${modelURL}metadata.json`;
                const loadedModel = await tmImage.load(modelJson, metadataJson);
                setModel(loadedModel);
            } catch (err) {
                console.error("Error loading model:", err);
                setError("Gagal memuat model.");
            }

            try {
                // Initialize user
                const cookies = document.cookie;
                const parsedCookies = parse(cookies);
                const token = parsedCookies.auth_token;

                if (token) {
                    const decodedToken = jwtDecode(token) as User;
                    if (decodedToken?.id) {
                        setUser({ id: decodedToken.id });
                    }
                }
            } catch {
                console.warn("Token tidak valid atau tidak ditemukan, melanjutkan tanpa user login.");
            } finally {
                setIsLoading(false);
            }
        }

        loadModelAndUser();
    }, [modelURL]);

    async function submitPrediction(
        userId: string,
        predictionClass: string,
        recommendation: string,
        imageFile: File
    ) {
        const formData = new FormData();
        formData.append('type', predictionClass);
        formData.append('recommendation', recommendation);
        formData.append('image', imageFile);

        try {
            const response = await fetch(`https://greensortai.up.railway.app/api/trash/scan/${userId}`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal mengirim data ke server.");
            }
        } catch (err) {
            console.error("Error saat mengirim data:", err);
        }
    }

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file || !model) return;

        setPrediction(null);
        setError(null);

        try {
            const img = document.createElement('img');
            const imgURL = URL.createObjectURL(file);
            img.src = imgURL;
            await img.decode();

            const predictions = await model.predict(img);
            const sorted = predictions.sort((a, b) => b.probability - a.probability);
            const predictionClass = sorted[0].className;
            const recommendationText = getRecommendation(predictionClass);

            setPrediction(sorted);
            setRecommendation(recommendationText);
            setPreviewURL(imgURL);
            setShowModal(true);

            if (user?.id) {
                await submitPrediction(user.id, predictionClass, recommendationText, file);
            }
        } catch (err) {
            console.error("Error processing image:", err);
            setError("Gagal memproses gambar.");
        }
    }

    if (isLoading) return <Loading />;

    return (
        <main className="min-h-screen flex items-center justify-center bg-white p-4 sm:p-8 md:p-10">
            <div className="w-full max-w-4xl h-auto sm:h-[507px] p-6 sm:p-10 flex flex-col items-center justify-center rounded-lg border border-dashed border-[#99C0FF] bg-black bg-opacity-25">
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-black">Scan Sampah</h1>
                    <p className="text-sm text-black mt-2">
                        Upload file gambar sampah dengan format .jpg, .jpeg, dan .png
                    </p>
                </div>

                <label htmlFor="upload" className="cursor-pointer mb-8">
                    <div className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-md flex items-center gap-2">
                        <Upload size={18} /> Unggah File
                    </div>
                    <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </label>

                {error && (
                    <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded">
                        {error}
                    </div>
                )}

                {showModal && prediction && previewURL && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-4 relative flex flex-col md:flex-row gap-4 md:gap-6 overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setPreviewURL(null);
                                    setPrediction(null);
                                }}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                <X size={24} />
                            </button>

                            <div className="w-full md:w-1/2">
                                <div className="relative w-full h-[300px] md:h-[400px]">
                                    <Image
                                        src={previewURL}
                                        alt="Uploaded"
                                        fill
                                        className="object-contain rounded-md"
                                        sizes="(max-width: 768px) 100vw, 700px"
                                    />
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 flex flex-col justify-start">
                                <h2 className="text-xl font-semibold text-black mb-3">Hasil Prediksi</h2>
                                <div className="bg-green-100 border border-green-300 p-4 rounded mb-4">
                                    <p className="text-black font-bold">{prediction[0].className}</p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
                                    <h3 className="font-medium text-blue-700 mb-1">Rekomendasi Pengolahan:</h3>
                                    <p className="text-sm text-blue-800">{recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
