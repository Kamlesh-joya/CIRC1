import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ShieldCheck } from 'lucide-react';
import { ServiceCard } from '../components/ServiceCard';
import { api } from '../lib/api';

export function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category') || 'All';
  const activeSearch = searchParams.get('search') || '';
  const activePricingBasis = searchParams.get('pricingBasis') || 'All';

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, allServices] = await Promise.all([
          api.getCategories(),
          api.getServices(),
        ]);
        setCategories(cats || []);
        setServices(allServices || []);
      } catch (err) {
        console.error('Error loading services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleCategoryChange = (categoryName) => {
    const next = new URLSearchParams(searchParams);
    if (categoryName === 'All') {
      next.delete('category');
    } else {
      next.set('category', categoryName);
    }
    setSearchParams(next);
  };

  const handlePricingBasisChange = (basis) => {
    const next = new URLSearchParams(searchParams);
    if (basis === 'All') {
      next.delete('pricingBasis');
    } else {
      next.set('pricingBasis', basis);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (val) => {
    const next = new URLSearchParams(searchParams);
    if (!val.trim()) {
      next.delete('search');
    } else {
      next.set('search', val);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // Filtered services
  const filteredServices = useMemo(() => {
    let list = services;

    // Filter by Category
    if (activeCategory && activeCategory !== 'All') {
      const catLower = activeCategory.toLowerCase();
      list = list.filter((s) => s.category.toLowerCase() === catLower);
    }

    // Filter by Pricing Basis
    if (activePricingBasis && activePricingBasis !== 'All') {
      const pbLower = activePricingBasis.toLowerCase();
      list = list.filter((s) => (s.pricingBasis || '').toLowerCase().includes(pbLower));
    }

    // Filter by Search Query
    if (activeSearch.trim()) {
      const q = activeSearch.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.scope && s.scope.toLowerCase().includes(q))
      );
    }

    return list;
  }, [services, activeCategory, activePricingBasis, activeSearch]);

  const pricingBasisOptions = [
    'All',
    'Fixed service fee',
    'Inspection fee',
    'Quote after inspection',
  ];

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0F0D] text-xs font-bold text-[#BBFA47] uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Service Catalogue · Jaipur Doorstep Care</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0D0F0D] tracking-tight">
              Expert Repair &amp; Appliance Services
            </h1>
            <span className="text-xs sm:text-sm font-semibold text-[#0D0F0D] bg-[#BBFA47] px-3.5 py-1.5 rounded-full w-fit shadow-sm">
              Showing {filteredServices.length} of {services.length} services
            </span>
          </div>
          <p className="text-sm sm:text-base text-zinc-600 mt-2.5 max-w-3xl leading-relaxed">
            Transparent upfront pricing, certified technician support, and guaranteed doorstep service across Jaipur.
            Select your category, find your exact repair, and connect directly on WhatsApp to schedule your visit.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-4 sm:p-5 shadow-card mb-8 space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search among 188 catalogue services (e.g. Screen replacement, AC deep cleaning, CCTV, RO)..."
              value={activeSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-10 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-600 focus:outline-none focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]"
            />
            <Search className="w-5 h-5 text-zinc-600 absolute left-3.5 top-3.5" />
            {activeSearch && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-3.5 text-zinc-600 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Pricing Basis Pill Filter */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-[#252B26] flex items-center gap-1 shrink-0 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Pricing Basis:</span>
            </span>
            {pricingBasisOptions.map((pb) => {
              const isSelected = activePricingBasis === pb;
              return (
                <button
                  key={pb}
                  type="button"
                  onClick={() => handlePricingBasisChange(pb)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#0D0F0D] text-[#BBFA47]'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {pb}
                </button>
              );
            })}
          </div>

          {/* 16 Category Filter Pills */}
          <div className="pt-2 border-t border-zinc-100">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                  activeCategory === 'All'
                    ? 'bg-[#BBFA47] text-[#0D0F0D] shadow-sm'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                All 16 Categories ({services.length})
              </button>

              {categories.map((cat) => {
                const isSelected =
                  activeCategory.toLowerCase() === cat.name.toLowerCase() ||
                  activeCategory.toLowerCase() === cat.slug?.toLowerCase();
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => handleCategoryChange(cat.name)}
                    className={`text-xs px-3.5 py-1.5 rounded-full font-semibold shrink-0 transition-all ${
                      isSelected
                        ? 'bg-[#BBFA47] text-[#0D0F0D] shadow-sm'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {cat.name} ({cat.serviceCount})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active filters summary */}
          {(activeCategory !== 'All' || activeSearch || activePricingBasis !== 'All') && (
            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-xs text-zinc-600">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-zinc-700">Active Filters:</span>
                {activeCategory !== 'All' && (
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-800">
                    Category: {activeCategory}
                  </span>
                )}
                {activePricingBasis !== 'All' && (
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-800">
                    Basis: {activePricingBasis}
                  </span>
                )}
                {activeSearch && (
                  <span className="bg-zinc-100 px-2 py-0.5 rounded-md text-zinc-800">
                    Search: "{activeSearch}"
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="font-bold text-[#0D0F0D] hover:underline shrink-0 ml-2"
              >
                Clear all
              </button>
            </div>
          )}

        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-[#0D0F0D] border-t-[#BBFA47] rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-zinc-600">Loading service catalogue...</p>
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0D0F0D]">No catalogue service found</h3>
            <p className="text-xs sm:text-sm text-zinc-600">
              CircuitCare exclusively provides the 188 services listed in our verified catalogue. We do not provide unlisted services or unsupported appliances.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="btn-lime text-xs px-4 py-2"
            >
              Reset Filters to All 188 Services
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ServicesPage;
