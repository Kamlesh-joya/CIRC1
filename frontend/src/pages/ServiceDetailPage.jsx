import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Tag,
  MapPin,
  Clock,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { BRAND } from '../lib/brand';

export function ServiceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const item = await api.getServiceById(id);
        setService(item);
      } catch (err) {
        console.error('Error loading service details:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleEnquire = () => {
    if (!service) return;

    const params = new URLSearchParams({
      serviceId: service.id,
      category: service.category,
    });

    if (isAuthenticated) {
      navigate(`/enquiry?${params.toString()}`);
    } else {
      navigate(`/login?returnTo=${encodeURIComponent(`/enquiry?${params.toString()}`)}&${params.toString()}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#0D0F0D] border-t-[#BBFA47] rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-zinc-600">Loading service details...</p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-20 text-center px-4">
        <h2 className="text-2xl font-bold text-[#0D0F0D]">Service not found</h2>
        <p className="text-sm text-zinc-600 mt-2">
          The service ID "{id}" does not exist in the catalogue.
        </p>
        <Link to="/services" className="btn-lime text-xs mt-6 inline-flex">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all services
        </Link>
      </div>
    );
  }

  const hasPrice =
    service.websitePrice !== null &&
    service.websitePrice !== undefined &&
    service.websitePrice !== '';

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <Link
          to={`/services?category=${encodeURIComponent(service.category)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {service.category} services</span>
        </Link>

        {/* Detail Card Container */}
        <div className="bg-white border border-[#0D0F0D]/10 rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold tracking-wider px-3 py-1 rounded-md bg-[#0D0F0D] text-[#BBFA47]">
                {service.id}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-md bg-zinc-100 text-zinc-700">
                {service.category}
              </span>
              <span className="text-xs font-medium px-3 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-zinc-600">
                Jaipur Doorstep Service
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0D0F0D]">
              {service.name}
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#252B26]" />
              <span>Available in all Jaipur Municipal Corporation localities</span>
            </p>
          </div>

          {/* Pricing Highlight Box */}
          <div className="bg-[#0D0F0D] text-[#FEFAF7] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#BBFA47] uppercase">
                {service.pricingBasis || 'Service Pricing'}
              </span>
              <div className="mt-1 flex items-baseline gap-2">
                {hasPrice ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-white">
                      ₹{service.websitePrice}
                    </span>
                    {service.chargingUnit && (
                      <span className="text-sm text-[#A4ADA5]">/ {service.chargingUnit}</span>
                    )}
                  </>
                ) : (
                  <span className="text-2xl sm:text-3xl font-black text-[#BBFA47]">
                    Contact for price
                  </span>
                )}
              </div>
              <p className="text-xs text-[#A4ADA5] mt-2">
                {hasPrice
                  ? 'Transparent fixed estimate for standard service scope.'
                  : 'Requires technician inspection or model verification before quotation.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleEnquire}
              className="btn-lime w-full sm:w-auto px-6 py-3.5 text-sm font-bold flex items-center justify-center gap-2 shrink-0"
            >
              <MessageSquare className="w-4 h-4 fill-current" />
              <span>Enquire on WhatsApp</span>
            </button>
          </div>

          {/* Scope and Inclusions */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#0D0F0D] flex items-center gap-2">
              <Wrench className="w-5 h-5 text-[#252B26]" />
              <span>Scope &amp; Inclusions</span>
            </h3>
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5">
              <p className="text-sm text-zinc-700 leading-relaxed">
                {service.scope || 'Standard diagnostic inspection and service according to device specifications.'}
              </p>
            </div>
          </div>

          {/* Parts and Consumables */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#0D0F0D] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#252B26]" />
              <span>Parts &amp; Consumables Information</span>
            </h3>
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-5">
              <p className="text-sm text-zinc-700 leading-relaxed">
                {service.partsAndConsumables || 'Parts and extra consumables are quoted after inspection and approved by customer before installation.'}
              </p>
            </div>
          </div>

          {/* CircuitCare Guarantee Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100">
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <CheckCircle2 className="w-4 h-4 text-[#252B26]" />
              <h4 className="text-xs font-bold text-[#0D0F0D]">Approval Before Work</h4>
              <p className="text-[11px] text-zinc-600">No unexpected charges. You approve every quote.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <Clock className="w-4 h-4 text-[#252B26]" />
              <h4 className="text-xs font-bold text-[#0D0F0D]">Convenient Slots</h4>
              <p className="text-[11px] text-zinc-600">Home visit scheduled at your preferred time.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
              <HelpCircle className="w-4 h-4 text-[#252B26]" />
              <h4 className="text-xs font-bold text-[#0D0F0D]">WhatsApp Support</h4>
              <p className="text-[11px] text-zinc-600">Direct real-time communication with CircuitCare.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default ServiceDetailPage;
