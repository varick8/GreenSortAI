'use client';

import { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';
import Loading from '@/components/Loading';

// Define the Prediction type based on Teachable Machine's output structure
interface Prediction {
  className: string;
  probability: number;
}

export default function ScanSampah() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
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
      setError(null);
    } catch (error) {
      console.error("Error loading model:", error);
      setError("Failed to load the model. Please check your model URL and try again.");
      setIsLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      const file = e.target.files?.[0];
      if (!file || !model) return;

      setPrediction(null);
      setError(null);

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);

      await img.decode();

      const predictions = await model.predict(img);
      setPrediction(predictions as Prediction[]);

      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try another image.");
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Klasifikasi Sampah</h1>

        {error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload file gambar sampah dengan format .jpg, .jpeg, dan .png
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            {prediction && prediction.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3">Hasil Prediksi:</h2>
                {prediction.map((pred, i) => (
                  <div 
                    key={i} 
                    className="bg-gray-50 p-3 rounded-md mb-2 flex justify-between items-center"
                  >
                    <span className="font-medium">{pred.className}</span>
                    <span className="text-gray-600">
                      {(pred.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}