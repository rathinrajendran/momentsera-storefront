import { useRef, useState } from "react";

function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRef.current = recorder;

    recorder.ondataavailable = (e) => chunks.current.push(e.data);
    recorder.start();
    setRecording(true);
  }

  function stop(): Promise<File> {
    return new Promise((resolve) => {
      mediaRef.current!.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        chunks.current = [];
        resolve(new File([blob], "wish-audio.webm"));
      };
      mediaRef.current!.stop();
      setRecording(false);
    });
  }

  return { recording, start, stop };
}

function useVideoRecorder(videoRef: React.RefObject<HTMLVideoElement>) {
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }

    mediaRef.current = new MediaRecorder(stream);
    mediaRef.current.ondataavailable = (e) =>
      chunks.current.push(e.data);

    mediaRef.current.start();
  }

  function stop(): Promise<File> {
    return new Promise((resolve) => {
      mediaRef.current!.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        chunks.current = [];
        resolve(new File([blob], "wish-video.webm"));
      };
      mediaRef.current!.stop();
    });
  }

  return { start, stop };
}
