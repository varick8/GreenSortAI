'use client'

import { useState, useEffect } from 'react';
import * as tmImage from '@teachablemachine/image';

// Define the Prediction type based on Teachable Machine's output structure
interface Prediction {
  className: string;
  probability: number;
}

export default function Home() {
  const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
  const [prediction, setPrediction] = useState<Prediction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadModel();
  }, []);

  async function loadModel() {
    try {
      const URL = "https://teachablemachine.withgoogle.com/models/Qbn8hpvYj/";
      const modelURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";
      
      const loadedModel = await tmImage.load(modelURL, metadataURL);
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

      // Clear previous predictions and errors
      setPrediction(null);
      setError(null);

      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      
      await img.decode();
      
      const predictions = await model.predict(img);
      setPrediction(predictions as Prediction[]);

      // Clean up the object URL
      URL.revokeObjectURL(img.src);
    } catch (error) {
      console.error("Error processing image:", error);
      setError("Failed to process the image. Please try another image.");
    }
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Image Classifier</h1>
        
        {isLoading ? (
          <div className="text-center py-4">
            <p>Loading model...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-4">
            {error}
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload an image
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
                <h2 className="text-lg font-semibold mb-3">Predictions:</h2>
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