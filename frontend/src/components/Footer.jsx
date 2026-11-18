import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Phone, MapPin, Mail, Clock } from 'lucide-react';
import { BRAND, buildWhatsAppLink } from '../lib/brand';

export function Footer() {
  const directWhatsAppUrl = buildWhatsAppLink(
    'Hello CircuitCare 👋\nI have a general enquiry about your repair services in Jaipur.'
  );

  return (
    <footer className="bg-[#0D0F0D] text-[#FEFAF7] border-t border-white/10 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#252B26] border border-white/10 flex items-center justify-center p-1">
                <img
                  src="/assets/circuitcare-logo.svg"
                  alt="CircuitCare Icon"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-[#FEFAF7]">
                circuit<span className="text-[#BBFA47]">care</span>
              </span>
            </Link>

            <p className="text-sm text-[#A4ADA5] max-w-sm leading-relaxed">
              Fast, transparent electronics and home appliance repair in Jaipur.
              From diagnosed repairs to preventive servicing across 16 categories.
            </p>

            <div className="pt-2">
              <a
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lime text-xs px-4 py-2.5 inline-flex"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>Chat on WhatsApp: {BRAND.businessPhone}</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBFA47] mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A4ADA5]">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  All 188 Services
                </Link>
              </li>
              <li>
                <Link to="/enquiry" className="hover:text-white transition-colors">
                  Quick Service Enquiry
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact &amp; Support
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Customer Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBFA47] mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm text-[#A4ADA5]">
              <li>
                <Link to="/services?category=Laptop" className="hover:text-white transition-colors">
                  Laptop Repair
                </Link>
              </li>
              <li>
                <Link to="/services?category=AC" className="hover:text-white transition-colors">
                  AC Deep Cleaning &amp; Gas
                </Link>
              </li>
              <li>
                <Link to="/services?category=Refrigerator" className="hover:text-white transition-colors">
                  Refrigerator Servicing
                </Link>
              </li>
              <li>
                <Link to="/services?category=CCTV" className="hover:text-white transition-colors">
                  CCTV Installation
                </Link>
              </li>
              <li>
                <Link to="/services?category=Networking" className="hover:text-white transition-colors">
                  Wi-Fi &amp; LAN Points
                </Link>
              </li>
            </ul>
          </div>

          {/* Jaipur Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBFA47] mb-4">
              Jaipur Operations
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-[#A4ADA5]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#BBFA47] shrink-0 mt-0.5" />
                <span>Serving all municipal zones across Jaipur, Rajasthan</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#BBFA47] shrink-0 mt-0.5" />
                <span>{BRAND.businessPhone}</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#BBFA47] shrink-0 mt-0.5" />
                <span>{BRAND.operatingHours}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-[#BBFA47] shrink-0 mt-0.5" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-white transition-colors">
                  {BRAND.supportEmail}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A4ADA5]">
          <p>© {new Date().getFullYear()} CircuitCare. All rights reserved. Jaipur Launch Edition.</p>
          <p className="text-center sm:text-right">
            Transparent pricing · Genuine parts with approval · WhatsApp connected
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
