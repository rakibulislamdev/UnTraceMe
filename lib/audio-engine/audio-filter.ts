/**
 * Audio AI Artifact & Metallic Resonator DSP Engine
 * Client-Side Web Audio API + OfflineAudioContext
 *
 * Capabilities:
 * 1. Metallic Resonance Notch Filtering (Removes 2.8kHz-4.2kHz robotic synthetic peaks)
 * 2. Ultrasonic AI Watermark Truncation (Low-pass filter at 16kHz-18kHz)
 * 3. Synthetic Sub-Harmonic Rumble Clean (High-pass at 80Hz)
 * 4. Micro-Warmth Tube Saturation (Inherent human vocal analog simulation)
 * 5. Complete MP3 / WAV metadata scrubbing
 */

export interface AudioFilterOptions {
  metallicNotch: boolean; // Suppress robotic phase peaks (~3.2kHz)
  ultrasonicCutoff: boolean; // Eliminate inaudible high-frequency watermark bands (>16kHz)
  subBassRumble: boolean; // High-pass filter at 80Hz
  analogWarmth: boolean; // Gentle subtle tube saturation
  intensity: number; // 0 to 100
}

export interface AudioProcessingResult {
  processedBlob: Blob;
  downloadUrl: string;
  duration: number;
  sampleRate: number;
  channels: number;
  originalSize: number;
  processedSize: number;
}

// Convert AudioBuffer to 16-bit PCM WAV Blob
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const headerSize = 44;
  const outBuffer = new ArrayBuffer(headerSize + length);
  const view = new DataView(outBuffer);

  // Helper to write string to DataView
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  /* RIFF chunk descriptor */
  writeString(0, "RIFF");
  view.setUint32(4, 36 + length, true);
  writeString(8, "WAVE");

  /* "fmt " sub-chunk */
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, format, true); // AudioFormat
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // ByteRate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  /* "data" sub-chunk */
  writeString(36, "data");
  view.setUint32(40, length, true);

  // Interleave channel samples and convert from float to 16-bit PCM
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      let sample = channels[c][i];
      // Clamp between -1.0 and 1.0
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit integer (-32768 to 32767)
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([outBuffer], { type: "audio/wav" });
}

export async function processAudioArtifacts(
  file: File,
  options: AudioFilterOptions,
  onProgress?: (percent: number) => void
): Promise<AudioProcessingResult> {
  const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  
  onProgress?.(15);
  const arrayBuffer = await file.arrayBuffer();
  
  onProgress?.(35);
  const decodedBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  const { numberOfChannels, sampleRate, duration, length } = decodedBuffer;

  // Use OfflineAudioContext for headless ultra-fast rendering
  const offlineCtx = new OfflineAudioContext(numberOfChannels, length, sampleRate);

  // 1. Source Node
  const sourceNode = offlineCtx.createBufferSource();
  sourceNode.buffer = decodedBuffer;

  let currentNode: AudioNode = sourceNode;

  const strength = options.intensity / 100;

  // 2. Sub-Bass Clean (80Hz Highpass) — eliminates synthetic microphone sub-rumble
  if (options.subBassRumble) {
    const highpass = offlineCtx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 80;
    highpass.Q.value = 0.707;
    currentNode.connect(highpass);
    currentNode = highpass;
  }

  // 3. Metallic Artifact Notch Filter (Center ~3400Hz) — targeted AI voice sheen removal
  if (options.metallicNotch) {
    const notchFilter = offlineCtx.createBiquadFilter();
    notchFilter.type = "peaking";
    notchFilter.frequency.value = 3400;
    notchFilter.gain.value = -4.5 * strength; // reduce robotic metallic presence
    notchFilter.Q.value = 1.8;
    currentNode.connect(notchFilter);
    currentNode = notchFilter;
  }

  // 4. Ultrasonic Cutoff (Lowpass Filter at 16.5kHz) — eliminates hidden AI watermarks
  if (options.ultrasonicCutoff) {
    const lowpass = offlineCtx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 16500;
    lowpass.Q.value = 0.707;
    currentNode.connect(lowpass);
    currentNode = lowpass;
  }

  // 5. Subtle Analog Warmth (WaveShaper saturation for natural acoustic depth)
  if (options.analogWarmth) {
    const shaper = offlineCtx.createWaveShaper();
    const curve = new Float32Array(4096);
    const k = 1.5 * strength;
    const deg = Math.PI / 180;
    for (let i = 0; i < 4096; ++i) {
      const x = (i * 2) / 4096 - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    shaper.curve = curve;
    shaper.oversample = "2x";
    currentNode.connect(shaper);
    currentNode = shaper;
  }

  // Connect to Offline Destination
  currentNode.connect(offlineCtx.destination);
  sourceNode.start(0);

  onProgress?.(65);
  const renderedBuffer = await offlineCtx.startRendering();

  onProgress?.(90);
  const wavBlob = audioBufferToWav(renderedBuffer);
  const downloadUrl = URL.createObjectURL(wavBlob);

  onProgress?.(100);

  return {
    processedBlob: wavBlob,
    downloadUrl,
    duration,
    sampleRate,
    channels: numberOfChannels,
    originalSize: file.size,
    processedSize: wavBlob.size,
  };
}

/**
 * Generates an in-memory speech-like synthesized audio file
 * Simulates an AI voiceover with subtle harmonic modulation and metallic presence
 */
export function generateSyntheticSampleAudio(): File {
  const sampleRate = 44100;
  const duration = 3.5; // seconds
  const totalSamples = sampleRate * duration;
  const numChannels = 1;

  const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const buffer = audioCtx.createBuffer(numChannels, totalSamples, sampleRate);
  const data = buffer.getChannelData(0);

  // Fundamental vocal cadence notes simulating speech phonemes
  const phonemePitches = [165, 175, 160, 190, 165, 155, 140];
  const phonemeDuration = duration / phonemePitches.length;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const phonemeIndex = Math.min(Math.floor(t / phonemeDuration), phonemePitches.length - 1);
    const f0 = phonemePitches[phonemeIndex];

    // Vocal tract formants (F1, F2, F3) + synthetic metallic harmonic at 3.4kHz
    const fundamental = 0.5 * Math.sin(2 * Math.PI * f0 * t);
    const formant1 = 0.25 * Math.sin(2 * Math.PI * (f0 * 3) * t);
    const formant2 = 0.15 * Math.sin(2 * Math.PI * (f0 * 5) * t);
    // Metallic synthetic AI artifact peak (centered at 3400Hz)
    const metallicArtifact = 0.08 * Math.sin(2 * Math.PI * 3400 * t);
    // Ultrasonic AI watermark component (17.2kHz)
    const ultrasonicWatermark = 0.04 * Math.sin(2 * Math.PI * 17200 * t);

    // Phoneme amplitude envelope
    const localT = (t % phonemeDuration) / phonemeDuration;
    const envelope = Math.sin(Math.PI * localT);

    data[i] = (fundamental + formant1 + formant2 + metallicArtifact + ultrasonicWatermark) * envelope * 0.7;
  }

  const wavBlob = audioBufferToWav(buffer);
  return new File([wavBlob], "demo-ai-synthetic-voiceover.wav", { type: "audio/wav" });
}
