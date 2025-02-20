import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export default function AudioRecorder({
  onRecordingComplete,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button
          type="button"
          variant="outline"
          onClick={startRecording}
          className="flex items-center gap-2"
        >
          <Mic className="h-4 w-4" />
          Start Recording
        </Button>
      ) : (
        <Button
          type="button"
          variant="destructive"
          onClick={stopRecording}
          className="flex items-center gap-2"
        >
          <Square className="h-4 w-4" />
          Stop Recording
        </Button>
      )}
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Recording...
        </div>
      )}
    </div>
  );
}
