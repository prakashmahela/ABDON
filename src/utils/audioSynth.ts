/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Synthesizer for Q'rate Wedding Music Previews
// Generates beautiful, lush, and romantic live synthesized sounds to simulate premium curation.

let audioCtx: AudioContext | null = null;
let activeNodes: { oscs: OscillatorNode[]; gain: GainNode; filter: BiquadFilterNode; timerId?: number } | null = null;
let currentPlayingVibe: string | null = null;

function getAudioContext() {
  if (!audioCtx) {
    // Standard audio context setup
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Reverb/Delay simulation
function createDelayNode(ctx: AudioContext, feedbackAmount: number, delayTime: number) {
  const delay = ctx.createDelay();
  delay.delayTime.value = delayTime;
  
  const feedback = ctx.createGain();
  feedback.gain.value = feedbackAmount;
  
  delay.connect(feedback);
  feedback.connect(delay);
  
  return { delay, feedback };
}

export function playWeddingVibe(vibe: string, onNotePlay?: (noteName: string) => void) {
  try {
    const ctx = getAudioContext();
    if (activeNodes) {
      stopWeddingVibe();
    }
    
    currentPlayingVibe = vibe;
    const oscs: OscillatorNode[] = [];
    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(0, ctx.currentTime);
    mainGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.5); // Fade in
    
    // Lowpass filter for warm, high-end studio tape feeling
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    
    // Connect nodes
    mainGain.connect(filter);
    
    // Add spacey reverb/delay effect
    const { delay, feedback } = createDelayNode(ctx, 0.45, 0.35);
    filter.connect(ctx.destination); // Dry signal
    filter.connect(delay);          // Wet input
    delay.connect(ctx.destination);  // Wet output
    
    // Define musical scales for different wedding moments (Frequency in Hz)
    // Warm romantic/acoustic pluck frequencies
    const scales: Record<string, { notes: number[]; names: string[]; tempo: number }> = {
      ceremony: {
        notes: [220.00, 277.18, 329.63, 440.00, 554.37, 659.25], // A Major (A3, C#4, E4, A4, C#5, E5)
        names: ['A3', 'C#4', 'E4', 'A4', 'C#5', 'E5'],
        tempo: 600,
      },
      aisle: {
        notes: [146.83, 220.00, 293.66, 369.99, 440.00, 587.33], // D Major (D3, A3, D4, F#4, A4, D5)
        names: ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'],
        tempo: 750,
      },
      firstDance: {
        notes: [164.81, 246.94, 329.63, 415.30, 493.88, 659.25], // E Major (E3, B3, E4, G#4, B4, E5)
        names: ['E3', 'B3', 'E4', 'G#4', 'B4', 'E5'],
        tempo: 900,
      },
      reception: {
        notes: [196.00, 246.94, 293.66, 392.00, 493.88, 587.33], // G Major (G3, B3, D4, G4, B4, D5)
        names: ['G3', 'B3', 'D4', 'G4', 'B4', 'D5'],
        tempo: 450,
      },
      cultural: {
        notes: [146.83, 196.00, 220.00, 293.66, 392.00, 440.00], // Pentatonic scale for organic folk touch
        names: ['D3', 'G3', 'A3', 'D4', 'G4', 'A4'],
        tempo: 800,
      },
      party: {
        notes: [130.81, 196.00, 261.63, 329.63, 392.00, 523.25], // C Major upbeat (C3, G3, C4, E4, G4, C5)
        names: ['C3', 'G3', 'C4', 'E4', 'G4', 'C5'],
        tempo: 300,
      }
    };

    const selectedScale = scales[vibe] || scales.ceremony;
    let index = 0;
    
    // Play notes in an arpeggiated rhythmic loop
    const scheduleNextNote = () => {
      if (!currentPlayingVibe || currentPlayingVibe !== vibe) return;
      
      const noteFreq = selectedScale.notes[index];
      const noteName = selectedScale.names[index];
      
      if (onNotePlay) {
        onNotePlay(noteName);
      }
      
      // Pluck synthesis (warm, organic, nylon acoustic decay)
      const osc = ctx.createOscillator();
      const pluckGain = ctx.createGain();
      
      // Warm custom triangle + sine combination for acoustic organic body
      osc.type = Math.random() > 0.4 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
      
      pluckGain.gain.setValueAtTime(0, ctx.currentTime);
      pluckGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.02); // Pluck attack
      pluckGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8); // Lush decay
      
      osc.connect(pluckGain);
      pluckGain.connect(mainGain);
      
      osc.start();
      osc.stop(ctx.currentTime + 2.0);
      oscs.push(osc);
      
      // Keep osc array bounded
      if (oscs.length > 15) {
        const oldOsc = oscs.shift();
        oldOsc?.disconnect();
      }
      
      index = (index + 1) % selectedScale.notes.length;
      
      // Random subtle timing humanization
      const humanizedDelay = selectedScale.tempo + (Math.random() * 40 - 20);
      const timerId = window.setTimeout(scheduleNextNote, humanizedDelay);
      if (activeNodes) {
        activeNodes.timerId = timerId;
      }
    };
    
    // Start loop
    activeNodes = { oscs, gain: mainGain, filter, timerId: undefined };
    scheduleNextNote();
    
    // Global filter sweep for ambient airiness
    filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 2.0);
    
  } catch (err) {
    console.error("Synthesizer error", err);
  }
}

export function stopWeddingVibe() {
  currentPlayingVibe = null;
  if (activeNodes) {
    if (activeNodes.timerId) {
      clearTimeout(activeNodes.timerId);
    }
    try {
      // Fade out main gain before stopping to avoid audio clicks
      const ctx = audioCtx;
      if (ctx) {
        activeNodes.gain.gain.setValueAtTime(activeNodes.gain.gain.value, ctx.currentTime);
        activeNodes.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        
        setTimeout(() => {
          activeNodes?.oscs.forEach(osc => {
            try { osc.stop(); } catch(e) {}
            try { osc.disconnect(); } catch(e) {}
          });
          try { activeNodes?.gain.disconnect(); } catch(e) {}
          try { activeNodes?.filter.disconnect(); } catch(e) {}
        }, 300);
      }
    } catch (e) {
      console.error("Error stopping synthesizer nodes", e);
    }
    activeNodes = null;
  }
}

export function getCurrentlyPlayingVibe() {
  return currentPlayingVibe;
}
