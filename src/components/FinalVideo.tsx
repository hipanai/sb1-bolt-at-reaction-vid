import React from 'react';
import { ArrowDown } from 'lucide-react';

interface FinalVideoProps {
  videoUrl: string | null;
}

export function FinalVideo({ videoUrl }: FinalVideoProps) {
  if (!videoUrl) {
    return (
      <div className="text-center text-gray-500 py-12">
        No video processed yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={videoUrl}
          controls
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex justify-center">
        <a
          href={videoUrl}
          download
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <ArrowDown size={20} />
          Download Video
        </a>
      </div>
    </div>
  );
}