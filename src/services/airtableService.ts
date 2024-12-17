import { getBase } from '../config/airtable';
import { AIRTABLE_CONFIG, ERROR_MESSAGES } from '../config/constants';
import type { VideoRecord, Style } from '../types';
import { fileToBase64 } from '../utils/fileUtils';

export async function fetchStyles(): Promise<Style[]> {
  const base = getBase();
  if (!base) {
    throw new Error(ERROR_MESSAGES.AUTHENTICATION);
  }

  try {
    const records = await base(AIRTABLE_CONFIG.TABLES.STYLES)
      .select({
        view: AIRTABLE_CONFIG.VIEWS.DEFAULT,
        fields: ['Style']
      })
      .all();

    return records
      .map((record): Style | null => {
        const style = record.get('Style');
        return style ? { id: record.id, name: style as string } : null;
      })
      .filter((style): style is Style => style !== null);
  } catch (error) {
    console.error('Error fetching styles:', error);
    throw new Error(ERROR_MESSAGES.FETCH_STYLES);
  }
}

export async function fetchVideos(): Promise<VideoRecord[]> {
  const base = getBase();
  if (!base) {
    throw new Error(ERROR_MESSAGES.AUTHENTICATION);
  }

  try {
    const records = await base(AIRTABLE_CONFIG.TABLES.VIDEOS)
      .select({
        view: AIRTABLE_CONFIG.VIEWS.ALL_DATA,
        fields: ['RID', 'Style', 'Final Video']
      })
      .all();

    return records.map((record): VideoRecord => ({
      id: record.get('RID') as string,
      videoUrl: '',
      reactionVideo: '',
      style: record.get('Style') as string,
      duration: 0,
      finalVideo: record.get('Final Video') as string
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw new Error(ERROR_MESSAGES.FETCH_VIDEOS);
  }
}

export async function createVideo({ videoUrl, reactionVideo, style }: {
  videoUrl: string;
  reactionVideo: File;
  style: string;
}): Promise<VideoRecord> {
  const base = getBase();
  if (!base) {
    throw new Error(ERROR_MESSAGES.AUTHENTICATION);
  }

  try {
    // First, create the initial record with the video URL
    const initialRecord = await base(AIRTABLE_CONFIG.TABLES.VIDEOS).create({
      'Video URL': videoUrl,
      'Style': style
    });

    // Wait for 20 seconds to allow Airtable automation to process
    await new Promise(resolve => setTimeout(resolve, 20000));

    // Get the RID from the record
    const rid = initialRecord.get('RID');
    if (!rid) {
      throw new Error(ERROR_MESSAGES.RID_NOT_FOUND);
    }

    // Convert reaction video to base64
    const base64Video = await fileToBase64(reactionVideo);

    // Update the record with the reaction video
    const updatedRecord = await base(AIRTABLE_CONFIG.TABLES.VIDEOS).update(initialRecord.id, {
      'My Reaction Video': [{ url: base64Video }]
    });

    return {
      id: rid as string,
      videoUrl,
      reactionVideo: '',
      style,
      duration: updatedRecord.get('TikTok Duration') as number || 0,
      finalVideo: updatedRecord.get('Final Video') as string
    };
  } catch (error) {
    console.error('Error creating video:', error);
    throw new Error(ERROR_MESSAGES.CREATE_VIDEO);
  }
}