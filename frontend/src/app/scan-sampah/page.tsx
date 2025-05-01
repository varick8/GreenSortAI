'use client';

import { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import Loading from '@/components/Loading';
import { Upload, X } from 'lucide-react';

interface Prediction {
    className: string;
    probability: number;
}

export default function ScanSampah() {
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [prediction, setPrediction] = useState<Prediction[] | null>(null);
    const [previewURL, setPreviewURL] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const modelURL = process.env.NEXT_PUBLIC_MODEL_URL;

    useEffect(() => {
        loadModel();
    }, []);

    async function loadModel() {
        if (!modelURL) {
            setError("Model URL is missing. Please check your environment variables.");
            setIsLoading(false);
            return;
        }

        try {
            const modelJson = `${modelURL}model.json`;
            const metadataJson = `${modelURL}metadata.json`;
            const loadedModel = await tmImage.load(modelJson, metadataJson);
            setModel(loadedModel);
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading model:", error);
            setError("Gagal memuat model.");
            setIsLoading(false);
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
            setPreviewURL(imgURL);

            await img.decode();
            const predictions = await model.predict(img);
            const sorted = predictions.sort((a, b) => b.probability - a.probability);
            setPrediction(sorted);
            setShowModal(true);
        } catch (error) {
            console.error("Error processing image:", error);
            setError("Gagal memproses gambar.");
        }
    }

    if (isLoading) return <Loading />;

    return (
        <main className="min-h-screen flex items-center justify-center bg-white p-10">
            <div
                style={{
                    display: 'flex',
                    width: '1111px',
                    height: '507px',
                    padding: '40px',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexShrink: 0,
                    borderRadius: '8px',
                    border: '1px dashed #99C0FF',
                    background: 'rgba(0, 0, 0, 0.25)',
                }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-xl font-bold text-[#090E24]">Scan Sampah</h1>
                    <p className="text-sm text-[#090E24] mt-2">
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

                {/* Modal Pop-up */}
                {showModal && prediction && previewURL && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative flex gap-6">
                            {/* Tombol Tutup */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                <X size={24} />
                            </button>

                            {/* Gambar */}
                            <div className="w-1/2">
                                <img
                                    src={previewURL}
                                    alt="Uploaded"
                                    className="rounded-md w-full h-auto object-contain"
                                />
                            </div>

                            {/* Hasil */}
                            <div className="w-1/2 flex flex-col justify-start">
                                <h2 className="text-xl font-semibold text-black mb-3">Hasil Prediksi</h2>

                                <div className="bg-green-100 border border-green-300 p-4 rounded mb-4">
                                    <p className="text-black font-bold">{prediction[0].className}</p>
                                </div>

                                {/* Rekomendasi Pengolahan */}
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
                                    <h3 className="font-medium text-blue-700 mb-1">Rekomendasi Pengolahan:</h3>
                                    <p className="text-sm text-blue-800">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Rekomendasi pengolahan sesuai jenis sampah ini.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
