/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CurationPlan {
  vibeTitle: string;
  description: string;
  recommendedLineup: {
    role: string;
    description: string;
    instruments: string[];
  }[];
  keyTransitions: {
    moment: string;
    song: string;
    artist: string;
    why: string;
  }[];
  productionNeeds: string[];
}

export const curationTemplates: Record<string, CurationPlan> = {
  "Elegant Classical": {
    vibeTitle: "Symphonic Romance",
    description: "An ultra-premium, timeless acoustic experience characterized by grand string configurations and warm romantic layers. Perfect for highly formal, elegant settings.",
    recommendedLineup: [
      {
        role: "Ceremony & Walkway",
        description: "Bespoke Classical String Quartet providing highly synchronized, airy melodies.",
        instruments: ["Violin I", "Violin II", "Viola", "Cello"]
      },
      {
        role: "Cocktail Hour & Reception Entry",
        description: "Grand Solo Piano performing classical interpretations of contemporary ballads.",
        instruments: ["Steinway Grand Piano"]
      }
    ],
    keyTransitions: [
      {
        moment: "The Walk Down the Aisle",
        song: "Canon in D (Reimagined)",
        artist: "Johann Pachelbel (Quartet arrangement)",
        why: "A sweeping, crescendo-focused arrangement that elevates the emotional peak of the entrance."
      },
      {
        moment: "The First Dance",
        song: "La Vie En Rose",
        artist: "Edith Piaf (Strings & Piano)",
        why: "An intimate, swaying arrangement that highlights the acoustic space."
      }
    ],
    productionNeeds: ["High-definition spatial microphone array", "Symphonic reverberation units", "Warm, low-key candle-lit spotlighting"]
  },
  "Choral & Gospel": {
    vibeTitle: "Celestial Harmonies & Soul",
    description: "A rich, emotionally-stirring choral experience highlighting powerful vocal arrangements, layered harmonies, and spiritual resonance.",
    recommendedLineup: [
      {
        role: "Ceremony & Liturgy",
        description: "An 8-piece professional chamber choir performing rich vocal harmony.",
        instruments: ["Soprano", "Alto", "Tenor", "Bass", "Acoustic Piano"]
      },
      {
        role: "Reception Entrance",
        description: "A soulful acoustic duo with warm gospel-style backing keyboard.",
        instruments: ["Vocalist", "Hammond B3 Keyboard"]
      }
    ],
    keyTransitions: [
      {
        moment: "The Aisle Walk",
        song: "Amazing Grace (Chamber Harmonies)",
        artist: "Q'rate Liturgical Choir",
        why: "A multi-layered vocal introduction starting in whisper-soft unison and ending in full, grand harmony."
      },
      {
        moment: "The Reception Exit",
        song: "Oh Happy Day",
        artist: "Full Ensemble",
        why: "A high-energy, joyful exit that pulls the entire room onto their feet."
      }
    ],
    productionNeeds: ["Multi-channel vocal condenser mics", "Custom stage monitor mixers", "Balanced acoustic shell setup"]
  },
  "Indie Folk & Acoustic": {
    vibeTitle: "Warm Meadow Acoustic",
    description: "Intimate, hand-crafted, and earthy. Centered around warm acoustic strings, storytelling vocals, and raw, beautiful acoustic timbres that feel cozy and authentic.",
    recommendedLineup: [
      {
        role: "Full Wedding Day",
        description: "An indie-acoustic singer-songwriter duo specializing in gentle emotional storytelling.",
        instruments: ["Acoustic Guitar", "Mandolin", "Warm Male & Female Duet Vocals"]
      },
      {
        role: "Sunset Dinner Set",
        description: "An ambient acoustic trio playing soft percussion-driven indie folk.",
        instruments: ["Upright Bass", "Cajon", "Acoustic Guitar"]
      }
    ],
    keyTransitions: [
      {
        moment: "The Aisle Walk",
        song: "First Day of My Life",
        artist: "Bright Eyes (Acoustic Cover)",
        why: "A beautifully raw, finger-picked arrangement focusing purely on lyrical warmth."
      },
      {
        moment: "The First Dance",
        song: "Bloom",
        artist: "The Paper Kites",
        why: "A warm, swirling guitar duet that creates a private, serene moment for the couple."
      }
    ],
    productionNeeds: ["Vintage tube acoustic microphones", "Custom wooden Cajon soundboard", "Ambient festoon stage lights"]
  },
  "Contemporary Jazz & Pop": {
    vibeTitle: "The Velvet Lounge & Groove",
    description: "A highly sophisticated fusion of late-night velvet jazz and upscale pop arrangements. Creates a lively, polished atmosphere for modern romantic celebrations.",
    recommendedLineup: [
      {
        role: "Ceremony Backdrop",
        description: "Solo Jazz Guitarist playing lush, ambient chord melody arrangements.",
        instruments: ["Gibson Archtop Hollowbody Guitar"]
      },
      {
        role: "Grand Dinner Reception",
        description: "A full 5-piece Jazz & Soul band performing polished, upbeat, classic lounge standards.",
        instruments: ["Saxophone", "Double Bass", "Semi-Hollow Guitar", "Drum Kit", "Lead Vocals"]
      }
    ],
    keyTransitions: [
      {
        moment: "Aisle Walk",
        song: "At Last",
        artist: "Etta James (Velvet Quintet Cover)",
        why: "A rich, horn-driven slow groove that commands attention and emotional power."
      },
      {
        moment: "First Dance",
        song: "Fly Me to the Moon",
        artist: "Frank Sinatra (Lounge Swing)",
        why: "An upbeat, stylishly elegant rhythm perfect for a choreographed, joyous dance."
      }
    ],
    productionNeeds: ["Retro brass mics", "Custom bass amp sound shells", "Lounge-themed ambient floor uplighting"]
  },
  "Romantic String Quartet": {
    vibeTitle: "Classical-Meets-Modern String Magic",
    description: "Elegant and majestic, combining the pristine discipline of classical instruments with high-fidelity custom scores of modern indie and pop love anthems.",
    recommendedLineup: [
      {
        role: "Entire Experience",
        description: "The premier Q'rate chamber string ensemble playing personalized scores.",
        instruments: ["Violin I", "Violin II", "Viola", "Violoncello", "Concert Harp"]
      }
    ],
    keyTransitions: [
      {
        moment: "The Entrance Walk",
        song: "Wildest Dreams",
        artist: "Taylor Swift (Chamber String Cover)",
        why: "Bridgerton-style sweeping strings that build a dramatic, breathtaking cinematic atmosphere."
      },
      {
        moment: "First Dance",
        song: "Turning Page",
        artist: "Sleeping At Last (Harp & Strings)",
        why: "A cascading, emotional performance centered around a delicate harp structure."
      }
    ],
    productionNeeds: ["High-end DPA clip-on instrument microphones", "Acoustic stage dampeners", "Subtle floor mist effects"]
  }
};
