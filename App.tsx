
import React, { useState, useCallback } from 'react';
import { generateSpriteSheet } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import SpriteSheetDisplay from './components/SpriteSheetDisplay';
import Loader from './components/Loader';
import { GithubIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<{ file: File; base64: string } | null>(null);
  const [generatedSpriteSheet, setGeneratedSpriteSheet] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage({ file, base64: reader.result as string });
      setGeneratedSpriteSheet(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedSpriteSheet(null);

    try {
      const spriteSheetBase64 = await generateSpriteSheet(uploadedImage.base64);
      setGeneratedSpriteSheet(`data:image/png;base64,${spriteSheetBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <header className="w-full p-4 border-b border-slate-700/50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Sprite Sheet Generator
          </h1>
          <a href="https://github.com/google/labs-prototypes" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
            <GithubIcon />
          </a>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Left Column: Input */}
          <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">1. Upload Character Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} uploadedImage={uploadedImage?.base64} />
            <div className="mt-auto pt-6">
              <button
                onClick={handleGenerate}
                disabled={!uploadedImage || isLoading}
                className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader />
                    Generating...
                  </>
                ) : (
                  "2. Generate Sprite Sheet"
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col border border-slate-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">3. Result</h2>
            <div className="flex-grow flex items-center justify-center rounded-lg bg-slate-900/50 p-4 min-h-[300px] lg:min-h-0">
              {isLoading ? (
                 <div className="text-center">
                    <Loader className="w-12 h-12 mx-auto mb-4" />
                    <p className="text-lg font-medium text-slate-300">Generating your sprite sheet...</p>
                    <p className="text-sm text-slate-400">This may take a moment.</p>
                 </div>
              ) : error ? (
                <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg mb-2">Error</h3>
                  <p>{error}</p>
                </div>
              ) : generatedSpriteSheet ? (
                <SpriteSheetDisplay spriteSheet={generatedSpriteSheet} />
              ) : (
                <div className="text-center text-slate-400">
                  <p>Your generated sprite sheet will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
