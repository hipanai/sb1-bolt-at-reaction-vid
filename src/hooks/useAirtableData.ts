import { useState, useCallback } from 'react';
import { useAirtableQuery } from './useAirtableQuery';
import { fetchStyles, fetchVideos } from '../services/airtableService';
import type { Style, VideoRecord } from '../types';

export function useAirtableData() {
  const [localVideos, setLocalVideos] = useState<VideoRecord[]>([]);
  const styles = useAirtableQuery<Style[]>(fetchStyles);
  const videos = useAirtableQuery<VideoRecord[]>(fetchVideos);

  const addVideo = useCallback((video: VideoRecord) => {
    setLocalVideos(prev => [video, ...prev]);
  }, []);

  const allVideos = [...localVideos, ...(videos.data ?? [])];

  return {
    styles: styles.data ?? [],
    videos: allVideos,
    isLoading: styles.isLoading || videos.isLoading,
    error: styles.error || videos.error,
    addVideo,
  };
}