import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ServiceCard({ service, onSelectService }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEnquire = () => {
    if (onSelectService) {
      onSelectService(service);
      return;
    }

    const queryParams = new URLSearchParams({
      serviceId: service.id,
      category: service.category,
    });

    if (isAuthenticated) {
      navigate(`/enquiry?${queryParams.toString()}`);
    } else {
      // Redirect to login, preserving service selection
      navigate(`/login?returnTo=${encodeURIComponent(`/enquiry?${queryParams.toString()}`)}&${queryParams.toString()}`);
    }
  };

  const handleViewDetails = () => {
    navigate(`/services/${service.id}`);
  };

  const hasPrice =
    service.websitePrice !== null &&
    service.websitePrice !== undefined &&
    service.websitePrice !== '';

  return (
    <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:border-[#0D0F0D]/30 transition-all flex flex-col justify-between group">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider px-2.5 py-1 rounded-md bg-[#252B26]/10 text-[#252B26]">
            {service.id}
          </span>
          <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-md truncate max-w-[140px]">
            {service.category}
          </span>
        </div>

        {/* Service Title */}
        <h3
          onClick={handleViewDetails}
          className="text-base sm:text-lg font-bold text-[#0D0F0D] group-hover:text-black transition-colors cursor-pointer line-clamp-2"
        >
          {service.name}
        </h3>

        {/* Scope / Inclusions */}
        {service.scope && (
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 line-clamp-2 leading-relaxed">
            {service.scope}
          </p>
        )}

        {/* Parts / Consumables Note */}
        {service.partsAndConsumables && (
          <div className="flex items-start gap-1.5 mt-2.5 text-[11px] text-zinc-500 bg-zinc-50 rounded-lg p-2 border border-zinc-100">
            <ShieldCheck className="w-3.5 h-3.5 text-[#252B26] shrink-0 mt-0.5" />
            <span className="line-clamp-2">{service.partsAndConsumables}</span>
          </div>
        )}
      </div>

      {/* Pricing & Actions */}
      <div className="mt-5 pt-4 border-t border-zinc-100 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 block">
              {service.pricingBasis || 'Service Estimate'}
            </span>
            <div className="mt-0.5">
              {hasPrice ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-xl sm:text-2xl font-black text-[#0D0F0D]">
                    ₹{service.websitePrice}
                  </span>
                  {service.chargingUnit && (
                    <span className="text-xs text-zinc-600">/ {service.chargingUnit}</span>
                  )}
                </div>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#252B26] bg-[#BBFA47]/40 px-2.5 py-0.5 rounded-full">
                  <Tag className="w-3 h-3 text-[#252B26]" />
                  Contact for price
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewDetails}
            className="text-xs font-semibold text-zinc-500 hover:text-[#0D0F0D] flex items-center gap-0.5"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Enquire on WhatsApp button */}
        <button
          type="button"
          onClick={handleEnquire}
          className="w-full btn-lime text-xs sm:text-sm py-2.5 flex items-center justify-center gap-2 font-bold"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span>Enquire on WhatsApp</span>
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
