
import React from 'react';
import { DownloadIcon } from './icons';

interface SpriteSheetDisplayProps {
  spriteSheet: string;
}

const SpriteSheetDisplay: React.FC<SpriteSheetDisplayProps> = ({ spriteSheet }) => {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full p-2 bg-slate-900 rounded-lg border border-slate-700">
        <img 
          src={spriteSheet} 
          alt="Generated Sprite Sheet" 
          className="w-full object-contain"
          style={{ imageRendering: 'pixelated' }} // Ensures pixel art is not blurred
        />
      </div>
      <a
        href={spriteSheet}
        download="generated-sprite-sheet.png"
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
      >
        <DownloadIcon />
        Download Sprite Sheet
      </a>
    </div>
  );
};

export default SpriteSheetDisplay;
