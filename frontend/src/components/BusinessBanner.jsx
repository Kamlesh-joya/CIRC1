import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight } from 'lucide-react';

export function BusinessBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="bg-[#252B26] text-[#FEFAF7] rounded-3xl p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl border border-white/10">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#BBFA47]">
            <Building2 className="w-4 h-4" />
            <span>Commercial &amp; Office IT Support</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Reliable Business Technology Support in Jaipur
          </h2>
          <p className="text-sm sm:text-base text-[#A4ADA5] leading-relaxed">
            Need support for multiple office workstations, commercial CCTV installation,
            Wi-Fi/LAN point setup, network switches, printers, or UPS backup systems?
            Browse our catalogue services and enquire directly.
          </p>
        </div>
        <div className="lg:col-span-4 flex lg:justify-end">
          <Link
            to="/services?category=Networking"
            className="btn-lime w-full sm:w-auto text-center"
          >
            <span>View IT &amp; Office Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BusinessBanner;
