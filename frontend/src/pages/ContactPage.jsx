import React from 'react';
import { MessageSquare, Phone, MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';
import { BRAND, buildWhatsAppLink } from '../lib/brand';

export function ContactPage() {
  const directWhatsAppUrl = buildWhatsAppLink(
    'Hello CircuitCare 👋\nI have a query regarding appliance repair or electronics service from your Jaipur catalogue.'
  );

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-[#252B26]/70">
            Jaipur Launch Support
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0F0D]">
            Contact CircuitCare
          </h1>
          <p className="text-sm text-zinc-600">
            Have questions about an estimate or need assistance with one of our 188 catalogue services in Jaipur? Connect directly with our team.
          </p>
        </div>

        {/* WhatsApp Direct Hero Card */}
        <div className="bg-[#0D0F0D] text-[#FEFAF7] rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#252B26] text-xs font-semibold text-[#BBFA47]">
              <span className="w-2 h-2 rounded-full bg-[#BBFA47] animate-pulse" />
              <span>Fastest Response Channel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">
              Chat on WhatsApp
            </h2>
            <p className="text-sm text-[#A4ADA5] max-w-md">
              Send us your issue description, photos, or device model for instant consultation and visit booking.
            </p>
          </div>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lime text-sm sm:text-base px-6 py-3.5 font-bold shrink-0 shadow-lg shadow-[#BBFA47]/20"
          >
            <MessageSquare className="w-5 h-5 fill-current" />
            <span>Open WhatsApp (+91 9829139943)</span>
          </a>
        </div>

        {/* Grid of contact details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#BBFA47] text-[#0D0F0D] flex items-center justify-center mb-3">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0D0F0D]">Phone Helpline</h3>
            <p className="text-sm text-zinc-600">
              Direct voice assistance for immediate booking and queries.
            </p>
            <div className="pt-2">
              <a
                href={`tel:${BRAND.businessPhone.replace(/\s+/g, '')}`}
                className="text-base font-black text-[#0D0F0D] hover:underline"
              >
                {BRAND.businessPhone}
              </a>
            </div>
          </div>

          <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0D0F0D]">Operating Hours</h3>
            <p className="text-sm text-zinc-600">
              Technician visits and phone support timings:
            </p>
            <div className="pt-2 text-sm font-semibold text-[#0D0F0D]">
              {BRAND.operatingHours}
            </div>
          </div>

          <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center mb-3">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0D0F0D]">Jaipur Coverage</h3>
            <p className="text-sm text-zinc-600">
              Serving Mansarovar, Vaishali Nagar, Malviya Nagar, Raja Park, C-Scheme, Jagatpura, and all municipal zones.
            </p>
          </div>

          <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-6 shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 text-[#0D0F0D] flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0D0F0D]">Email Support</h3>
            <p className="text-sm text-zinc-600">
              For business partnerships, vendor enquiries, or documentation:
            </p>
            <div className="pt-2 text-sm font-semibold text-[#0D0F0D]">
              {BRAND.supportEmail}
            </div>
          </div>

        </div>

        {/* Commitment Banner */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 flex items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-[#252B26] shrink-0" />
          <div className="text-xs sm:text-sm text-zinc-700 leading-relaxed">
            <span className="font-bold text-[#0D0F0D]">CircuitCare Service Policy:</span> We strictly and exclusively service the 188 verified services listed in our official catalogue across 16 categories. We do not service unlisted appliances. All quotes for spare parts and additional labour are approved by you before any technician begins repair work.
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;
