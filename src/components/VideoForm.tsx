import React from 'react';
import { VideoInput } from './VideoInput';
import { Loader2, Clock } from 'lucide-react';
import type { Style } from '../types';

interface VideoFormProps {
  videoUrl: string;
  onVideoUrlChange: (url: string) => void;
  onReactionVideoSelect: (file: File | null) => void;
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  styles: Style[];
  duration: number | null;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function VideoForm({
  videoUrl,
  onVideoUrlChange,
  onReactionVideoSelect,
  selectedStyle,
  onStyleChange,
  styles,
  duration,
  onSubmit,
  isSubmitting,
}: VideoFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video URL
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter video URL"
          required
          disabled={isSubmitting}
        />
      </div>

      {duration !== null && (
        <div className="bg-gray-50 p-4 rounded-md flex items-center gap-2">
          <Clock className="text-blue-500" size={20} />
          <div>
            <label className="block text-sm font-medium text-gray-700">
              TikTok Duration
            </label>
            <p className="text-lg font-semibold">{duration} seconds</p>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reaction Video
        </label>
        <VideoInput 
          onVideoSelect={onReactionVideoSelect} 
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => onStyleChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting || styles.length === 0}
        >
          <option value="">Select a style</option>
          {styles.map((style) => (
            <option key={style.id} value={style.name}>
              {style.name}
            </option>
          ))}
        </select>
        {styles.length === 0 && (
          <p className="mt-2 text-sm text-red-500">
            No styles available. Please check your Airtable configuration.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || styles.length === 0}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          'Process Video'
        )}
      </button>
    </form>
  );
}