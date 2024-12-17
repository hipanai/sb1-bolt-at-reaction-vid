export interface VideoRecord {
  id: string;
  videoUrl: string;
  reactionVideo: string;
  style: string;
  duration: number;
  finalVideo?: string;
}

export interface Style {
  id: string;
  name: string;
}