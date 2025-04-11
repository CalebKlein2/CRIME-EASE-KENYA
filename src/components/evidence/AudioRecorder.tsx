import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Save, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AudioRecorderProps {
  onAudioCaptured: (audioBlob: Blob, fileName: string) => void;
  label?: string;
  maxDuration?: number; // in seconds
}

export function AudioRecorder({
  onAudioCaptured,
  label = 'Record Statement',
  maxDuration = 300, // 5 minutes by default
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Initialize audio player
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
      
      audioPlayerRef.current.addEventListener('ended', () => {
        setIsPlaying(false);
        setPlaybackProgress(0);
      });
      
      audioPlayerRef.current.addEventListener('timeupdate', () => {
        if (audioPlayerRef.current) {
          const progress = (audioPlayerRef.current.currentTime / audioPlayerRef.current.duration) * 100;
          setPlaybackProgress(progress);
        }
      });
    }
    
    return () => {
      // Clean up
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.src = '';
      }
    };
  }, []);

  const startRecording = async (e) => {
    // Prevent the button from submitting a form if it's within one
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        
        if (audioPlayerRef.current) {
          audioPlayerRef.current.src = audioUrlRef.current;
        }
        
        // Stop all tracks in the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => {
          const newDuration = prev + 1;
          // Stop recording if max duration is reached
          if (newDuration >= maxDuration) {
            stopRecording(null);
          }
          return newDuration;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = (e) => {
    // Prevent the button from submitting a form if it's within one
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!mediaRecorderRef.current) return;
    
    if (mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlayback = (e) => {
    // Prevent the button from submitting a form if it's within one
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!audioPlayerRef.current || !audioUrlRef.current) return;
    
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  const discardRecording = (e) => {
    // Prevent the button from submitting a form if it's within one
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    setAudioBlob(null);
    setPlaybackProgress(0);
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = '';
    }
  };

  const saveRecording = (e) => {
    // Prevent the button from submitting a form if it's within one
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    if (!audioBlob) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `audio-statement-${timestamp}.wav`;
    
    // Call the callback but don't reset the audio UI state
    onAudioCaptured(audioBlob, fileName);
    
    // Show a success message instead of clearing
    toast({
      title: "Audio saved",
      description: "Your audio statement has been saved successfully.",
      variant: "success"
    });
  };
  
  // Toast component for notifications
  const toast = (props: { title: string; description: string; variant: string }) => {
    const toastElement = document.createElement('div');
    toastElement.className = `fixed bottom-4 right-4 bg-white p-4 rounded-md shadow-lg border ${props.variant === 'success' ? 'border-green-500' : 'border-blue-500'} max-w-md z-50`;
    
    toastElement.innerHTML = `
      <div class="flex items-start">
        <div>
          <h3 class="font-medium">${props.title}</h3>
          <p class="text-sm text-gray-600">${props.description}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(toastElement);
    
    setTimeout(() => {
      toastElement.style.opacity = '0';
      toastElement.style.transition = 'opacity 0.5s ease-out';
      
      setTimeout(() => {
        document.body.removeChild(toastElement);
      }, 500);
    }, 3000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">{label}</h3>
      
      {isRecording ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 font-medium">Recording</span>
            </div>
            <span className="text-sm font-mono">{formatDuration(recordingDuration)}</span>
          </div>
          
          <Progress 
            value={(recordingDuration / maxDuration) * 100} 
            className="h-2"
          />
          
          <div className="flex justify-center">
            <Button 
              variant="destructive"
              size="lg"
              className="rounded-full w-12 h-12 p-0"
              onClick={stopRecording}
              type="button"
            >
              <Square className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : audioBlob ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Audio Statement</span>
            <span className="text-sm font-mono">
              {formatDuration(Math.floor(audioPlayerRef.current?.duration || 0))}
            </span>
          </div>
          
          <Progress 
            value={playbackProgress} 
            className="h-2"
          />
          
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={togglePlayback}
              type="button"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button 
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={discardRecording}
              type="button"
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </Button>
            
            <Button 
              variant="default"
              size="icon"
              className="rounded-full"
              onClick={saveRecording}
              type="button"
            >
              <Save className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500 text-center">
            Tap the microphone to record an audio statement about what happened.
            <br />
            Max recording time: {formatDuration(maxDuration)}
          </p>
          
          <Button 
            variant="outline"
            size="lg"
            className="rounded-full w-16 h-16 p-0"
            onClick={startRecording}
            type="button"
          >
            <Mic className="w-8 h-8 text-blue-600" />
          </Button>
        </div>
      )}
    </div>
  );
}
