/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Calendar,
  MapPin,
  Users,
  Music,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Star,
  Info,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  ArrowRight,
  CalendarDays,
  Sparkle,
  Check
} from "lucide-react";
import { playWeddingVibe, stopWeddingVibe, getCurrentlyPlayingVibe } from "./utils/audioSynth";
import { curationTemplates } from "./data/curationTemplates";

// Component-level SafeImage helper with direct fallback & state
function SafeImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <div className={`img-fallback ${className}`} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
}

// Inline SVGs for elegant gold line-art
const LaurelLeft = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={`${className} text-gold opacity-60`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M50,90 C30,70 20,45 20,20 C32,25 42,32 50,45" strokeLinecap="round" />
    <path d="M22,25 C15,30 18,40 22,42 C26,44 28,34 22,25 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M25,40 C18,45 20,55 25,57 C30,59 32,49 25,40 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M30,55 C23,60 25,70 30,72 C35,74 37,64 30,55 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M38,70 C31,75 33,85 38,87 C43,89 45,79 38,70 Z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const LaurelRight = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg className={`${className} text-gold opacity-60`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M50,90 C70,70 80,45 80,20 C68,25 58,32 50,45" strokeLinecap="round" />
    <path d="M78,25 C85,30 82,40 78,42 C74,44 72,34 78,25 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M75,40 C82,45 80,55 75,57 C70,59 68,49 75,40 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M70,55 C77,60 75,70 70,72 C65,74 63,64 70,55 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M62,70 C69,75 67,85 62,87 C57,89 55,79 62,70 Z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const SectionDividerSprig = () => (
  <div className="flex items-center justify-center py-4 opacity-40">
    <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-gold"></div>
    <svg className="w-8 h-8 mx-4 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M50,15 C40,35 25,50 50,85 C75,50 60,35 50,15 Z" strokeLinecap="round" />
      <path d="M50,40 C42,42 42,52 50,55 C58,52 58,42 50,40 Z" fill="currentColor" />
    </svg>
    <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-gold"></div>
  </div>
);

const EyebrowSprigFlourish = () => (
  <div className="flex items-center justify-center space-x-2 mb-2">
    <svg className="w-4 h-4 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M50,10 C45,35 15,50 50,90 C85,50 55,35 50,10 Z" />
    </svg>
    <svg className="w-2.5 h-2.5 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="50" cy="50" r="20" fill="currentColor" />
    </svg>
    <svg className="w-4 h-4 text-gold transform rotate-180" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M50,10 C45,35 15,50 50,90 C85,50 55,35 50,10 Z" />
    </svg>
  </div>
);

// Wax Seal Circular Monogram "Q"
const WaxSealMonogram = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-11 h-11 text-base",
    lg: "w-16 h-16 text-2xl"
  };

  return (
    <div 
      className={`rounded-full bg-gradient-to-tr from-gold to-gold-soft text-wine flex items-center justify-center font-serif font-semibold relative ${sizeClasses[size]} select-none`}
      style={{
        boxShadow: "inset 1px 1.5px 3px rgba(255,255,255,0.65), inset -1.5px -2px 4px rgba(60,20,35,0.35), 0 4px 12px rgba(74,20,36,0.18)"
      }}
    >
      <span className="relative z-10 font-bold tracking-tight italic select-none">Q</span>
      {/* Outer subtle ridge overlay */}
      <div className="absolute inset-0.5 rounded-full border border-wine/10 opacity-45 pointer-events-none"></div>
    </div>
  );
};

// Simulated falling gold petals for background atmosphere
function FallingPetals() {
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; scale: number; duration: number }>>([]);

  useEffect(() => {
    // Generate static-dynamic petals
    const newPetals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      delay: Math.random() * 8, // seconds
      scale: 0.4 + Math.random() * 0.8,
      duration: 10 + Math.random() * 8 // seconds
    }));
    setPetals(newPetals);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute text-gold-soft opacity-30 select-none pointer-events-none animate-petal-fall"
          style={{
            left: `${petal.left}%`,
            top: `-5%`,
            animationDelay: `${petal.delay}s`,
            animationDuration: `${petal.duration}s`,
            transform: `scale(${petal.scale})`
          }}
        >
          {/* Elegant gold petal shape (inline SVG) */}
          <svg className="w-4 h-4 fill-current" viewBox="0 0 100 100">
            <path d="M50,15 C20,35 15,65 50,85 C85,65 80,35 50,15 Z" />
          </svg>
        </div>
      ))}
    </div>
  );
}

interface InquiryForm {
  date: string;
  venue: string;
  guests: string;
  vibe: string;
  format: "Full wedding" | "Ceremony" | "Reception";
}

