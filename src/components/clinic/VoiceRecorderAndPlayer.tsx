import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Download,
  Volume2,
  VolumeX,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileAudio,
  Plus
} from 'lucide-react';
import { formatAudioDuration, blobToDataUrl } from '../../utils/audioUtils';

interface VoiceRecorderAndPlayerProps {
  audioUrl?: string;
  audioDuration?: number;
  audioDate?: string;
  onSaveAudio?: (dataUrl: string, durationSeconds: number) => void;
  onDeleteAudio?: () => void;
  title?: string;
  subtitle?: string;
  allowRecord?: boolean;
  compact?: boolean;
}

export const VoiceRecorderAndPlayer: React.FC<VoiceRecorderAndPlayerProps> = ({
  audioUrl,
  audioDuration = 0,
  audioDate,
  onSaveAudio,
  onDeleteAudio,
  title = 'Doctor Consultation Voice Memo',
  subtitle = 'High-fidelity audio recording saved directly to patient chart',
  allowRecord = true,
  compact = false
}) => {
  // Recorder State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(audioDuration || 0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Update duration if prop changes
  useEffect(() => {
    if (audioDuration && !duration) {
      setDuration(audioDuration);
    }
  }, [audioDuration]);

  // Clean up timer and media stream on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // START RECORDING
  const startRecording = async () => {
    setRecordingError(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      streamRef.current = stream;

      // Determine supported mime type
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];
      let selectedMimeType = '';
      for (const type of mimeTypes) {
        if (MediaRecorder.isTypeSupported(type)) {
          selectedMimeType = type;
          break;
        }
      }

      const options = selectedMimeType ? { mimeType: selectedMimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: selectedMimeType || 'audio/webm' 
        });

        // Convert blob to Data URL for durable storage
        try {
          const dataUrl = await blobToDataUrl(audioBlob);
          const finalDuration = recordingSeconds || 1;
          setDuration(finalDuration);
          if (onSaveAudio) {
            onSaveAudio(dataUrl, finalDuration);
          }
        } catch (err) {
          console.error('Failed to convert recorded audio blob:', err);
        }

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(250); // Slice data every 250ms
      setIsRecording(true);
      setIsPaused(false);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error('Microphone error:', err);
      let errorMsg = 'Could not access microphone.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Microphone permission denied. Please allow microphone access in your browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No microphone device was found on this computer/device.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setRecordingError(errorMsg);
      setIsRecording(false);
    }
  };

  // PAUSE / RESUME RECORDING
  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // STOP & SAVE RECORDING
  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
  };

  // CANCEL RECORDING
  const cancelRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setIsPaused(false);
    setRecordingSeconds(0);
  };

  // AUDIO PLAYBACK CONTROLS
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    if (audioRef.current.duration && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const changePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2];
    const nextIndex = (rates.indexOf(playbackRate) + 1) % rates.length;
    const nextRate = rates[nextIndex];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const newMuted = !isMuted;
    audioRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`medical-card ${compact ? 'p-3.5' : 'p-5'} bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-4`}>
      
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#6BBF59] shrink-0">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#183153]">{title}</h4>
            <p className="text-[11px] text-slate-500">{subtitle}</p>
          </div>
        </div>

        {audioUrl && !isRecording && (
          <div className="flex items-center gap-2">
            {audioDate && (
              <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                {audioDate}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Voice Note Available</span>
            </span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {recordingError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Microphone Notice:</span> {recordingError}
          </div>
        </div>
      )}

      {/* VIEW 1: ACTIVE RECORDING IN PROGRESS */}
      {isRecording && (
        <div className="p-4 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-600"></span>
              </span>
              <span className="text-xs font-bold text-rose-950">
                {isPaused ? 'Recording Paused' : 'Recording Consultation Audio...'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-rose-200 shadow-xs font-mono font-bold text-xs text-rose-700">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              <span>{formatAudioDuration(recordingSeconds)}</span>
            </div>
          </div>

          {/* Animated Waveform Visualizer */}
          <div className="h-10 bg-white/80 rounded-xl border border-rose-100 px-3 flex items-center justify-center gap-1 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => {
              const heights = [20, 45, 75, 90, 60, 30, 80, 50, 95, 35, 65, 85, 40, 70, 90, 55];
              const randomH = isPaused ? 15 : heights[i % heights.length];
              return (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-150 ${isPaused ? 'bg-slate-300' : 'bg-[#6BBF59]'}`}
                  style={{ height: `${randomH}%` }}
                />
              );
            })}
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={cancelRecording}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium px-2 py-1 cursor-pointer"
            >
              Discard
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePauseRecording}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-xs"
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>

              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer animate-pulse"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop & Save Audio</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: PLAYBACK REPLAY CARD (When audio is recorded or exists) */}
      {audioUrl && !isRecording && (
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
          {/* Native HTML5 Audio element */}
          <audio
            ref={audioRef}
            src={audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            onLoadedMetadata={handleTimeUpdate}
            preload="metadata"
          />

          <div className="flex items-center gap-3">
            {/* Big Play / Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-11 h-11 rounded-xl bg-[#6BBF59] hover:bg-[#5EAB4D] text-white flex items-center justify-center shadow-md transition-all cursor-pointer shrink-0"
              title={isPlaying ? 'Pause' : 'Play Consultation Memo'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Audio Waveform Scrubber & Timer */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span className="font-bold text-[#183153]">{formatAudioDuration(currentTime)}</span>
                <span>{formatAudioDuration(duration || audioDuration || 0)}</span>
              </div>

              {/* Scrubber slider */}
              <div className="relative flex items-center">
                <input
                  type="range"
                  min="0"
                  max={duration || audioDuration || 1}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6BBF59]"
                />
              </div>
            </div>

            {/* Playback Speed Button */}
            <button
              type="button"
              onClick={changePlaybackRate}
              className="px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-mono font-bold text-[#183153] shadow-xs cursor-pointer"
              title="Change playback speed"
            >
              {playbackRate}x
            </button>

            {/* Mute Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Actions: Re-record, Download, Delete */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <FileAudio className="w-3.5 h-3.5 text-[#6BBF59]" />
              <span className="text-[11px]">Doctor Voice Memo Attached</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={audioUrl}
                download={`consultation-voice-${Date.now()}.wav`}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                title="Download Audio File"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {allowRecord && (
                <button
                  type="button"
                  onClick={startRecording}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-[#183153] rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-[#6BBF59]" />
                  <span>Re-record</span>
                </button>
              )}

              {onDeleteAudio && (
                <button
                  type="button"
                  onClick={onDeleteAudio}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                  title="Delete Voice Recording"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: EMPTY STATE / READY TO RECORD */}
      {!audioUrl && !isRecording && (
        <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-[#183153]">No voice memo recorded yet</div>
            <div className="text-[11px] text-slate-500">
              Record doctor-patient consultation audio to replay anytime from the patient chart.
            </div>
          </div>

          {allowRecord && (
            <button
              type="button"
              onClick={startRecording}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#6BBF59] hover:bg-[#5EAB4D] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer shrink-0"
            >
              <Mic className="w-4 h-4" />
              <span>Record Voice Note</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
