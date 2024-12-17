import React, { useState, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { Video, Upload, Camera } from 'lucide-react';
import clsx from 'clsx';

interface VideoInputProps {
  onVideoSelect: (file: File | null) => void;
  disabled?: boolean;
}

export function VideoInput({ onVideoSelect, disabled = false }: VideoInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(() => {
    if (disabled) return;
    
    chunksRef.current = [];
    setIsRecording(true);
    setShowWebcam(true);
    setRecordedVideo(null);

    const stream = webcamRef.current?.stream;
    if (stream) {
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        
        // Create a File object from the Blob
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        onVideoSelect(file);
      };

      mediaRecorderRef.current.start();
    }
  }, [disabled, onVideoSelect]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setRecordedVideo(URL.createObjectURL(file));
      setShowWebcam(false);
      onVideoSelect(file);
    }
  };

  const handleStartCamera = () => {
    setShowWebcam(true);
    setRecordedVideo(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className={clsx(
          "flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer",
          disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600",
          "text-white"
        )}>
          <Upload size={20} />
          Upload Video
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={disabled}
          />
        </label>
        {!showWebcam && !isRecording && (
          <button
            onClick={handleStartCamera}
            disabled={disabled}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600",
              "text-white"
            )}
          >
            <Camera size={20} />
            Start Camera
          </button>
        )}
        {showWebcam && (
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={disabled}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              disabled
                ? "bg-gray-400 cursor-not-allowed"
                : isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600",
              "text-white"
            )}
          >
            {isRecording ? (
              <>
                <Video size={20} /> Stop Recording
              </>
            ) : (
              <>
                <Camera size={20} /> Start Recording
              </>
            )}
          </button>
        )}
      </div>

      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
        {showWebcam && !recordedVideo && (
          <Webcam
            ref={webcamRef}
            audio={true}
            className="w-full h-full object-cover"
          />
        )}
        {recordedVideo && (
          <video
            src={recordedVideo}
            controls
            className="w-full h-full object-cover"
          />
        )}
        {!showWebcam && !recordedVideo && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            No video selected
          </div>
        )}
      </div>
    </div>
  );
}