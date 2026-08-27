/**
 * Audio Utility functions for clinical voice recording & playback
 */

/**
 * Formats seconds into MM:SS display format
 */
export function formatAudioDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Converts an audio Blob to a base64 Data URL so it can be stored in localStorage
 */
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generates a clean synthetic PCM WAV audio Data URL (medical chime sequence)
 * for initial demo data and preview purposes.
 */
export function generateSampleClinicalAudioDataUrl(durationSeconds = 6): string {
  const sampleRate = 22050;
  const numChannels = 1;
  const numSamples = sampleRate * durationSeconds;
  const bytesPerSample = 2; // 16-bit
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length
  view.setUint32(4, 36 + dataSize, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw PCM)
  view.setUint16(20, 1, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate
  view.setUint32(28, byteRate, true);
  // block align
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, dataSize, true);

  // Generate harmonious melodic chime frequencies (A4, C#5, E5, A5)
  const notes = [440, 554.37, 659.25, 880, 659.25, 554.37];
  const noteDuration = durationSeconds / notes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.min(Math.floor(t / noteDuration), notes.length - 1);
    const freq = notes[noteIndex];
    const localTime = (t % noteDuration);
    
    // Smooth bell-like envelope (exponential decay)
    const envelope = Math.exp(-localTime * 4.5);
    
    // Fundamental + gentle warm harmonic
    const sample = (
      Math.sin(2 * Math.PI * freq * t) * 0.7 +
      Math.sin(4 * Math.PI * freq * t) * 0.25 +
      Math.sin(6 * Math.PI * freq * t) * 0.05
    ) * envelope * 0.35;

    // Scale to 16-bit integer
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Convert array buffer to base64
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  return `data:audio/wav;base64,${base64}`;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