export default function App() {
  // Mobile Nav Drawer State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll Nav state toggler
  const [isScrolled, setIsScrolled] = useState(false);

  // Audio synths preview states
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [playingNote, setPlayingNote] = useState<string>("");

  // Story Active Tabs
  const [activeStoryTab, setActiveStoryTab] = useState<"story" | "approach" | "promise">("story");

  // Parallax subtle tracking state
  const [scrollYOffset, setScrollYOffset] = useState(0);

  // Inquiry Widget Form State
  const [inquiry, setInquiry] = useState<InquiryForm>({
    date: "",
    venue: "Kohima, Nagaland",
    guests: "100 - 300",
    vibe: "Elegant Classical",
    format: "Full wedding",
  });

  // Modal Overlay States
  const [isBespokeModalOpen, setIsBespokeModalOpen] = useState(false);
  const [customPlan, setCustomPlan] = useState<any>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationSuccess, setConsultationSuccess] = useState(false);
  const [activeWhatWeDoDetail, setActiveWhatWeDoDetail] = useState<string | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = e.targetTouches[0].clientX; // Initialize end with start
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      // swipe left (next slide)
      setActiveStoryIndex((prev) => (prev === 2 ? 0 : prev + 1));
    } else if (diff < -50) {
      // swipe right (prev slide)
      setActiveStoryIndex((prev) => (prev === 0 ? 2 : prev - 1));
    }
  };

  // Consultation Submission
  const [consultationForm, setConsultationForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });

  // Watch window scroll to apply class transitions and subtle parallax tracking
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
      setScrollYOffset(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync state with audio synth currently playing
  useEffect(() => {
    const interval = setInterval(() => {
      const active = getCurrentlyPlayingVibe();
      if (active !== currentlyPlaying) {
        setCurrentlyPlaying(active);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [currentlyPlaying]);

  // Hook Scroll Reveal observer to trigger elegant reveal-on-scroll classes
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add("active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );

    revealElements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Play / Stop synthesized vibe preview
  const handleToggleVibe = (vibeId: string) => {
    if (currentlyPlaying === vibeId) {
      stopWeddingVibe();
      setCurrentlyPlaying(null);
      setPlayingNote("");
    } else {
      setCurrentlyPlaying(vibeId);
      playWeddingVibe(vibeId, (note) => {
        setPlayingNote(note);
      });
    }
  };

  // Generate Custom Curation Plan from Widget
  const handleStartCurating = (e: React.FormEvent) => {
    e.preventDefault();
    const plan = curationTemplates[inquiry.vibe] || curationTemplates["Elegant Classical"];
    setCustomPlan({
      ...plan,
      guests: inquiry.guests,
      date: inquiry.date,
      venue: inquiry.venue,
      format: inquiry.format,
    });
    setIsBespokeModalOpen(true);
  };

  // Booking Consultation Submission
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultationSuccess(true);
    setTimeout(() => {
      setConsultationSuccess(false);
      setIsConsultationModalOpen(false);
      setIsBespokeModalOpen(false);
      // Reset form
      setConsultationForm({ name: "", email: "", phone: "", notes: "" });
    }, 3000);
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // What We Do Dataset
  const whatWeDoList = [
    {
      id: "curate",
      title: "Curate & coordinate",
      subtitle: "BESPOKE SELECTION",
      description: "We find and book the right musicians and artists, tailored to your style, sound, and the story you want to tell.",
      image: "https://i.ibb.co/NgBhXxz4/19be43ad868b901396c6aac18ba5cca8.jpg",
      rating: "BESPOKE SELECTION",
      meta: "Complete Artist Curation",
      details: [
        "In-depth repertoire matching and custom chord arrangements.",
        "Sourcing and managing specialized regional folk & cultural ensembles.",
        "Curated playlists for live artist rest periods.",
        "Coordination of custom request pieces and first dance arrangement sheets."
      ]
    },
    {
      id: "manage",
      title: "Manage every detail",
      subtitle: "ABSOLUTE CARE",
      description: "Artists, performances, soundcheck, payments, communication, transitions — we oversee it all for a seamless, well-timed celebration.",
      image: "https://i.ibb.co/cSxsknqL/03ab03d3d4ddc645134259c0e31dbe11.jpg",
      rating: "ABSOLUTE CARE",
      meta: "Seamless Logistical Support",
      details: [
        "On-site sound engineer coordination and acoustic tuning.",
        "Strict compliance with timing and cue sheets for transition moments.",
        "Direct artist payment disbursement and contract processing.",
        "Backstage setup, greenroom coordination, and power backup checks."
      ]
    },
    {
      id: "personal",
      title: "Make it personal",
      subtitle: "COUPLES-FIRST",
      description: "We curate music that feels true to every couple and family, creating a completely stress-free experience.",
      image: "https://i.ibb.co/TDSShcMS/fc63bae02aae04ee599a47099c1d48fb.jpg",
      rating: "COUPLES-FIRST",
      meta: "Acoustic Customization",
      details: [
        "Detailed one-on-one sessions with Temsu Clover and Abdon Mech.",
        "Dedicated revision loops for ceremonial transition cue points.",
        "Bespoke music score printouts on premium cotton paper keepsake.",
        "Coordination of family performances with custom guidance."
      ]
    }
  ];

  // Moments Dataset
  const momentsList = [
    { id: "ceremony", title: "The Ceremony", vibe: "ceremony", track: "Symphonique Entrance (Live Strings)", img: "https://i.ibb.co/0VfVB7MD/3a8e964c0503bbe25312cfd4ec912150.jpg" },
    { id: "aisle", title: "The Aisle Walk", vibe: "aisle", track: "Canon Reimagined (Solo Viola & Harp)", img: "https://i.ibb.co/JRQnJSFC/1d22db98984ba67f388ce17913305b08.jpg" },
    { id: "firstDance", title: "The First Dance", vibe: "firstDance", track: "Lush Waltz in A Major (Plucked Ambient)", img: "https://i.ibb.co/ymR0Gd9T/d0071b8f3813e6e0600276c5feaf81d3.jpg" },
    { id: "reception", title: "The Reception", vibe: "reception", track: "Polished Swing (Late Night Acoustic Trio)", img: "https://i.ibb.co/Q3R0VfRb/efd48d420ef8c0bcd8db92b185e011e7.jpg" },
    { id: "cultural", title: "Traditional & Cultural", vibe: "cultural", track: "Folk Resonance (Naga Bamboo Flute Tribute)", img: "https://i.ibb.co/v6DQgNKK/bb78682297531d654820a1cd42d3974b.jpg" },
    { id: "party", title: "The After-Party", vibe: "party", track: "Retro Groove Synth (Joyous Dance Anthem)", img: "https://i.ibb.co/cGPbfQR/ee148175cbe7bf175272f6771b89105a.jpg" },
  ];

  // Subtle Parallax offset calculation for overlapping image container
  const storyParallaxStyle = {
    transform: `translateY(${Math.max(-40, Math.min(40, scrollYOffset * 0.05 - 30))}px)`,
    transition: "transform 0.1s ease-out"
  };

  const storyForegroundStyle = {
    transform: `translateY(${Math.max(-25, Math.min(25, -scrollYOffset * 0.03 + 20))}px)`,
    transition: "transform 0.1s ease-out"
  };

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-gold selection:text-wine font-sans antialiased overflow-x-hidden">
      
      {/* 0 · NAVIGATION (Fixed sticky with responsive styling class mapping) */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-xl border-b border-gold/15 py-4 text-wine shadow-premium"
            : "bg-transparent py-6 text-wine"
        }`}
      >
        <div className="max-w-[1180px] mx-auto px-6 md:px-10 flex items-center justify-between">
          
          {/* Logo Brand with circular Q wax seal motif */}
          <button
            onClick={() => handleScrollToSection("hero")}
            className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
          >
            <WaxSealMonogram size="sm" />
            <span className="font-serif italic text-2xl md:text-3xl font-semibold tracking-wide text-wine">
              Q'rate
            </span>
          </button>

          {/* Nav Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium tracking-wide text-wine">
            <button
              onClick={() => handleScrollToSection("story")}
              className="hover:text-gold transition-colors relative group py-1"
            >
              Our Story
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full`}></span>
            </button>
            <button
              onClick={() => handleScrollToSection("what-we-do")}
              className="hover:text-gold transition-colors relative group py-1"
            >
              What we do
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full`}></span>
            </button>
            <button
              onClick={() => handleScrollToSection("why-us")}
              className="hover:text-gold transition-colors relative group py-1"
            >
              Why us
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full`}></span>
            </button>
            <button
              onClick={() => handleScrollToSection("moments")}
              className="hover:text-gold transition-colors relative group py-1"
            >
              The moments
              <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full`}></span>
            </button>
          </div>

          {/* Right Action Consultation CTA */}
          <div className="hidden md:flex items-center">
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="bg-gold text-wine hover:bg-gold-soft hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 font-medium tracking-wide text-xs px-6 py-3 rounded-full shadow-premium uppercase"
            >
              Book a consultation
            </button>
          </div>

          {/* Mobile hamburger toggle (under 860px) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-full border border-current hover:bg-wine/10 transition-colors"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-gold/15 py-6 px-6 shadow-premium md:hidden transition-all duration-300 flex flex-col space-y-4">
            <button
              onClick={() => handleScrollToSection("story")}
              className="text-left py-2 border-b border-gold/10 text-wine hover:text-gold transition-colors text-sm font-medium"
            >
              Our Story
            </button>
            <button
              onClick={() => handleScrollToSection("what-we-do")}
              className="text-left py-2 border-b border-gold/10 text-wine hover:text-gold transition-colors text-sm font-medium"
            >
              What we do
            </button>
            <button
              onClick={() => handleScrollToSection("why-us")}
              className="text-left py-2 border-b border-gold/10 text-wine hover:text-gold transition-colors text-sm font-medium"
            >
              Why us
            </button>
            <button
              onClick={() => handleScrollToSection("moments")}
              className="text-left py-2 border-b border-gold/10 text-wine hover:text-gold transition-colors text-sm font-medium"
            >
              The moments
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsConsultationModalOpen(true);
              }}
              className="bg-gold text-wine hover:bg-gold-soft text-center font-medium text-xs py-3 rounded-full shadow-premium uppercase mt-2 block"
            >
              Book a consultation
            </button>
          </div>
        )}
      </nav>

      {/* 1 · HERO (Full-bleed wine image, Ken Burns zoom, slow drifting gold petals) */}
      <section id="hero" className="relative pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 px-3 sm:px-4 md:px-8 bg-white">
        <div className="max-w-[1180px] mx-auto relative">
          
          {/* Main Hero Container */}
          <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-wine-deep via-wine to-[#2A0812] text-white py-12 sm:py-20 md:py-24 px-4 sm:px-6 md:px-16 shadow-premium border border-gold/10 min-h-[440px] sm:min-h-[520px] flex items-center justify-center">
            
            {/* Background Image with slow elegant Ken Burns scaling */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="w-full h-full ken-burns opacity-20">
                <SafeImage
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"
                  alt="Live romantic wedding performance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0812] via-transparent to-wine-deep/75"></div>
            </div>

            {/* Falling gold petals layer */}
            <FallingPetals />

            {/* Content box */}
            <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">

              {/* Eyebrow */}
              <span className="text-gold text-[8px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.28em] mb-2 sm:mb-3 block">
                WEDDING MUSIC CURATION &middot; NAGALAND
              </span>

              {/* Heading */}
              <h1 className="font-serif font-bold sm:font-semibold text-[38px] sm:text-4xl md:text-5xl lg:text-[56px] leading-[1.15] sm:leading-[1.15] mb-4 sm:mb-5 tracking-tight text-shadow-elegant max-w-[340px] sm:max-w-none">
                We curate music <br className="block sm:hidden" /> for your <span className="text-gold-soft italic font-normal font-serif">wedding</span>
              </h1>

              {/* Description body */}
              <p className="font-sans font-light text-xs sm:text-sm md:text-base text-ivory/80 max-w-[280px] sm:max-w-md md:max-w-lg leading-relaxed mb-6 sm:mb-8 text-balance">
                A seamless musical experience,<br className="block sm:hidden" /> designed note by note around your story.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
                <button
                  onClick={() => setIsConsultationModalOpen(true)}
                  className="bg-gold text-wine hover:bg-gold-soft hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 font-semibold px-5 py-2 sm:px-6 sm:py-3.5 rounded-full shadow-premium w-auto min-w-[160px] sm:min-w-0 text-[10px] sm:text-xs tracking-wider uppercase"
                >
                  Book a consultation
                </button>
                <button
                  onClick={() => handleScrollToSection("moments")}
                  className="border border-gold/40 text-gold hover:border-gold hover:bg-gold/5 hover:-translate-y-0.5 transition-all duration-300 font-medium px-5 py-2 sm:px-6 sm:py-3.5 rounded-full w-auto min-w-[160px] sm:min-w-0 text-[10px] sm:text-xs tracking-wider uppercase"
                >
                  See our work
                </button>
              </div>

              {/* Artist credit details */}
              <p className="mt-6 sm:mt-8 text-[10px] sm:text-xs font-sans text-ivory/50 tracking-wider">
                A company run by artists — <span className="text-gold">Temsu Clover &amp; Abdon Mech</span>
              </p>
            </div>
          </div>

          {/* Floating Inquiry Widget (Re-imagined search bar) */}
          <div className="relative z-20 mt-6 sm:-mt-12 md:-mt-16 max-w-4xl mx-auto px-4 reveal-on-scroll">
            <div className="bg-white/95 backdrop-blur-xl border border-gold/20 rounded-[24px] sm:rounded-3xl shadow-premium p-4 sm:p-6 md:p-8">
              
              {/* Form Category pill tabs */}
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 md:space-x-4 mb-4 sm:mb-6">
                {(["Full wedding", "Ceremony", "Reception"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setInquiry({ ...inquiry, format: tab })}
                    className={`px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      inquiry.format === tab
                        ? "bg-wine text-gold shadow-premium"
                        : "text-muted hover:text-wine bg-ivory-alt hover:bg-ivory"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Widget Inquiry Form */}
              <form onSubmit={handleStartCurating} className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4 items-end">
                
                {/* Field 1: Wedding Date */}
                <div className="flex flex-col space-y-1 sm:space-y-1.5">
                  <label className="text-[8.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1 sm:gap-1.5">
                    <Calendar className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold" /> Wedding Date
                  </label>
                  <input
                    type="date"
                    required
                    value={inquiry.date}
                    onChange={(e) => setInquiry({ ...inquiry, date: e.target.value })}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink"
                  />
                </div>

                {/* Field 2: Venue / Location */}
                <div className="flex flex-col space-y-1 sm:space-y-1.5">
                  <label className="text-[8.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1 sm:gap-1.5">
                    <MapPin className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold" /> Venue / Location
                  </label>
                  <select
                    value={inquiry.venue}
                    onChange={(e) => setInquiry({ ...inquiry, venue: e.target.value })}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink"
                  >
                    <option value="Kohima, Nagaland">Kohima, Nagaland</option>
                    <option value="Dimapur, Nagaland">Dimapur, Nagaland</option>
                    <option value="Mokokchung, Nagaland">Mokokchung, Nagaland</option>
                    <option value="Shillong, Meghalaya">Shillong, Meghalaya</option>
                    <option value="Guwahati, Assam">Guwahati, Assam</option>
                    <option value="Bespoke Destination">Other Destination</option>
                  </select>
                </div>

                {/* Field 3: Guest Count */}
                <div className="flex flex-col space-y-1 sm:space-y-1.5">
                  <label className="text-[8.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1 sm:gap-1.5">
                    <Users className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold" /> Guest Count
                  </label>
                  <select
                    value={inquiry.guests}
                    onChange={(e) => setInquiry({ ...inquiry, guests: e.target.value })}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink"
                  >
                    <option value="Under 100">Intimate (Under 100)</option>
                    <option value="100 - 300">Moderate (100 - 300)</option>
                    <option value="300 - 500">Classic Grand (300 - 500)</option>
                    <option value="500+">Massive Celebration (500+)</option>
                  </select>
                </div>

                {/* Field 4: Style / Vibe */}
                <div className="flex flex-col space-y-1 sm:space-y-1.5">
                  <label className="text-[8.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-muted flex items-center gap-1 sm:gap-1.5">
                    <Music className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-gold" /> Style / Vibe
                  </label>
                  <select
                    value={inquiry.vibe}
                    onChange={(e) => setInquiry({ ...inquiry, vibe: e.target.value })}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink"
                  >
                    <option value="Elegant Classical">Elegant Classical</option>
                    <option value="Choral & Gospel">Choral &amp; Gospel</option>
                    <option value="Indie Folk & Acoustic">Indie Folk &amp; Acoustic</option>
                    <option value="Contemporary Jazz & Pop">Contemporary Jazz &amp; Pop</option>
                    <option value="Romantic String Quartet">Romantic String Quartet</option>
                  </select>
                </div>

                {/* Action button */}
                <div className="md:col-span-4 mt-3 sm:mt-4">
                  <button
                    type="submit"
                    className="w-full bg-wine text-gold hover:bg-wine-hover hover:shadow-premium-hover transition-all duration-300 font-semibold uppercase tracking-wider text-xs sm:text-sm py-3 sm:py-4 rounded-xl flex items-center justify-center gap-2 shadow-premium"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Start curating
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · OUR STORY / PHILOSOPHY (White cardstock paper-grain background + delicate gold botanical) */}
      <section id="story" className="py-14 md:py-18 bg-white px-6 md:px-10 relative">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Overlapping Parallax Dual Image Construction */}
          <div className="relative h-[480px] w-full max-w-md mx-auto lg:max-w-none">
            {/* Delicate decorative gold floral laurel ring behind cards */}
            <div className="absolute top-8 right-6 w-44 h-44 border border-gold/15 rounded-full -z-10 flex items-center justify-center">
              <svg className="w-24 h-24 text-gold/20" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                <circle cx="50" cy="50" r="40" strokeDasharray="3,3" />
              </svg>
            </div>
            
            {/* Portrait Image (Slow parallax down) */}
            <div 
              style={storyParallaxStyle}
              className="absolute top-0 left-0 right-0 mx-auto w-[330px] sm:w-[380px] h-[330px] sm:h-[380px] rounded-2xl overflow-hidden shadow-premium border border-gold/10 transition-transform z-10 bg-white"
            >
              <SafeImage
                src="https://i.ibb.co/yF71kFzg/e334d4ffe873184bfcc6cc177cd53312.jpg"
                alt="Elegant bridal details and white roses"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Landscape Image (Parallax slightly up) */}
            <div 
              style={storyForegroundStyle}
              className="absolute bottom-2 left-[20%] sm:left-auto right-[20%] sm:right-[10%] lg:right-[15%] w-[60%] sm:w-[55%] lg:w-[60%] h-[220px] sm:h-[240px] lg:h-[270px] rounded-2xl overflow-hidden shadow-premium border border-gold/10 transition-transform z-20 bg-white"
            >
              <SafeImage
                src="https://i.ibb.co/kstY8RNF/2cafa02dea0441d48eda9e806a998d0e.jpg"
                alt="Microphone acoustic setup"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right Text Column */}
          <div className="flex flex-col items-start justify-center reveal-on-scroll">
            
            {/* Eyebrow and floral garnish */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em]">
                The Q'rate philosophy
              </span>
              <svg className="w-4 h-4 text-gold opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M50,20 C40,40 20,50 50,85 C80,50 60,40 50,20 Z" />
              </svg>
            </div>

            {/* Custom Tab selectors */}
            <div className="flex space-x-6 border-b border-gold/15 pb-2.5 mb-5 w-full">
              {(["story", "approach", "promise"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStoryTab(tab)}
                  className={`text-xs sm:text-sm font-semibold tracking-wide capitalize pb-1 transition-all duration-300 relative ${
                    activeStoryTab === tab ? "text-wine" : "text-muted hover:text-wine"
                  }`}
                >
                  {tab === "story" ? "Our story" : tab === "approach" ? "Our approach" : "Our promise"}
                  {activeStoryTab === tab && (
                    <span className="absolute bottom-[-11px] left-0 w-full h-[2.5px] bg-gold animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Title heading */}
            <h2 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl text-ink leading-[1.15] mb-4 tracking-tight">
              Driven by music, <span className="text-gold italic font-normal font-serif">powered by experience</span>.
            </h2>

            {/* Description Text paragraphs - Flat solid color #5A4A40 */}
            <div className="font-sans font-light text-muted leading-relaxed text-[13.5px] sm:text-base mb-4 space-y-3">
              {activeStoryTab === "story" && (
                <p>
                  We believe your wedding deserves more than a playlist. Music is what people feel long after the day is over — the walk down the aisle, the first dance, the moment the room falls quiet. We design every musical moment so your celebration feels intentional, emotional, and entirely your own.
                </p>
              )}
              {activeStoryTab === "approach" && (
                <p>
                  Our curation system is completely artist-led. As experienced, working instrumentalists, we analyze the acoustic footprint of your venue, design custom transition timing sheets, and select performers with genuine soul. We avoid clinical talent-agency algorithms in favor of hand-selected perfection.
                </p>
              )}
              {activeStoryTab === "promise" && (
                <p>
                  We guarantee absolute punctuality, professional, stress-free communication, and a cohesive acoustic design that flows gracefully. No jarring silences, no technical hitches. Just a masterfully managed, deeply evocative soundtrack from the first guest's arrival to the final note of the evening.
                </p>
              )}
            </div>

            {/* Premium Gilded Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 w-full">
              {activeStoryTab === "story" && (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Sparkle className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Direct Artist Curation</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      Hand-selected by Temsu Clover & Abdon Mech to align perfectly with your unique aesthetic.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Music className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Bespoke Orchestration</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      Custom acoustic arrangements written specifically for your chosen instrumental lineup.
                    </p>
                  </div>
                </>
              )}

              {activeStoryTab === "approach" && (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Acoustic Calibration</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      We analyze the architecture and sound dispersion of your venue to guarantee pristine acoustic balance.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Cue-Sheet Syncing</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      Second-by-second musical cues perfectly timed with your coordinator's master wedding schedule.
                    </p>
                  </div>
                </>
              )}

              {activeStoryTab === "promise" && (
                <>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Jarless Transition Flow</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      Zero awkward silences or rough audio handovers. A continuously moving beautiful soundscape.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-gold/15 shadow-sm hover:border-gold/30 transition-all duration-300">
                    <div className="flex items-center space-x-2.5 mb-2">
                      <div className="w-7 h-7 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-serif font-medium text-[13px] sm:text-sm text-wine tracking-tight">Verified Premium Roster</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted/90 font-sans leading-relaxed">
                      Direct collaboration only with Nagaland’s most respected, professional, and punctual session artists.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Founder Quote Signoff & Action button inline */}
            <div className="w-full border-t border-gold/10 pt-4 mt-5 flex flex-col sm:flex-row sm:items-center justify-start gap-x-8 gap-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-wine/5 flex items-center justify-center font-serif italic text-xs text-wine font-semibold border border-wine/10">
                  Q
                </div>
                <div>
                  <p className="text-[11px] sm:text-xs italic font-serif text-wine font-medium">"A curation as unique as your vows."</p>
                  <p className="text-[9px] sm:text-[10px] font-sans text-muted uppercase tracking-wider">Temsu Clover &amp; Abdon Mech &middot; Founders</p>
                </div>
              </div>

              {/* Action pill button */}
              <button
                onClick={() => setIsConsultationModalOpen(true)}
                className="bg-wine text-gold hover:bg-wine-hover hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 font-semibold px-6 py-2.5 sm:px-8 sm:py-3.5 rounded-full shadow-premium text-[10px] sm:text-xs uppercase tracking-wider self-start sm:self-auto"
              >
                Learn more
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · WHAT WE DO (Subtle wine-tinted band #F6EFEA) */}
      <section id="what-we-do" className="py-14 md:py-18 bg-white px-6 md:px-10">
        <div className="max-w-[1020px] mx-auto">
          
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 reveal-on-scroll">
            <div className="flex items-center justify-center space-x-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M50,20 C40,45 15,50 50,85 C85,50 60,45 50,20 Z" />
              </svg>
              <span className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em]">
                What we do
              </span>
            </div>
            <h2 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Music, handled completely.
            </h2>
          </div>

          {/* Cards Grid - Styled like high-end curated listings (no card background boxes, clean portrait images with rounded corners, and clear text flow underneath) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {whatWeDoList.map((item) => {
              // Custom metadata and price labels for the luxury curated style
              const metaInfo = item.id === "curate" 
                ? { 
                  service: "Bespoke Artist Roster", 
                  focus: "Full-day Curation & Live sets",
                  price: "₹1,25,000",
                  unit: "event",
                  ratingText: "★ 5.0 (Featured)",
                  btnLabel: "Book Curation"
                }
                : item.id === "manage"
                ? { 
                  service: "Logistical Live Support", 
                  focus: "Stage, Sound & Cue-sheet sync",
                  price: "₹85,000",
                  unit: "day",
                  ratingText: "★ 4.9 (Verified)",
                  btnLabel: "Book Logistics"
                }
                : { 
                  service: "Custom Audio Arranging", 
                  focus: "Ceremonial Walk & Vows Scoring",
                  price: "₹45,000",
                  unit: "session",
                  ratingText: "★ 5.0 (Popular)",
                  btnLabel: "Book Vows"
                };

              // Staggered aspect ratios for masonry effect like the Popular Tourist Spots screenshot
              const imageAspect = item.id === "curate"
                ? "aspect-[4/3]"      // Santorini style: short landscape
                : item.id === "manage"
                ? "aspect-[1/1.1]"    // Amalfi style: medium vertical-ish
                : "aspect-[3/4.25]";  // Dubrovnik style: tall portrait

              return (
                <div
                  key={item.id}
                  className="group flex flex-col h-full reveal-on-scroll max-w-[290px] xs:max-w-[320px] md:max-w-none mx-auto w-full"
                >
                  {/* Portrait Image with rounded corners and staggered aspect ratio */}
                  <div className={`w-full ${imageAspect} relative overflow-hidden rounded-[20px] shadow-sm bg-ivory border border-gold/10`}>
                    <div className="w-full h-full transform group-hover:scale-104 transition-transform duration-700 ease-out">
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Curated Content flowing beautifully underneath the image */}
                  <div className="pt-4 sm:pt-5 flex flex-col flex-grow justify-between">
                    <div>
                      {/* First Line: Title and Rating side-by-side */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-serif font-semibold text-lg sm:text-xl text-ink tracking-tight leading-snug group-hover:text-wine transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center text-gold font-sans font-medium text-[10px] sm:text-xs whitespace-nowrap mt-1">
                          {metaInfo.ratingText}
                        </div>
                      </div>

                      {/* Metadata Specs formatted like location/duration in high-end designs */}
                      <div className="space-y-1 sm:space-y-1.5 mb-3">
                        <div className="text-[11px] sm:text-xs font-sans text-muted leading-relaxed">
                          <span className="font-medium text-ink/75">Service: </span>
                          {metaInfo.service}
                        </div>
                        <div className="text-[11px] sm:text-xs font-sans text-muted leading-relaxed">
                          <span className="font-medium text-ink/75">Focus: </span>
                          {metaInfo.focus}
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="font-sans font-light text-muted text-[11px] sm:text-xs leading-relaxed mb-4 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div>
                      {/* Bottom Row: Price on left, solid CTA on right */}
                      <div className="w-full pt-2 pb-1 flex items-center justify-between">
                        <div>
                          <span className="font-serif font-bold text-lg sm:text-xl text-wine">{metaInfo.price}</span>
                          <span className="text-[9px] sm:text-[10px] font-sans text-muted uppercase tracking-wider ml-1">/{metaInfo.unit}</span>
                        </div>
                        <button
                          onClick={() => setActiveWhatWeDoDetail(item.id)}
                          className="bg-wine text-gold hover:bg-wine-hover active:scale-98 transition-all duration-300 font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full shadow-sm hover:shadow-md text-[9px] sm:text-[10px] uppercase tracking-wider"
                        >
                          {metaInfo.btnLabel}
                        </button>
                      </div>

                      {/* Add premium designs below the button row for shorter cards */}
                      {item.id === "curate" && (
                        <div className="mt-4 pt-4 sm:mt-5 sm:pt-5 border-t border-gold/15 flex flex-col items-start text-left animate-fade-in">
                          {/* Elegant left-bordered quote */}
                          <div className="border-l-2 border-gold/40 pl-3.5 mb-3.5">
                            <blockquote className="font-serif italic text-[11px] sm:text-[11.5px] text-ink/85 leading-relaxed max-w-[250px] mb-2">
                              "Every live score is custom-arranged, ensuring a flawless sonic transition that mirrors your heartbeat."
                            </blockquote>
                            {/* Author signature detail */}
                            <div className="font-sans text-[8px] sm:text-[9px] tracking-wider text-muted font-light uppercase">
                              — Temsu Clover, <span className="text-gold-soft font-serif italic text-[9px] sm:text-[10px] font-normal lowercase">musical director</span>
                            </div>
                          </div>
                          
                          {/* Premium Gold badge below */}
                          <div className="rounded bg-gold/5 border border-gold/20 px-2 py-0.5 flex items-center space-x-1.5 shadow-[inset_0_1px_3px_rgba(181,138,75,0.05)]">
                            <span className="text-gold text-[7px] animate-pulse">✦</span>
                            <span className="font-serif font-medium tracking-[0.12em] text-[8px] text-gold uppercase">Artist's Signature Curation</span>
                          </div>
                        </div>
                      )}

                      {item.id === "manage" && (
                        <div className="mt-4 pt-4 border-t border-gold/15 flex flex-col items-start text-left animate-fade-in">
                          {/* Elegant left-bordered quote */}
                          <div className="border-l-2 border-gold/30 pl-3 mb-3">
                            <p className="font-serif italic text-[10.5px] sm:text-[11px] text-ink/80 leading-relaxed max-w-[240px]">
                              "Zero delays, pure emotion. We mic every single sigh, whisper, and guitar strum perfectly."
                            </p>
                          </div>
                          
                          {/* Small elegant gold badge */}
                          <div className="rounded bg-wine/5 border border-wine/10 px-2.5 py-0.5 flex items-center space-x-1 shadow-[inset_0_1px_2px_rgba(42,8,18,0.02)]">
                            <span className="font-sans font-medium tracking-[0.12em] text-[7.5px] text-wine uppercase">On-Site Precision Protocol</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Scrolling Marquee ticker - FULL VIEWPORT WIDTH (Larger & moved before Why Choose Us) */}
      <div className="overflow-hidden relative w-full py-10 border-t border-b border-gold/10 bg-ivory-alt/35 flex items-center select-none mt-6 mb-2">
        <div className="flex space-x-12 animate-marquee whitespace-nowrap">
          {/* Set of 7 slow scrolling micro-images of weddings and instruments */}
          {[
            "https://i.ibb.co/5hgpYb4h/087eee1fb4fa4ceb341175934b134e25.jpg",
            "https://i.ibb.co/1N7XPm2/f588c94ed25c7ad584723f28359f9af8.jpg",
            "https://i.ibb.co/G4dS5dRx/829b2eb69b8993e690c82cb88af71377.jpg",
            "https://i.ibb.co/DPg7xCWL/389143750c16ad2f77a35842efafa9b1.jpg",
            "https://i.ibb.co/N2Thff9p/28641f9305a7e22fe6e29fc142299c04.jpg",
            "https://i.ibb.co/W448405w/476ddbbaf91065f93ad0f6888e50e9dc.jpg",
            "https://i.ibb.co/wN78qWYk/40-Effortlessly-Casual-Wedding-Ideas-for-Laid-Back-Couples.jpg"
          ].map((imgSrc, idx) => (
            <div key={idx} className="inline-block w-64 h-44 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:scale-[1.03] transition-all duration-300">
              <SafeImage src={imgSrc} alt="Wedding sound setup details" className="w-full h-full object-cover" />
            </div>
          ))}
          {/* Duplicate set for perfect wrapping loop */}
          {[
            "https://i.ibb.co/5hgpYb4h/087eee1fb4fa4ceb341175934b134e25.jpg",
            "https://i.ibb.co/1N7XPm2/f588c94ed25c7ad584723f28359f9af8.jpg",
            "https://i.ibb.co/G4dS5dRx/829b2eb69b8993e690c82cb88af71377.jpg",
            "https://i.ibb.co/DPg7xCWL/389143750c16ad2f77a35842efafa9b1.jpg",
            "https://i.ibb.co/N2Thff9p/28641f9305a7e22fe6e29fc142299c04.jpg",
            "https://i.ibb.co/W448405w/476ddbbaf91065f93ad0f6888e50e9dc.jpg",
            "https://i.ibb.co/wN78qWYk/40-Effortlessly-Casual-Wedding-Ideas-for-Laid-Back-Couples.jpg"
          ].map((imgSrc, idx) => (
            <div key={`dup-${idx}`} className="inline-block w-64 h-44 rounded-2xl overflow-hidden border border-gold/10 hover:border-gold/30 hover:scale-[1.03] transition-all duration-300">
              <SafeImage src={imgSrc} alt="Wedding sound setup details" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Centred sprig divider above Why Choose Us */}
      <SectionDividerSprig />

      {/* 4 · WHY CHOOSE US (White cards with ghost outline numerals behind) */}
      <section id="why-us" className="pt-6 pb-14 md:pt-8 md:pb-18 bg-white px-3 sm:px-6 md:px-10">
        <div className="max-w-[1180px] mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-20 reveal-on-scroll">
            <div className="flex items-center justify-center space-x-1.5 mb-2">
              <svg className="w-3.5 h-3.5 text-gold" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M50,20 C40,45 15,50 50,85 C85,50 60,45 50,20 Z" />
              </svg>
              <span className="text-gold text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.28em]">
                Why choose us
              </span>
            </div>
            <h2 className="font-serif font-semibold text-2xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Why couples choose Q'rate.
            </h2>
          </div>

          {/* Grid with 6 beautifully decorated white cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {[
              { num: "01", title: "Musician-led curation", desc: "As professional musicians, we understand timing, emotion, and flow — not just playlists." },
              { num: "02", title: "End-to-end communication", desc: "A single, highly dependable point of contact, from the first call to the final song." },
              { num: "03", title: "On-site coordination", desc: "We oversee every acoustic cue, mic transition, and technical detail so the day runs flawlessly." },
              { num: "04", title: "Professional & dependable", desc: "Clear communication, strict punctuality, and warm customer care — so you live your day stress-free." },
              { num: "05", title: "A quality experience", desc: "Creating a bespoke, elegant auditory atmosphere you and your guests will remember long after." },
              { num: "06", title: "Tailored to your story", desc: "Every song selection is meticulously personalized to reflect your backgrounds, culture, and mood." },
            ].map((card, i) => {
              // High-fashion luxury brand color gradients
              const gradients = [
                "from-[#3D0C1A] via-[#1E050C] to-[#0A0104]", // Imperial Amethyst/Wine
                "from-[#0A2616] via-[#04130A] to-[#010603]", // Emerald/Teal Forest
                "from-[#0A1F3D] via-[#040E1E] to-[#01040A]", // Royal Sapphire
                "from-[#42250F] via-[#1F1005] to-[#0A0501]", // Tobacco/Cognac Amber
                "from-[#24133A] via-[#11081D] to-[#050209]", // Midnight Mulberry
                "from-[#2D2D30] via-[#151516] to-[#070707]"  // Obsidian Charcoal
              ];

              const glowColors = [
                "bg-rose-500/20",
                "bg-emerald-500/20",
                "bg-cyan-500/20",
                "bg-amber-500/20",
                "bg-purple-500/20",
                "bg-gold-soft/20"
              ];

              const categories = [
                "THE ARTISTRY",
                "THE SYNC",
                "THE RHYTHM",
                "THE ASSURANCE",
                "THE ATMOSPHERE",
                "THE SIGNATURE"
              ];

              const cardImages = [
                "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=400", // live music performer
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400", // communication/couple
                "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=400", // table setup coordinator
                "https://i.ibb.co/NnVbF9Qy/346b811aa470ba6ca70b7299e1d7c18b.jpg", // dependable ceremony venue setup
                "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400", // beautiful atmospheric wedding venue lighting
                "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=400"  // record player/tailored story
              ];

              const blendGradients = [
                "from-[#1E050C] via-[#1E050C]/90 to-[#1E050C]/10", // blends with Imperial Amethyst
                "from-[#04130A] via-[#04130A]/90 to-[#04130A]/10", // Emerald Forest
                "from-[#040E1E] via-[#040E1E]/90 to-[#040E1E]/10", // Royal Sapphire
                "from-[#1F1005] via-[#1F1005]/90 to-[#1F1005]/10", // Tobacco Amber
                "from-[#11081D] via-[#11081D]/90 to-[#11081D]/10", // Midnight Mulberry
                "from-[#151516] via-[#151516]/90 to-[#151516]/10"  // Obsidian Charcoal
              ];

              return (
                <div
                  key={i}
                  className={`group relative bg-gradient-to-b ${gradients[i]} border border-gold/15 hover:border-gold/35 rounded-2xl shadow-premium hover:shadow-[0_24px_50px_rgba(181,138,75,0.18)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden reveal-on-scroll h-[210px] xs:h-[235px] sm:h-[260px] md:h-[290px]`}
                >
                  {/* Top Image with Seamless Mask Blending (Smaller top height) */}
                  <div 
                    className="absolute top-0 inset-x-0 h-[50px] sm:h-[90px] overflow-hidden pointer-events-none z-0"
                    style={{
                      maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 100%)",
                      WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0) 100%)"
                    }}
                  >
                    <SafeImage
                      src={cardImages[i]}
                      alt={card.title}
                      className="w-full h-full object-cover opacity-35 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000 ease-out"
                    />
                  </div>

                  {/* Outer premium glass reflections */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70px,rgba(255,255,255,0.04),transparent_50%)] pointer-events-none z-10"></div>

                  {/* Ambient Backlight Glow spot at the bottom right */}
                  <div className={`absolute -right-12 -bottom-12 w-40 h-40 ${glowColors[i]} rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none z-0`}></div>

                  {/* Massive background watermark typography */}
                  <span className="absolute bottom-4 right-4 font-serif italic font-black text-6xl text-gold/[0.015] select-none group-hover:text-gold/[0.035] group-hover:scale-105 transition-all duration-700 pointer-events-none z-0">
                    {card.num}
                  </span>

                  {/* Content Elements - overlaying beautifully over the absolute image and dark gradient base */}
                  <div className="relative z-10 w-full h-full flex flex-col justify-between p-3 sm:p-5 md:p-6">
                    {/* Category Meta Tag & Section ID */}
                    <div className="flex items-center justify-between w-full mb-0.5 sm:mb-1">
                      <div className="flex items-center space-x-1 sm:space-x-1.5">
                        <span className="text-gold text-[5px] sm:text-[7px] animate-pulse">✦</span>
                        <span className="font-serif font-medium text-[7px] sm:text-[8px] tracking-[0.12em] sm:tracking-[0.2em] text-gold-soft uppercase">{categories[i]}</span>
                      </div>
                      <span className="font-mono text-[7px] sm:text-[8px] text-white/35 tracking-wider uppercase">SEC {card.num}</span>
                    </div>

                    {/* Main Title, Num, and Desc Block */}
                    <div className="flex-grow flex flex-col justify-end">
                      {/* Stylized floating number index */}
                      <div className="font-serif italic text-xs sm:text-lg md:text-xl text-gold-soft/80 font-light mb-0 sm:mb-0.5 select-none transition-transform duration-500 group-hover:translate-x-1">
                        {card.num}
                      </div>

                      {/* Heading (Slightly larger and premium typography) */}
                      <h3 className="font-serif font-medium text-[10px] xs:text-[11.5px] sm:text-base md:text-[18px] text-white tracking-tight leading-snug group-hover:text-gold transition-colors duration-300">
                        {card.title}
                      </h3>

                      {/* Extremely delicate separator line */}
                      <div className="w-4 sm:w-6 h-[1px] bg-gradient-to-r from-gold/30 to-transparent my-1 sm:my-1.5 group-hover:w-12 transition-all duration-500"></div>

                      {/* Description with enhanced fine line readability (Slightly larger font size) */}
                      <p className="font-sans font-light text-white/75 text-[8.5px] xs:text-[10px] sm:text-[12.5px] md:text-[13.5px] leading-normal sm:leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5 · THE MOMENTS (Immersive Cinematic Center - Styled in full flowing white background) */}
      <section id="moments" className="py-14 md:py-18 bg-white text-ink px-6 md:px-10 relative">
        
        {/* Subtle radial overlay for warmth */}
        <div className="absolute inset-0 bg-radial-gradient from-gold/5 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-[1180px] mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.28em] block mb-3">
              Every moment
            </span>
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              The moments we score.
            </h2>
            <p className="font-sans font-light text-muted text-sm mt-3 leading-relaxed">
              Click any category card below to listen to our custom live-synthesized arrangement streams.
            </p>
          </div>

          {/* Mixed columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {momentsList.map((moment, index) => {
              // Staggered col-spans to perfectly fill the 3-column layout without any blank spaces or gaps:
              // Row 1: Ceremony (2) + Aisle Walk (1) = 3
              // Row 2: First Dance (1) + Reception (2) = 3
              // Row 3: Traditional & Cultural (2) + The After-Party (1) = 3
              const spanClass = (index === 0 || index === 3 || index === 4)
                ? "md:col-span-2 h-[320px]"
                : "md:col-span-1 h-[320px]";
              const isPlaying = currentlyPlaying === moment.vibe;

              return (
                <div
                  key={moment.id}
                  onClick={() => handleToggleVibe(moment.vibe)}
                  className={`group relative rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover cursor-pointer transition-all duration-500 transform hover:-translate-y-2 border border-gold/15 flex flex-col justify-end ${spanClass} reveal-on-scroll`}
                >
                  {/* Photo container */}
                  <div className="absolute inset-0 w-full h-full">
                    <SafeImage
                      src={moment.img}
                      alt={moment.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-106"
                    />
                  </div>

                  {/* Gradient Scrim */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-[#2A0E18] via-black/30 to-black/20 transition-opacity duration-300 ${isPlaying ? 'opacity-95 bg-wine-deep/85' : 'opacity-80 group-hover:opacity-70'}`}></div>

                  {/* Active Player Tag overlay */}
                  {isPlaying && (
                    <div className="absolute top-4 right-4 bg-gold text-wine text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 animate-pulse shadow-premium z-20">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span> Live Preview Playing
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div className="relative p-6 md:p-8 z-10 text-white pointer-events-none">
                    <span className="text-[10px] text-gold uppercase tracking-[0.22em] font-semibold mb-2 block">
                      Wedding soundscape
                    </span>
                    <h3 className="font-serif font-semibold text-2xl mb-1 flex items-center gap-2 text-white">
                      {moment.title}
                    </h3>
                    
                    {/* Live Track info reveal */}
                    <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-16 group-hover:mt-2">
                      <p className="text-xs text-ivory/80 font-sans italic flex items-center gap-1">
                        <Music className="w-3 h-3 text-gold" /> {moment.track}
                      </p>
                    </div>

                    {/* Animated Synthesizer waves */}
                    {isPlaying && (
                      <div className="mt-4 flex items-center gap-1.5 h-6">
                        <span className="w-1 h-3 bg-gold rounded-full animate-bounce [animation-delay:0.1s]"></span>
                        <span className="w-1 h-5 bg-gold rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        <span className="w-1 h-4 bg-gold rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1 h-2 bg-gold rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        <span className="w-1 h-5 bg-gold rounded-full animate-bounce [animation-delay:0.1s]"></span>
                        <span className="w-1 h-3 bg-gold rounded-full animate-bounce [animation-delay:0.3s]"></span>
                        <span className="text-xs text-gold font-mono ml-2">Freq: {playingNote || "..."}</span>
                      </div>
                    )}

                    {!isPlaying && (
                      <span className="text-[10px] text-ivory/50 font-sans mt-2 tracking-wider uppercase block group-hover:text-gold transition-colors">
                        Click to listen to arrangement
                      </span>
                    )}
                  </div>

                  {/* Icon Overlay trigger button */}
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md rounded-full border border-white/25 flex items-center justify-center transform transition-all duration-300 opacity-0 group-hover:opacity-100 z-20 ${isPlaying ? "opacity-100 bg-gold border-gold scale-110" : "scale-90"}`}>
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-wine fill-wine" />
                    ) : (
                      <Play className="w-5 h-5 text-white fill-white translate-x-0.5" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6 · COUPLES' STORIES (Warm-white background #FAF6F0 with gold quotation watermarks) */}
      <section id="stories" className="py-14 md:py-18 bg-white px-6 md:px-10">
        <div className="max-w-[1180px] mx-auto">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 reveal-on-scroll">
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.28em] block mb-3">
              In their words
            </span>
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight">
              Couples' stories.
            </h2>
          </div>

          {/* Desktop/Tablet Testimonials Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Testimonial Card 1 */}
            <div className="group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between h-80 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden reveal-on-scroll">
              <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                “
              </div>
              <div className="flex flex-col space-y-4 relative z-10">
                <div className="flex items-center space-x-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                </div>
                <p className="font-sans font-light italic text-muted text-sm leading-relaxed">
                  "They didn't just play music — they understood our story and turned it into something we'll never forget."
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                  AL
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                  <span className="text-[10px] text-muted block">October 2025 &middot; Kohima</span>
                </div>
              </div>
            </div>

            {/* Testimonial Card 2 */}
            <div className="group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between h-80 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden reveal-on-scroll">
              <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                “
              </div>
              <div className="flex flex-col space-y-4 relative z-10">
                <div className="flex items-center space-x-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                </div>
                <p className="font-sans font-light italic text-muted text-sm leading-relaxed">
                  "Every transition was seamless. We didn't have to think about a single thing on the day."
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                  TK
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                  <span className="text-[10px] text-muted block">November 2025 &middot; Shillong</span>
                </div>
              </div>
            </div>

            {/* Testimonial Card 3 */}
            <div className="group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between h-80 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden reveal-on-scroll">
              <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                “
              </div>
              <div className="flex flex-col space-y-4 relative z-10">
                <div className="flex items-center space-x-1 text-gold">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                </div>
                <p className="font-sans font-light italic text-muted text-sm leading-relaxed">
                  "They made our families cry — in the best way. The music carried the whole evening."
                </p>
              </div>
              <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                  MR
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                  <span className="text-[10px] text-muted block">December 2025 &middot; Dimapur</span>
                </div>
              </div>
            </div>

            {/* Video Thumbnail Card */}
            <div
              onClick={() => setIsVideoModalOpen(true)}
              className="group relative h-80 rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover cursor-pointer transition-all duration-300 border border-gold/15 reveal-on-scroll"
            >
              <div className="absolute inset-0 w-full h-full">
                <SafeImage
                  src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=500"
                  alt="Emotional wedding reception scene"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay scrim */}
              <div className="absolute inset-0 bg-wine/50 group-hover:bg-wine/65 transition-all duration-300"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10">
                <div className="w-14 h-14 rounded-full bg-gold group-hover:bg-gold-soft text-wine flex items-center justify-center shadow-premium mb-4 transform group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-wine translate-x-0.5" />
                </div>
                <h4 className="font-serif font-semibold text-lg text-white">Watch Session Demo</h4>
                <p className="text-xs text-ivory/70 mt-1 font-sans font-light">Temsu &amp; Abdon Live Acoustic Duo</p>
              </div>
            </div>

          </div>

          {/* Mobile Testimonials Carousel */}
          <div className="md:hidden relative px-1">
            <div 
              className="overflow-hidden touch-pan-y relative rounded-3xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides wrapper with active slide styling */}
              <div className="relative h-80 w-full flex items-center justify-center">
                
                {/* Slide 0 */}
                <div className="w-full h-full group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between absolute inset-0 transition-all duration-500 transform origin-center" style={{
                  opacity: activeStoryIndex === 0 ? 1 : 0,
                  transform: activeStoryIndex === 0 ? "scale(1)" : "scale(0.95)",
                  pointerEvents: activeStoryIndex === 0 ? "auto" : "none",
                  zIndex: activeStoryIndex === 0 ? 10 : 0
                }}>
                  <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                    “
                  </div>
                  <div className="flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center space-x-1 text-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                    </div>
                    <p className="font-sans font-light italic text-muted text-sm leading-relaxed text-left">
                      "They didn't just play music — they understood our story and turned it into something we'll never forget."
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                      AL
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                      <span className="text-[10px] text-muted block">October 2025 &middot; Kohima</span>
                    </div>
                  </div>
                </div>

                {/* Slide 1 */}
                <div className="w-full h-full group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between absolute inset-0 transition-all duration-500 transform origin-center" style={{
                  opacity: activeStoryIndex === 1 ? 1 : 0,
                  transform: activeStoryIndex === 1 ? "scale(1)" : "scale(0.95)",
                  pointerEvents: activeStoryIndex === 1 ? "auto" : "none",
                  zIndex: activeStoryIndex === 1 ? 10 : 0
                }}>
                  <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                    “
                  </div>
                  <div className="flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center space-x-1 text-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                    </div>
                    <p className="font-sans font-light italic text-muted text-sm leading-relaxed text-left">
                      "Every transition was seamless. We didn't have to think about a single thing on the day."
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                      TK
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                      <span className="text-[10px] text-muted block">November 2025 &middot; Shillong</span>
                    </div>
                  </div>
                </div>

                {/* Slide 2 */}
                <div className="w-full h-full group bg-white border border-gold/10 p-8 rounded-3xl shadow-premium flex flex-col justify-between absolute inset-0 transition-all duration-500 transform origin-center" style={{
                  opacity: activeStoryIndex === 2 ? 1 : 0,
                  transform: activeStoryIndex === 2 ? "scale(1)" : "scale(0.95)",
                  pointerEvents: activeStoryIndex === 2 ? "auto" : "none",
                  zIndex: activeStoryIndex === 2 ? 10 : 0
                }}>
                  <div className="absolute -top-4 -right-2 font-serif font-bold text-8xl text-gold/5 select-none pointer-events-none">
                    “
                  </div>
                  <div className="flex flex-col space-y-4 relative z-10">
                    <div className="flex items-center space-x-1 text-gold">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold stroke-none" />)}
                    </div>
                    <p className="font-sans font-light italic text-muted text-sm leading-relaxed text-left">
                      "They made our families cry — in the best way. The music carried the whole evening."
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 border-t border-gold/5 pt-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center font-serif text-wine font-bold text-sm">
                      MR
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-semibold text-sm text-ink">A Q'rate couple</h4>
                      <span className="text-[10px] text-muted block">December 2025 &middot; Dimapur</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Navigation and Indicators */}
            <div className="flex items-center justify-between mt-6 max-w-[280px] mx-auto">
              <button 
                onClick={() => setActiveStoryIndex((prev) => (prev === 0 ? 2 : prev - 1))}
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold active:scale-95 transition-all"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex space-x-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStoryIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStoryIndex === idx ? "w-6 bg-gold" : "w-1.5 bg-gold/30"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              <button 
                onClick={() => setActiveStoryIndex((prev) => (prev === 2 ? 0 : prev + 1))}
                className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 hover:border-gold active:scale-95 transition-all"
                aria-label="Next story"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Separate Mobile Video Card below the Carousel */}
            <div className="mt-8">
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative h-48 rounded-2xl overflow-hidden shadow-premium cursor-pointer border border-gold/15 transition-all duration-300"
              >
                <div className="absolute inset-0 w-full h-full">
                  <SafeImage
                    src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=500"
                    alt="Emotional wedding reception scene"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Overlay scrim */}
                <div className="absolute inset-0 bg-wine/50 group-hover:bg-wine/65 transition-all duration-300"></div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center z-10">
                  <div className="w-12 h-12 rounded-full bg-gold group-hover:bg-gold-soft text-wine flex items-center justify-center shadow-premium mb-3 transform group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-wine translate-x-0.5" />
                  </div>
                  <h4 className="font-serif font-semibold text-base text-white text-center">Watch Session Demo</h4>
                  <p className="text-[11px] text-ivory/70 mt-1 font-sans font-light text-center">Temsu &amp; Abdon Live Acoustic Duo</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7 · HOW IT WORKS (Timeline step layout connected by a thin gold rule) */}
      <section id="process" className="py-20 md:py-24 bg-gradient-to-b from-white via-ivory/20 to-white px-6 md:px-10 relative overflow-hidden">
        {/* Subtle decorative grid background for tech-luxury precision */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(181,138,75,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(181,138,75,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"></div>
        
        <div className="max-w-[1180px] mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 reveal-on-scroll">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-gold/40"></div>
              <svg className="w-4 h-4 text-gold animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M50,20 C40,45 15,50 50,85 C85,50 60,45 50,20 Z" />
              </svg>
              <span className="text-gold text-xs font-semibold uppercase tracking-[0.3em] font-sans">
                Our Signature Process
              </span>
              <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-gold/40"></div>
            </div>
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-ink tracking-tight leading-tight">
              Your wedding's sound, in four steps.
            </h2>
            <p className="font-serif italic text-gold-soft tracking-wider text-sm mt-4 max-w-2xl mx-auto opacity-90">
              "From initial consultation to the final standing ovation, we meticulously choreograph every transition to tell your unique love story."
            </p>
          </div>

          {/* Timeline columns */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 relative mt-16">
            
            {/* Elegant luxury joining golden line across step elements */}
            <div className="hidden md:block absolute top-[44px] left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-gold/5 via-gold/45 to-gold/5 -z-10"></div>

            {[
              { 
                step: "01", 
                phase: "PHASE I", 
                title: "Consult", 
                desc: "We sit down with you to understand your taste, your story, and the feeling you want your day to carry.",
                outerShape: "rounded-[48px_48px_16px_16px]",
                innerShape: "rounded-[40px_40px_10px_10px]"
              },
              { 
                step: "02", 
                phase: "PHASE II", 
                title: "Curate", 
                desc: "We design your musical journey and handpick the artists to bring it to life.",
                outerShape: "rounded-[48px_16px_48px_16px]",
                innerShape: "rounded-[40px_10px_40px_10px]"
              },
              { 
                step: "03", 
                phase: "PHASE III", 
                title: "Coordinate", 
                desc: "We manage every artist, cue, and transition behind the scenes.",
                outerShape: "rounded-[16px_16px_48px_48px]",
                innerShape: "rounded-[10px_10px_40px_40px]"
              },
              { 
                step: "04", 
                phase: "PHASE IV", 
                title: "Celebrate", 
                desc: "You stay fully present, while we make sure every note lands.",
                outerShape: "rounded-[16px_48px_16px_48px]",
                innerShape: "rounded-[10px_40px_10px_40px]"
              },
            ].map((stepItem, i) => (
              <div key={i} className="flex flex-col items-center text-center group reveal-on-scroll relative">
                
                {/* Nested Luxury Crest Badge */}
                <div className={`w-24 h-24 ${stepItem.outerShape} border border-gold/15 group-hover:border-gold/35 p-2 transition-all duration-500 flex items-center justify-center relative mb-7 bg-white/50 backdrop-blur-sm shadow-premium`}>
                  
                  {/* Rotating fine golden hairline on hover */}
                  <div className={`absolute inset-0.5 ${stepItem.outerShape} border border-dashed border-gold/10 group-hover:border-gold/30 group-hover:scale-[1.03] transition-all duration-700`}></div>
                  
                  {/* Core Inner Circle */}
                  <div className={`w-full h-full ${stepItem.innerShape} bg-gradient-to-b from-white to-ivory-alt/30 border border-gold/15 group-hover:from-wine group-hover:to-[#1C0009] group-hover:border-gold/30 flex flex-col items-center justify-center shadow-inner transition-all duration-500 overflow-hidden relative`}>
                    <span className="font-serif text-2xl font-bold text-wine group-hover:text-gold transition-colors duration-500">
                      {stepItem.step}
                    </span>
                    <span className="absolute bottom-1.5 text-[6.5px] font-sans text-gold/60 group-hover:text-white/40 tracking-[0.1em] transition-colors duration-500">
                      SEC
                    </span>
                  </div>
                </div>

                {/* Phase identifier badge */}
                <span className="font-mono text-[9px] text-gold tracking-[0.25em] mb-2.5 block uppercase font-medium">
                  {stepItem.phase}
                </span>

                {/* Step text detail */}
                <h3 className="font-serif font-semibold text-xl md:text-2xl text-ink mb-3 group-hover:text-wine transition-colors duration-300">
                  {stepItem.title}
                </h3>
                
                {/* Small luxury center line accent */}
                <div className="w-6 h-[1px] bg-gold/25 group-hover:w-12 transition-all duration-500 mb-3"></div>

                {/* Flat paragraph description color #5A4A40 */}
                <p className="font-sans font-light text-muted text-sm leading-relaxed max-w-[240px] px-2">
                  {stepItem.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 8 · THE ARTISTS (Two dark portrait cards with gold glow on hover) */}
      <section id="artists" className="py-14 md:py-18 bg-white px-6 md:px-10">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Introductory details */}
          <div className="lg:col-span-4 flex flex-col items-start reveal-on-scroll">
            <span className="text-gold text-xs font-semibold uppercase tracking-[0.28em] mb-4 block">
              The people behind Q'rate
            </span>
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl text-ink leading-[1.15] mb-6 tracking-tight">
              Run by artists, <span className="text-gold italic font-normal font-serif">not agents</span>.
            </h2>
            {/* Flat description color #5A4A40 */}
            <p className="font-sans font-light text-muted leading-relaxed text-sm mb-8">
              Q'rate was founded by two working musicians who've spent years on stages and in studios. When you work with us, you work directly with the people shaping your sound.
            </p>
            <button
              onClick={() => setIsConsultationModalOpen(true)}
              className="bg-wine text-gold hover:bg-wine-hover hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 font-semibold px-8 py-3.5 rounded-full shadow-premium text-xs uppercase tracking-wider"
            >
              Meet with the Founders
            </button>
          </div>

          {/* Right side portraits (Tripzy-style portrait grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            
            {/* Founder 1: Temsu Clover */}
            <div className="group bg-wine-deep border border-gold/15 rounded-[24px] overflow-hidden shadow-premium gold-glow-hover flex flex-col justify-end h-[440px] relative reveal-on-scroll">
              <div className="absolute inset-0 w-full h-full">
                <SafeImage
                  src="https://i.ibb.co/4gjNCNLs/Whats-App-Image-2026-06-29-at-3-35-17-PM.jpg"
                  alt="Temsu Clover performing on microphone stage"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Card gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-black/20 to-transparent opacity-85"></div>
              
              <div className="relative p-8 z-10 text-white">
                <span className="text-[10px] text-gold uppercase tracking-[0.22em] font-semibold mb-1 block">
                  CO-FOUNDER &middot; MUSICIAN
                </span>
                <h3 className="font-serif font-semibold text-3xl mb-1 text-white">
                  Temsu Clover
                </h3>
                <p className="text-xs text-ivory/70 font-sans font-light leading-relaxed">
                  Lush, atmospheric vocal designer specializing in intimate ceremony arrangements.
                </p>
              </div>
            </div>

            {/* Founder 2: Abdon Mech */}
            <div className="group bg-wine-deep border border-gold/15 rounded-[24px] overflow-hidden shadow-premium gold-glow-hover flex flex-col justify-end h-[440px] relative reveal-on-scroll">
              <div className="absolute inset-0 w-full h-full">
                <SafeImage
                  src="https://i.ibb.co/qLtW1zDP/Whats-App-Image-2026-06-29-at-3-35-34-PM.jpg"
                  alt="Abdon Mech performing on guitar"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Card gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-black/20 to-transparent opacity-85"></div>

              <div className="relative p-8 z-10 text-white">
                <span className="text-[10px] text-gold uppercase tracking-[0.22em] font-semibold mb-1 block">
                  CO-FOUNDER &middot; MUSICIAN
                </span>
                <h3 className="font-serif font-semibold text-3xl mb-1 text-white">
                  Abdon Mech
                </h3>
                <p className="text-xs text-ivory/70 font-sans font-light leading-relaxed">
                  Acoustic storyteller, sound director, and expert in cultural fusion scores.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9 · FINAL CTA (Wine band, soft radial gold glow, "Q" wax seal, drifting petals, scrolling marquee below) */}
      <section className="py-14 bg-white px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-[1180px] mx-auto relative z-10">
          
          <div className="relative rounded-[32px] bg-gradient-to-br from-wine-deep via-wine to-[#2A0812] text-white py-20 px-6 md:px-16 text-center shadow-premium border border-gold/15 overflow-hidden">
            
            {/* Background Image with slow elegant Ken Burns scaling like Hero */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <div className="w-full h-full ken-burns opacity-20">
                <SafeImage
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200"
                  alt="Live romantic wedding performance"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#2A0812] via-transparent to-wine-deep/80"></div>
            </div>

            {/* Falling petals in background */}
            <FallingPetals />

            {/* Radial soft gold highlight back glow effect */}
            <div className="absolute inset-0 bg-radial-gradient from-gold/15 via-transparent to-transparent pointer-events-none z-10"></div>

            {/* Wax seal monogram accent above headline */}
            <div className="flex justify-center mb-6 relative z-10">
              <WaxSealMonogram size="lg" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
              
              <h2 className="font-serif font-semibold text-3xl sm:text-4xl md:text-5xl text-white mb-4 tracking-tight leading-[1.15]">
                Book a consultation and <span className="text-gold-soft italic font-serif font-normal">we'll Q'rate</span> :)
              </h2>
              <p className="font-sans font-light text-ivory/80 text-sm md:text-base max-w-md leading-relaxed mb-8">
                Tell us about your day. We'll design the music around it.
              </p>
              
              <button
                onClick={() => setIsConsultationModalOpen(true)}
                className="bg-gold text-wine hover:bg-gold-soft hover:shadow-premium-hover hover:-translate-y-0.5 transition-all duration-300 font-semibold px-8 py-4 rounded-full text-xs uppercase tracking-wider shadow-premium"
              >
                Book a consultation
              </button>
            </div>
          </div>

        </div>
      </section>



      {/* 10 · FOOTER (Dark Ink background) */}
      <footer className="bg-wine-deep text-white/90 border-t border-gold/15 py-16 px-6 md:px-10">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Column 1: Logo & Brand statement */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <WaxSealMonogram size="sm" />
              <span className="font-serif italic text-2xl font-bold tracking-wide text-gold">
                Q'rate
              </span>
            </div>
            <p className="text-xs text-ivory/60 leading-relaxed font-light">
              Wedding music curation, designed and managed by artists. Based in Nagaland, India.
            </p>
          </div>

          {/* Column 2: Company routes */}
          <div className="flex flex-col space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm tracking-wide text-gold uppercase mb-1">Company</h4>
            <button onClick={() => handleScrollToSection("story")} className="text-left text-ivory/70 hover:text-gold transition-colors">Our story</button>
            <button onClick={() => handleScrollToSection("what-we-do")} className="text-left text-ivory/70 hover:text-gold transition-colors">What we do</button>
            <button onClick={() => handleScrollToSection("why-us")} className="text-left text-ivory/70 hover:text-gold transition-colors">Why us</button>
            <button onClick={() => handleScrollToSection("moments")} className="text-left text-ivory/70 hover:text-gold transition-colors">The moments</button>
          </div>

          {/* Column 3: Explore */}
          <div className="flex flex-col space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm tracking-wide text-gold uppercase mb-1">Explore</h4>
            <button onClick={() => handleScrollToSection("process")} className="text-left text-ivory/70 hover:text-gold transition-colors">Curation Process</button>
            <button onClick={() => handleScrollToSection("stories")} className="text-left text-ivory/70 hover:text-gold transition-colors">Couples' stories</button>
            <button onClick={() => setIsConsultationModalOpen(true)} className="text-left text-ivory/70 hover:text-gold transition-colors">Book Consultation</button>
          </div>

          {/* Column 4: Contact details */}
          <div className="flex flex-col space-y-3 text-xs">
            <h4 className="font-serif font-bold text-sm tracking-wide text-gold uppercase mb-1">Contact</h4>
            <span className="text-ivory/70">hello@qratemusic.com</span>
            <span className="text-ivory/70">+91 98765 43210</span>
            <span className="text-ivory/70">@qratenagaland</span>
          </div>

        </div>

        {/* Footer legal rows */}
        <div className="max-w-[1180px] mx-auto border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] text-ivory/40">
          <span>&copy; 2026 Q'rate. All rights reserved.</span>
          <span className="mt-2 md:mt-0">A company run by artists — Temsu Clover &amp; Abdon Mech</span>
        </div>
      </footer>

      {/* --- DIALOGUES / MODALS & OVERLAYS --- */}

      {/* Bespoke Plan Dialog Modal */}
      {isBespokeModalOpen && customPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-premium border border-gold/15 p-6 md:p-8 relative">
            
            {/* Close */}
            <button
              onClick={() => setIsBespokeModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-ivory transition-colors text-muted hover:text-wine"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-6 pb-4 border-b border-gold/10">
              <div className="flex items-center space-x-2 text-gold text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" /> <span>Bespoke Arrangement Plan</span>
              </div>
              <h3 className="font-serif font-semibold text-3xl text-wine">
                {customPlan.vibeTitle}
              </h3>
              <p className="text-xs text-muted font-sans mt-1">
                Format: <span className="font-medium text-wine">{customPlan.format}</span> &middot; Venue: <span className="font-medium text-wine">{customPlan.venue}</span> &middot; Guests: <span className="font-medium text-wine">{customPlan.guests}</span>
              </p>
            </div>

            {/* Vibe Description - Solid Color #5A4A40 */}
            <div className="text-muted text-sm leading-relaxed mb-6 font-light">
              {customPlan.description}
            </div>

            {/* Recommended Lineup */}
            <div className="mb-6">
              <h4 className="font-serif font-bold text-sm tracking-wide text-gold uppercase mb-3">Recommended Lineup</h4>
              <div className="space-y-3">
                {customPlan.recommendedLineup.map((line: any, idx: number) => (
                  <div key={idx} className="bg-ivory p-4 rounded-xl border border-gold/10">
                    <span className="text-xs font-bold text-wine uppercase block mb-1">{line.role}</span>
                    <p className="text-xs text-muted font-light mb-2">{line.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {line.instruments.map((inst: string, i: number) => (
                        <span key={i} className="bg-white border border-gold/10 text-wine text-[10px] px-2.5 py-1 rounded-full font-medium">
                          {inst}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key transition cues */}
            <div className="mb-6">
              <h4 className="font-serif font-bold text-sm tracking-wide text-gold uppercase mb-3">Key Transition Scores</h4>
              <div className="space-y-3">
                {customPlan.keyTransitions.map((tran: any, idx: number) => (
                  <div key={idx} className="flex items-start space-x-3 border-l-2 border-gold pl-4 py-1">
                    <div>
                      <span className="text-xs text-muted block uppercase font-semibold">{tran.moment}</span>
                      <span className="font-serif font-semibold text-wine text-sm block">{tran.song}</span>
                      <span className="text-xs text-muted block italic">by {tran.artist}</span>
                      <p className="text-xs text-muted font-light mt-1 leading-relaxed">{tran.why}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Acoustic equipment requirements */}
            <div className="mb-8 bg-wine-deep/5 p-4 rounded-xl border border-wine/10">
              <h4 className="font-serif font-bold text-xs tracking-wide text-wine uppercase mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-gold" /> Acoustic Engineering Needs
              </h4>
              <ul className="text-xs text-muted space-y-1 font-light">
                {customPlan.productionNeeds.map((need: string, i: number) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-gold flex-shrink-0" /> {need}
                  </li>
                ))}
              </ul>
            </div>

            {/* Claim Plan Action Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setIsBespokeModalOpen(false);
                  setIsConsultationModalOpen(true);
                }}
                className="flex-1 bg-wine text-gold hover:bg-wine-hover hover:shadow-premium-hover transition-all font-semibold py-3.5 rounded-full uppercase tracking-wider text-xs text-center"
              >
                Schedule Founder Review
              </button>
              <button
                onClick={() => setIsBespokeModalOpen(false)}
                className="px-6 py-3.5 border border-gold/40 text-gold hover:border-gold rounded-full text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Consultation Booking Dialogue Modal */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-premium border border-gold/15 p-5 sm:p-6 md:p-8 relative">
            
            {/* Close */}
            <button
              onClick={() => setIsConsultationModalOpen(false)}
              className="absolute top-3.5 right-3.5 p-1.5 sm:p-2 rounded-full hover:bg-ivory transition-colors text-muted hover:text-wine"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="text-center mb-4 sm:mb-6">
              <div className="flex justify-center mb-2 sm:mb-3">
                <WaxSealMonogram size="sm" />
              </div>
              <h3 className="font-serif font-semibold text-xl sm:text-2xl text-wine">
                Book a consultation
              </h3>
              <p className="text-[11px] sm:text-xs text-muted font-sans mt-0.5 sm:mt-1">
                Schedule a personal session with Temsu Clover and Abdon Mech.
              </p>
            </div>

            {consultationSuccess ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gold/15 text-wine rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3px] text-gold" />
                </div>
                <h4 className="font-serif font-semibold text-base sm:text-lg text-wine">Consultation Scheduled!</h4>
                <p className="text-[11px] sm:text-xs text-muted font-sans mt-1.5 sm:mt-2 leading-relaxed">
                  Temsu and Abdon will contact you personally within 24 hours to review your acoustic wedding plan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConsultationSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={consultationForm.name}
                    onChange={(e) => setFormState("name", e.target.value)}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink placeholder:text-muted/50"
                  />
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={consultationForm.email}
                    onChange={(e) => setFormState("email", e.target.value)}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink placeholder:text-muted/50"
                  />
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">WhatsApp / Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="Contact number"
                    value={consultationForm.phone}
                    onChange={(e) => setFormState("phone", e.target.value)}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink placeholder:text-muted/50"
                  />
                </div>

                <div>
                  <label className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted block mb-0.5 sm:mb-1">Special Notes or Requests (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your style..."
                    value={consultationForm.notes}
                    onChange={(e) => setFormState("notes", e.target.value)}
                    className="w-full bg-ivory border border-gold/15 rounded-xl px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm focus:outline-none focus:border-gold text-ink placeholder:text-muted/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-wine text-gold hover:bg-wine-hover hover:shadow-premium-hover transition-all font-semibold py-2.5 sm:py-4 rounded-xl uppercase tracking-wider text-[10px] sm:text-xs shadow-premium mt-1.5 sm:mt-2"
                >
                  Schedule Free Session
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* What We Do Detail Dialogue Overlay */}
      {activeWhatWeDoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          {(() => {
            const data = whatWeDoList.find((item) => item.id === activeWhatWeDoDetail);
            if (!data) return null;
            return (
              <div className="bg-white rounded-3xl max-w-md w-full shadow-premium border border-gold/15 p-6 md:p-8 relative">
                
                {/* Close */}
                <button
                  onClick={() => setActiveWhatWeDoDetail(null)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-ivory transition-colors text-muted hover:text-wine"
                >
                  <X className="w-5 h-5" />
                </button>

                <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] mb-2 block">
                  {data.subtitle}
                </span>
                <h3 className="font-serif font-semibold text-2xl text-wine mb-4">
                  {data.title}
                </h3>
                
                {/* Detailed features bullets - Solid Color #5A4A40 */}
                <div className="space-y-3 mb-6">
                  {data.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5">
                      <div className="w-5 h-5 rounded-full bg-gold/10 text-wine flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-gold stroke-[3px]" />
                      </div>
                      <p className="text-xs text-muted leading-relaxed font-light">{detail}</p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveWhatWeDoDetail(null);
                    setIsConsultationModalOpen(true);
                  }}
                  className="w-full bg-wine text-gold hover:bg-wine-hover transition-colors font-semibold py-3.5 rounded-full uppercase tracking-wider text-xs"
                >
                  Discuss this service
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Video Demonstration Modal Popup */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#1a050d] rounded-3xl max-w-4xl w-full shadow-premium border border-gold/25 overflow-hidden relative">
            
            {/* Close */}
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-1 md:top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 md:bg-white/10 md:hover:bg-white/20 transition-colors text-white hover:text-gold z-50 animate-fade-in"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Premium Header */}
            <div className="px-6 py-4 border-b border-gold/15 bg-wine-deep flex items-center justify-between">
              <div>
                <span className="text-[9px] text-gold uppercase tracking-[0.22em] font-semibold block mb-0.5">
                  LIVE SESSION DEMO
                </span>
                <h3 className="font-serif font-medium text-base text-white">
                  Temsu Clover &amp; Abdon Mech Acoustic Duo
                </h3>
              </div>
              <span className="font-mono text-[9px] text-gold-soft/65 tracking-wider hidden sm:inline-block">
                LIVE &middot; KOHIMA SESSION
              </span>
            </div>

            {/* Real Video Player */}
            <div className="aspect-video bg-black relative">
              <iframe
                src="https://www.youtube.com/embed/gL-okFkxvAE?autoplay=1&rel=0&modestbranding=1"
                title="Q'rate Wedding Curation Live Session Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              ></iframe>
            </div>

            {/* Premium Footer with elegant controls / details */}
            <div className="px-6 py-4 bg-wine-deep/90 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ivory/70">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-sans font-light">Now streaming live audition showcase &middot; 48kHz Stereo</span>
              </div>
              <button
                onClick={() => {
                  setIsVideoModalOpen(false);
                  setIsConsultationModalOpen(true);
                }}
                className="bg-gold text-wine hover:bg-gold-soft transition-all duration-300 font-semibold px-4 py-1.5 rounded-full text-[10px] uppercase tracking-wider"
              >
                Book This Duo
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );

  // Small helper to update deep state
  function setFormState(field: string, value: string) {
    setConsultationForm((prev) => ({ ...prev, [field]: value }));
  }
}
