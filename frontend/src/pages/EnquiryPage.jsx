import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, MapPin, Phone } from 'lucide-react';
import { ScheduleRepairCard } from '../components/ScheduleRepairCard';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../lib/brand';

export function EnquiryPage() {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();

  const initialServiceId = searchParams.get('serviceId') || '';
  const initialCategory = searchParams.get('category') || '';

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link
            to="/services"
            className="font-semibold text-zinc-600 hover:text-black flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to 188 services</span>
          </Link>

          {isAuthenticated ? (
            <span className="text-zinc-600">
              Signed in as <strong className="text-[#0D0F0D]">{user?.fullName}</strong>
            </span>
          ) : (
            <Link
              to="/login?returnTo=/enquiry"
              className="text-[#0D0F0D] font-bold hover:underline"
            >
              Sign in to prefill profile
            </Link>
          )}
        </div>

        {/* Schedule a Repair Reference Card */}
        <ScheduleRepairCard
          initialCategory={initialCategory}
          initialServiceId={initialServiceId}
          className="shadow-2xl"
          standalone={true}
        />

        {/* Jaipur Operational Guarantee Footer */}
        <div className="mt-8 text-center text-xs text-zinc-500 max-w-lg mx-auto space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-zinc-700">
            <MapPin className="w-3.5 h-3.5 text-[#252B26]" />
            <span>Serving all municipal zones across Jaipur, Rajasthan</span>
          </div>
          <p>
            Operating hours: 9:00 AM – 8:00 PM · Helpline: {BRAND.businessPhone}
          </p>
        </div>

      </div>
    </div>
  );
}

export default EnquiryPage;
