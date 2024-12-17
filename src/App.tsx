import React, { useState } from 'react';
import { Section } from './components/Section';
import { VideoForm } from './components/VideoForm';
import { VideoList } from './components/VideoList';
import { FinalVideo } from './components/FinalVideo';
import { LoginButton } from './components/LoginButton';
import { createVideo } from './services/airtableService';
import { useAirtableData } from './hooks/useAirtableData';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { ErrorMessage } from './components/ErrorMessage';

export default function App() {
  const { isAuthenticated, isLoading: authLoading, error: authError, login, logout } = useAuth();
  const { styles, videos, isLoading: dataLoading, error: dataError, addVideo } = useAirtableData();
  const [videoUrl, setVideoUrl] = useState('');
  const [reactionVideo, setReactionVideo] = useState<File | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('');
  const [duration, setDuration] = useState<number | null>(null);
  const [finalVideo, setFinalVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reactionVideo || !selectedStyle || !isAuthenticated) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setDuration(null);

    try {
      const newVideo = await createVideo({
        videoUrl,
        reactionVideo,
        style: selectedStyle,
      });
      
      addVideo(newVideo);
      setFinalVideo(newVideo.finalVideo);
      setDuration(newVideo.duration);
      
      setVideoUrl('');
      setReactionVideo(null);
      setSelectedStyle('');
    } catch (err) {
      setSubmitError('Failed to process video. Please try again.');
      console.error('Failed to create video:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Video Processing Dashboard
          </h1>
          <LoginButton 
            isAuthenticated={isAuthenticated}
            onLogin={login}
            onLogout={logout}
          />
        </div>

        {(authError || dataError || submitError) && (
          <ErrorMessage message={authError || dataError || submitError} />
        )}

        {!isAuthenticated ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg text-gray-600 mb-4">
              Please log in with your Airtable account to access the video processing features.
            </p>
            <LoginButton 
              isAuthenticated={false}
              onLogin={login}
              onLogout={logout}
            />
          </div>
        ) : (
          <>
            <Section title="1. Input Details">
              <VideoForm
                videoUrl={videoUrl}
                onVideoUrlChange={setVideoUrl}
                onReactionVideoSelect={setReactionVideo}
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                styles={styles}
                duration={duration}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </Section>

            <Section title="2. Final Video">
              <FinalVideo videoUrl={finalVideo} />
            </Section>

            <Section title="3. All Videos">
              <VideoList videos={videos} itemsPerPage={5} />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}