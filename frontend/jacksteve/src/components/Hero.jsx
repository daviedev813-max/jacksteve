import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { url: "https://images.pexels.com/photos/1267435/pexels-photo-1267435.jpeg", tag: "REGIONAL LOGISTICS" },
    { url: "https://images.pexels.com/photos/374897/pexels-photo-374897.jpeg", tag: "AGRICULTURAL SOURCING" },
    { url: "https://images.pexels.com/photos/3960018/pexels-photo-3960018.jpeg", tag: "INDUSTRIAL BACKHAUL" },
    { url: "https://images.pexels.com/photos/380769/pexels-photo-380769.jpeg", tag: "FLEET OPTIMIZATION" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero min-h-[90vh] bg-neutral overflow-hidden relative flex items-center justify-center">
      {/* 1. BACKGROUND SLIDESHOW */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 z-0 transition-all duration-[3000ms] ease-in-out bg-cover bg-center ${
            index === currentSlide ? "opacity-30 scale-110" : "opacity-0 scale-100"
          }`}
          style={{ backgroundImage: `url(${slide.url})` }}
        />
      ))}

      {/* 2. INDUSTRIAL OVERLAYS */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-neutral/80 via-transparent to-neutral"></div>
      <div className="absolute inset-0 z-10 bg-[url('https://www.transparenttextures.com')] opacity-20"></div>

      {/* 3. CENTERED CONTENT */}
      <div className="relative z-20 container mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-8 animate-bounce">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
          </span>
          <span className="text-white font-black text-[10px] uppercase tracking-[0.3em] italic">
            {slides[currentSlide].tag} • ACTIVE NOW
          </span>
        </div>

        {/* Massive Centered Title */}
        <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-white leading-[0.8] uppercase mb-8">
          JACK<span className="text-secondary">STEVE</span> <br />
          <span className="text-primary text-5xl md:text-8xl">LIMITED</span>
        </h1>

        <p className="max-w-2xl text-xl md:text-2xl text-white/70 font-medium leading-relaxed mb-12">
          Bridging the gap between <span className="text-white underline decoration-primary decoration-4 underline-offset-8">Farmer Harvests</span> and <span className="text-white underline decoration-secondary decoration-4 underline-offset-8">Industrial Millers</span> with 99% uptime.
        </p>

        {/* CENTERED ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl justify-center">
          {/* Primary Action for Millers */}
          <Link 
            to="/services" 
            className="group btn btn-secondary btn-lg rounded-2xl px-12 h-20 flex-1 border-none shadow-2xl shadow-secondary/20 hover:scale-105 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black opacity-60 tracking-widest uppercase">For Millers</span>
              <span className="text-xl font-black italic uppercase">Request Supply</span>
            </div>
          </Link>

          {/* Secondary Action for Farmers */}
          <Link 
            to="/farmers" 
            className="group btn btn-primary btn-lg rounded-2xl px-12 h-20 flex-1 border-none shadow-2xl shadow-primary/20 hover:scale-105 transition-all"
          >
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black opacity-60 tracking-widest uppercase">For Farmers</span>
              <span className="text-xl font-black italic uppercase">Book Collection</span>
            </div>
          </Link>
        </div>

        {/* Trusted By / Reach Stat */}
        <div className="mt-16 pt-8 border-t border-white/5 w-full max-w-xl">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
            Reliably Moving 10,000+ Tons Monthly Across Kenya
          </p>
        </div>
      </div>

      {/* 4. PROGRESS BAR (Bottom) */}
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/5 z-30">
        <div 
          className="h-full bg-secondary transition-all duration-[5000ms] ease-linear"
          style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Hero;
