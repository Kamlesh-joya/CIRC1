import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ShieldCheck, Clock, Phone, Sparkles } from 'lucide-react';
import { HeroSection } from '../components/HeroSection';
import { CategoryCard } from '../components/CategoryCard';
import { ServiceCard } from '../components/ServiceCard';
import { ScheduleRepairCard } from '../components/ScheduleRepairCard';
import { TrustBadges } from '../components/TrustBadges';
import { HowItWorks } from '../components/HowItWorks';
import { BusinessBanner } from '../components/BusinessBanner';
import { FAQAccordion } from '../components/FAQAccordion';
import { api } from '../lib/api';
import { BRAND } from '../lib/brand';

export function HomePage() {
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, allServices] = await Promise.all([
          api.getCategories(),
          api.getServices(),
        ]);
        setCategories(cats || []);

        const popularIds = [
          'CC-001', // Laptop Check-up & fault diagnosis
          'CC-006', // Laptop Screen replacement
          'CC-032', // AC Split AC basic service
          'CC-033', // AC Split AC deep cleaning
          'CC-047', // Refrigerator Preventive cleaning
          'CC-060', // Washing Machine Front-load deep cleaning
          'CC-092', // CCTV Camera installation
          'CC-103', // Networking Wi-Fi troubleshooting
        ];
        const popular = popularIds
          .map((id) => allServices.find((s) => s.id === id))
          .filter(Boolean);

        setPopularServices(popular.length > 0 ? popular : allServices.slice(0, 8));
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* 1. Hero Section matching screenshot */}
      <HeroSection />

      {/* 2. 16 Service Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#252B26]/70">
              Service Categories
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F0D] mt-1">
              What can we fix for you?
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0F0D] hover:underline"
          >
            <span>View all 16 categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} category={cat} />
          ))}
        </div>
      </section>

      {/* 3. Dedicated "Schedule a Repair" Section (matching user reference card) */}
      <section className="bg-[#0D0F0D] text-[#FEFAF7] py-16 border-y border-white/10 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#BBFA47]/10 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Description Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#252B26] border border-white/10 text-xs font-medium text-[#BBFA47]">
                <span className="w-2 h-2 rounded-full bg-[#BBFA47] animate-pulse" />
                <span>INSTANT WHATSAPP BOOKING · JAIPUR</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Quick repair slot. <span className="text-[#BBFA47]">Confirmed in minutes.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#A4ADA5] leading-relaxed">
                Fill in your details and connect instantly with CircuitCare on WhatsApp.
                Our Jaipur operations team confirms technician availability, transparent estimate, and your preferred timing.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#A4ADA5]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#BBFA47] shrink-0" />
                  <span>Strictly covering our official 188 catalogue services</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#BBFA47] shrink-0" />
                  <span>No spam, no calls unless requested</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#BBFA47] shrink-0" />
                  <span>Doorstep visits across all Jaipur Municipal Corporation zones</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-[#A4ADA5] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#BBFA47]" />
                <span>Helpline: <strong className="text-white">{BRAND.businessPhone}</strong></span>
              </div>
            </div>

            {/* Right Card Column (the exact "Schedule a repair" card) */}
            <div className="lg:col-span-7 flex justify-center">
              <ScheduleRepairCard className="w-full text-[#0D0F0D]" />
            </div>

          </div>
        </div>
      </section>

      {/* 4. Popular Services in Jaipur */}
      <section className="bg-white border-b border-[#0D0F0D]/8 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#252B26]/70">
                Transparent Estimates
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F0D] mt-1">
                Popular Services in Jaipur
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0D0F0D] hover:underline"
            >
              <span>Browse all 188 services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {popularServices.map((svc) => (
              <ServiceCard key={svc.id} service={svc} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why CircuitCare? */}
      <TrustBadges />

      {/* 6. How It Works (Customer Journey) */}
      <HowItWorks />

      {/* 7. Commercial & Office Support */}
      <BusinessBanner />

      {/* 8. FAQs */}
      <FAQAccordion />
    </div>
  );
}

export default HomePage;
