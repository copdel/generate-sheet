
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Utility to convert base64 to a GenerativePart object
const fileToGenerativePart = (base64: string) => {
  const match = base64.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match || match.length !== 3) {
    throw new Error("Invalid base64 image string");
  }
  const mimeType = match[1];
  const data = match[2];
  
  return {
    inlineData: {
      mimeType,
      data,
    },
  };
};

export const generateSpriteSheet = async (imageBase64: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(imageBase64);
    
    const prompt = `Analyze the single character in the provided image. Generate a 4x4 sprite sheet for a walking animation of this character. The character should walk towards the right. Each frame should show a distinct phase of the walk cycle. Ensure the background of the entire sprite sheet is transparent. The final output should be a single image file containing all 16 frames arranged in a grid.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                imagePart,
                { text: prompt },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return part.inlineData.data;
        }
    }
    
    throw new Error("No image was generated in the API response.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate sprite sheet. Please check the console for details.");
  }
};
