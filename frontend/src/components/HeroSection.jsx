import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Search,
  Laptop,
  Wind,
  Camera,
  Wifi
} from 'lucide-react';

export function HeroSection() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/services?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <section className="bg-[#0D0F0D] text-[#FEFAF7] pt-8 pb-14 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#252B26] border border-white/10 text-xs font-medium text-[#BBFA47]">
              <span className="w-2 h-2 rounded-full bg-[#BBFA47] animate-pulse" />
              <span>JAIPUR · EXCLUSIVE 188-SERVICE CATALOGUE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
              Your Tech. <span className="text-[#BBFA47]">Our Care.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#A4ADA5] max-w-2xl leading-relaxed">
              Reliable electronics and appliance care strictly covering our official 188 catalogue
              services across 16 categories in Jaipur. Select your service, view transparent estimates,
              and connect on WhatsApp.
            </p>

            {/* Large Search Box */}
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-full p-1.5 sm:p-2 shadow-2xl flex items-center max-w-xl transition-all focus-within:ring-2 focus-within:ring-[#BBFA47]"
            >
              <div className="pl-3.5 pr-2 text-zinc-400">
                <Search className="w-5 h-5 text-zinc-500" />
              </div>
              <label htmlFor="hero-search" className="sr-only">
                Find Service
              </label>
              <input
                id="hero-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find Service (e.g. Laptop, AC, CCTV)..."
                aria-label="Find Service"
                className="w-full bg-transparent border-0 text-[#0D0F0D] placeholder:text-zinc-500 text-sm sm:text-base focus:outline-none focus:ring-0"
              />
              <button
                type="submit"
                className="btn-lime text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-full shrink-0 font-bold tracking-wide"
              >
                Find Service
              </button>
            </form>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/services"
                className="btn-lime text-sm px-6 py-3"
              >
                <span>Browse 188 Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/enquiry"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl border border-white/20 text-[#FEFAF7] font-semibold text-sm hover:bg-white/10 transition-colors"
              >
                Quick Service Enquiry
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#A4ADA5] pt-3">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#BBFA47] shrink-0" />
                <span>16 official device categories</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#BBFA47]" />
                <span>188 verified catalogue services</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#BBFA47] shrink-0" />
                <span>Customer approval before extra work</span>
              </span>
            </div>

          </div>

          {/* Right Brand Showcase Card (matching screenshot) */}
          <div className="lg:col-span-5">
            <div className="bg-[#252B26] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
              
              {/* Inner glowing logo box */}
              <div className="flex flex-col items-center justify-center bg-[#0D0F0D] rounded-2xl p-6 sm:p-8 border border-white/10 text-center relative overflow-hidden group">
                <div className="w-28 sm:w-36 h-28 sm:h-36 flex items-center justify-center relative">
                  <img
                    src="/assets/circuitcare-logo.svg"
                    alt="CircuitCare Logo"
                    className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(183,255,74,0.35)] transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    circuit<span className="text-[#BBFA47]">care</span>
                  </div>
                  <p className="text-[11px] font-bold tracking-widest text-[#BBFA47] uppercase mt-1">
                    GLITCHING? LET'S FIX IT.
                  </p>
                </div>
              </div>

              {/* 2x2 Quick Category Pills */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <Link
                  to="/services?category=Laptop"
                  className="bg-[#0D0F0D] hover:bg-black border border-white/10 hover:border-[#BBFA47]/40 rounded-xl p-3 flex items-center gap-2.5 transition-all text-[#FEFAF7] group"
                >
                  <div className="p-1 rounded-lg bg-[#252B26] text-[#BBFA47] group-hover:bg-[#BBFA47] group-hover:text-[#0D0F0D] transition-colors">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate">Laptop (18 Services)</span>
                </Link>

                <Link
                  to="/services?category=AC"
                  className="bg-[#0D0F0D] hover:bg-black border border-white/10 hover:border-[#BBFA47]/40 rounded-xl p-3 flex items-center gap-2.5 transition-all text-[#FEFAF7] group"
                >
                  <div className="p-1 rounded-lg bg-[#252B26] text-[#BBFA47] group-hover:bg-[#BBFA47] group-hover:text-[#0D0F0D] transition-colors">
                    <Wind className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate">AC (15 Services)</span>
                </Link>

                <Link
                  to="/services?category=CCTV"
                  className="bg-[#0D0F0D] hover:bg-black border border-white/10 hover:border-[#BBFA47]/40 rounded-xl p-3 flex items-center gap-2.5 transition-all text-[#FEFAF7] group"
                >
                  <div className="p-1 rounded-lg bg-[#252B26] text-[#BBFA47] group-hover:bg-[#BBFA47] group-hover:text-[#0D0F0D] transition-colors">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate">CCTV (12 Services)</span>
                </Link>

                <Link
                  to="/services?category=Networking"
                  className="bg-[#0D0F0D] hover:bg-black border border-white/10 hover:border-[#BBFA47]/40 rounded-xl p-3 flex items-center gap-2.5 transition-all text-[#FEFAF7] group"
                >
                  <div className="p-1 rounded-lg bg-[#252B26] text-[#BBFA47] group-hover:bg-[#BBFA47] group-hover:text-[#0D0F0D] transition-colors">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span className="font-medium truncate">Networking (10 Services)</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
