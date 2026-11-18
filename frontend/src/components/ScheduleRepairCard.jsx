import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Check,
  Copy,
  Phone as PhoneIcon,
  AlertCircle,
  Calendar,
  Clock,
  ChevronDown,
  Info,
  ShieldCheck,
  MapPin,
  Loader2,
  Edit3,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { BRAND, formatWhatsAppMessage, buildWhatsAppLink } from '../lib/brand';

export function ScheduleRepairCard({
  initialCategory = '',
  initialServiceId = '',
  className = '',
  standalone = false,
}) {
  const { user, isAuthenticated, saveDraftEnquiry, clearDraftEnquiry, draftEnquiry } = useAuth();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [categoryServices, setCategoryServices] = useState([]);
  const [showScheduling, setShowScheduling] = useState(false);

  // Flow step: 'form' | 'review'
  const [step, setStep] = useState('form');

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    area: '',
    liveLocation: '',
    category: '',
    serviceId: '',
    serviceName: '',
    brandModel: '',
    issue: '',
    pincode: '302021',
    preferredDate: '',
    preferredTime: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [preparedEnquiry, setPreparedEnquiry] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load catalogue data
  useEffect(() => {
    async function loadData() {
      try {
        const [cats, svcs] = await Promise.all([
          api.getCategories(),
          api.getServices(),
        ]);
        setCategories(cats || []);
        setAllServices(svcs || []);
      } catch (err) {
        console.error('Error loading catalogue for schedule repair card:', err);
      }
    }
    loadData();
  }, []);

  // Prefill from user profile or draft without overwriting profile
  useEffect(() => {
    const effectiveCategory =
      initialCategory || draftEnquiry?.category || formData.category || '';
    const effectiveServiceId =
      initialServiceId || draftEnquiry?.serviceId || formData.serviceId || '';

    setFormData((prev) => {
      let svcName = prev.serviceName;
      if (effectiveServiceId && allServices.length > 0) {
        const found = allServices.find((s) => s.id === effectiveServiceId);
        if (found) svcName = found.name;
      }

      // Saved address from user profile
      const defaultUserAddress = user?.address
        ? `${user.address}${user.locality ? `, ${user.locality}` : ''}`
        : user?.locality || '';

      return {
        ...prev,
        fullName: prev.fullName || draftEnquiry?.fullName || user?.fullName || '',
        phone: prev.phone || draftEnquiry?.phone || user?.phone || '',
        area: prev.area || draftEnquiry?.address || defaultUserAddress,
        liveLocation: prev.liveLocation || draftEnquiry?.liveLocation || '',
        pincode: prev.pincode || draftEnquiry?.pincode || user?.pincode || '302021',
        category: effectiveCategory,
        serviceId: effectiveServiceId,
        serviceName: svcName,
        issue: prev.issue || draftEnquiry?.issue || '',
        brandModel: prev.brandModel || draftEnquiry?.brandModel || '',
        preferredDate: prev.preferredDate || draftEnquiry?.preferredDate || '',
        preferredTime: prev.preferredTime || draftEnquiry?.preferredTime || '',
      };
    });
  }, [user, draftEnquiry, initialCategory, initialServiceId, allServices]);

  // Update services when category changes
  useEffect(() => {
    if (!formData.category) {
      setCategoryServices([]);
      return;
    }

    const filtered = allServices.filter(
      (s) => s.category.toLowerCase() === formData.category.toLowerCase()
    );
    setCategoryServices(filtered);

    // If existing serviceId not in new category, reset it
    if (formData.serviceId) {
      const match = filtered.find((s) => s.id === formData.serviceId);
      if (!match) {
        setFormData((prev) => ({ ...prev, serviceId: '', serviceName: '' }));
      }
    }
  }, [formData.category, allServices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'serviceId') {
        const match = allServices.find((s) => s.id === value);
        updated.serviceName = match ? match.name : '';
      }
      return updated;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    setLocationSuccess(false);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://maps.google.com/?q=${latitude.toFixed(6)},${longitude.toFixed(6)}`;
        setFormData((prev) => ({
          ...prev,
          liveLocation: mapsUrl,
          area: prev.area || 'Jaipur (GPS Location)'
        }));
        setLocating(false);
        setLocationSuccess(true);
      },
      (error) => {
        setLocating(false);
        if (error.code === 1) {
          setLocationError('Location permission denied. You can paste your Google Maps link or enter your landmark manually.');
        } else {
          setLocationError('Unable to detect live location. Please paste or enter your location manually.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your name';
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!formData.phone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      errs.phone = 'Enter valid 10-digit number (starts with 6, 7, 8, or 9)';
    }

    if (!formData.area.trim()) {
      errs.area = 'Please enter your Jaipur address or locality';
    }

    if (!formData.pincode || !/^[1-9][0-9]{5}$/.test(formData.pincode.toString().trim())) {
      errs.pincode = 'Please enter a valid 6-digit Indian PIN code';
    }

    if (!formData.category) {
      errs.category = 'Please select a device category';
    }

    if (!formData.serviceId) {
      errs.serviceId = 'Please select a service from our catalogue';
    }

    if (formData.preferredDate) {
      const selected = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selected.getTime()) || selected < today) {
        errs.preferredDate = 'Preferred date cannot be in the past';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 1 -> Step 2 (Proceed to Compact Review)
  const handleProceedToReview = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Save draft enquiry in session so refresh or login returns without data loss
    saveDraftEnquiry({
      ...formData,
      address: formData.area,
    });

    // If not authenticated, require login first
    if (!isAuthenticated) {
      const returnParams = new URLSearchParams();
      if (formData.serviceId) returnParams.set('serviceId', formData.serviceId);
      if (formData.category) returnParams.set('category', formData.category);
      navigate(`/login?returnTo=${encodeURIComponent(`/enquiry?${returnParams.toString()}`)}`);
      return;
    }

    // Prepare payload
    const payload = {
      ...formData,
      address: formData.area,
      pincode: formData.pincode || '302021',
    };

    const plainMsg = formatWhatsAppMessage(payload);
    const url = buildWhatsAppLink(plainMsg);

    setPreparedEnquiry({
      whatsappUrl: url,
      messageText: plainMsg,
      businessPhone: BRAND.businessPhone,
      helperText: BRAND.whatsappHelperText,
      serviceNotice: BRAND.serviceNotice,
    });

    setStep('review');
  };

  // Step 2 -> Launch WhatsApp
  const handleLaunchWhatsApp = async () => {
    setSubmitting(true);
    const payload = {
      ...formData,
      address: formData.area,
      pincode: formData.pincode || '302021',
    };

    try {
      // Call backend to record audit and format message
      const result = await api.prepareEnquiry(payload);
      setPreparedEnquiry(result);
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      // Fallback
      if (preparedEnquiry?.whatsappUrl) {
        window.open(preparedEnquiry.whatsappUrl, '_blank', 'noopener,noreferrer');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyText = async () => {
    if (!preparedEnquiry?.messageText) return;
    try {
      await navigator.clipboard.writeText(preparedEnquiry.messageText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedServiceObj = allServices.find((s) => s.id === formData.serviceId);

  return (
    <div
      className={`bg-white border border-[#0D0F0D]/10 rounded-3xl p-6 sm:p-8 shadow-card max-w-xl mx-auto transition-all ${className}`}
    >
      {step === 'form' ? (
        /* STEP 1: ENQUIRY DETAILS FORM */
        <>
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0D0F0D] tracking-tight">
              Schedule a repair
            </h2>
            <p className="text-sm text-zinc-600 mt-1.5 leading-relaxed">
              Send us your details on WhatsApp — we’ll confirm your slot in minutes.
            </p>
          </div>

          <form onSubmit={handleProceedToReview} className="space-y-4">
            {/* YOUR NAME */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                YOUR NAME <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. Priya Sharma"
                className={`w-full bg-[#FEFAF7] border rounded-2xl px-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-all ${
                  errors.fullName
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-zinc-200 focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]'
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* 2-Column: PHONE & PIN CODE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* PHONE */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                  PHONE <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 text-sm font-semibold text-zinc-500">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    maxLength={10}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9829139943"
                    className={`w-full bg-[#FEFAF7] border rounded-2xl pl-12 pr-3 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-all ${
                      errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-zinc-200 focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]'
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* PIN CODE */}
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                  JAIPUR PIN CODE <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="e.g. 302021"
                  className={`w-full bg-[#FEFAF7] border rounded-2xl px-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-all ${
                    errors.pincode
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-zinc-200 focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]'
                  }`}
                />
                {errors.pincode && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.pincode}
                  </p>
                )}
              </div>
            </div>

            {/* AREA / LOCALITY */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                ADDRESS / AREA / LOCALITY <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Flat 204, Vaishali Nagar or Near Gaurav Tower"
                className={`w-full bg-[#FEFAF7] border rounded-2xl px-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white transition-all ${
                  errors.area
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-zinc-200 focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]'
                }`}
              />
              {errors.area && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.area}
                </p>
              )}
            </div>

            {/* LIVE LOCATION BAR */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700">
                  LIVE LOCATION / MAPS LINK (OPTIONAL)
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locating}
                  className="text-[11px] font-bold text-[#0D0F0D] hover:text-black inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BBFA47] hover:bg-[#aee83e] active:scale-95 transition-all shadow-sm cursor-pointer"
                  title="Detect your current location using device GPS"
                >
                  {locating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0D0F0D]" />
                      <span>Detecting...</span>
                    </>
                  ) : locationSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0D0F0D]" />
                      <span>Location Added ✓</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3.5 h-3.5 text-[#0D0F0D]" />
                      <span>📍 Add Live Location</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="liveLocation"
                  value={formData.liveLocation}
                  onChange={handleChange}
                  placeholder="Paste Google Maps link or click 'Add Live Location' above"
                  className="w-full bg-[#FEFAF7] border border-zinc-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D] transition-all"
                />
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
              {locationError && (
                <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{locationError}</span>
                </p>
              )}
              {locationSuccess && (
                <p className="text-[11px] text-green-700 mt-1 flex items-center gap-1 font-medium">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>Live GPS location attached — technician will navigate directly to your door.</span>
                </p>
              )}
            </div>

            {/* DEVICE CATEGORY & SERVICE REQUIRED */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                  DEVICE CATEGORY <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full bg-[#FEFAF7] border rounded-2xl px-3.5 py-3 text-sm text-[#0D0F0D] appearance-none focus:outline-none focus:bg-white transition-all ${
                      errors.category
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-zinc-200 focus:border-[#0D0F0D]'
                    }`}
                  >
                    <option value="">-- Choose Category --</option>
                    {categories.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                {errors.category && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                  SERVICE REQUIRED <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="serviceId"
                    value={formData.serviceId}
                    onChange={handleChange}
                    disabled={!formData.category}
                    className={`w-full bg-[#FEFAF7] border rounded-2xl px-3.5 py-3 text-sm text-[#0D0F0D] appearance-none focus:outline-none focus:bg-white transition-all disabled:opacity-50 disabled:bg-zinc-100 ${
                      errors.serviceId
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-zinc-200 focus:border-[#0D0F0D]'
                    }`}
                  >
                    <option value="">
                      {!formData.category ? 'Select category first' : '-- Select Service --'}
                    </option>
                    {categoryServices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.pricingBasis || 'Estimate'})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
                {errors.serviceId && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.serviceId}
                  </p>
                )}
              </div>
            </div>

            {/* BRAND & MODEL (Optional) */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                BRAND &amp; MODEL (OPTIONAL)
              </label>
              <input
                type="text"
                name="brandModel"
                value={formData.brandModel}
                onChange={handleChange}
                placeholder="e.g. Samsung 1.5 Ton Split / HP Pavilion 15"
                className="w-full bg-[#FEFAF7] border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#0D0F0D] transition-all"
              />
            </div>

            {/* APPLIANCE & ISSUE (Optional) */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-700 mb-1.5">
                APPLIANCE &amp; ISSUE DESCRIPTION (OPTIONAL)
              </label>
              <textarea
                name="issue"
                rows={3}
                value={formData.issue}
                onChange={handleChange}
                placeholder="e.g. Split AC not cooling properly, occasional tripping"
                className="w-full bg-[#FEFAF7] border border-zinc-200 rounded-2xl px-4 py-3 text-sm text-[#0D0F0D] placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D] transition-all resize-y"
              />
            </div>

            {/* Preferred Date & Time Slot Toggle */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowScheduling(!showScheduling)}
                className="text-xs font-semibold text-[#0D0F0D] hover:underline flex items-center gap-1"
              >
                <Calendar className="w-3.5 h-3.5 text-[#252B26]" />
                <span>{showScheduling ? '– Hide Preferred Date & Time' : '+ Add Preferred Date & Time (Optional)'}</span>
              </button>

              {showScheduling && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 p-3.5 bg-zinc-50 rounded-2xl border border-zinc-100">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      min={todayStr}
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    />
                    {errors.preferredDate && (
                      <p className="text-[10px] text-red-500 mt-1">{errors.preferredDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-3 py-2 text-xs text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    >
                      <option value="">Any Convenient Time</option>
                      <option value="Morning (9 AM - 12 PM)">Morning (9 AM – 12 PM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM – 4 PM)</option>
                      <option value="Evening (4 PM - 8 PM)">Evening (4 PM – 8 PM)</option>
                    </select>
                  </div>
                  <p className="text-[10px] text-zinc-500 sm:col-span-2 italic">
                    * Preferred slot is subject to technician availability and confirmation on WhatsApp.
                  </p>
                </div>
              )}
            </div>

            {/* Notice */}
            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100 text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-[#252B26] shrink-0 mt-0.5" />
              <span>
                Currently serving Jaipur. Our team will confirm availability, pricing, and timing on WhatsApp.
              </span>
            </div>

            {/* Proceed to Review Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[50px] bg-[#BBFA47] hover:bg-[#aee83e] active:scale-[0.99] text-[#0D0F0D] font-extrabold text-sm sm:text-base rounded-full flex items-center justify-center gap-2 shadow-md shadow-[#BBFA47]/20 transition-all cursor-pointer"
              >
                <span>Review Enquiry Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-zinc-500 mt-2">
                Step 1 of 2: Review your details before opening WhatsApp
              </p>
            </div>
          </form>
        </>
      ) : (
        /* STEP 2: COMPACT REVIEW STEP (Strict Requirement 7 & 8) */
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <span className="text-[10px] font-bold text-[#252B26] uppercase tracking-wider bg-[#BBFA47]/40 px-2.5 py-0.5 rounded-full">
                Step 2 of 2 · Enquiry Review
              </span>
              <h2 className="text-2xl font-black text-[#0D0F0D] tracking-tight mt-1">
                Review Your Enquiry
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-xs font-bold text-zinc-600 hover:text-black flex items-center gap-1 px-3 py-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>

          {/* Compact Summary Cards */}
          <div className="bg-zinc-50 rounded-2xl p-4 sm:p-5 border border-zinc-200/80 space-y-3.5 text-xs">
            {/* Service & Category */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Service Selected
                </span>
                <p className="text-sm font-black text-[#0D0F0D] mt-0.5">
                  {formData.serviceName || 'Selected Service'}
                </p>
                <p className="text-zinc-600 mt-0.5">
                  Category: <strong className="text-zinc-800">{formData.category}</strong> · ID: <code className="bg-white px-1.5 py-0.5 rounded border border-zinc-200 font-mono text-[11px]">{formData.serviceId}</code>
                </p>
              </div>
              <span className="text-xs font-bold bg-white text-[#0D0F0D] px-2.5 py-1 rounded-lg border border-zinc-200 shrink-0">
                {selectedServiceObj?.pricingBasis || 'Service Estimate'}
              </span>
            </div>

            {/* Customer & Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-zinc-200">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Customer
                </span>
                <p className="font-bold text-[#0D0F0D] mt-0.5">{formData.fullName}</p>
                <p className="text-zinc-600">+91 {formData.phone}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Jaipur Service Address
                </span>
                <p className="font-bold text-[#0D0F0D] mt-0.5">{formData.area}</p>
                <p className="text-zinc-600">PIN Code: {formData.pincode}</p>
              </div>
            </div>

            {/* Optional Details if provided */}
            {(formData.liveLocation || formData.brandModel || formData.issue || formData.preferredDate) && (
              <div className="space-y-2 pt-1 text-zinc-700">
                {formData.liveLocation && (
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#252B26] shrink-0 mt-0.5" />
                    <span>Live GPS Link: <a href={formData.liveLocation} target="_blank" rel="noreferrer" className="text-blue-600 underline font-mono text-[11px] break-all">{formData.liveLocation}</a></span>
                  </div>
                )}
                {formData.brandModel && (
                  <p><strong>Appliance:</strong> {formData.brandModel}</p>
                )}
                {formData.issue && (
                  <p><strong>Reported Issue:</strong> {formData.issue}</p>
                )}
                {formData.preferredDate && (
                  <p>
                    <strong>Requested Slot:</strong> {formData.preferredDate} {formData.preferredTime ? `(${formData.preferredTime})` : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Official Scope Notice */}
          <div className="p-3.5 bg-zinc-100/70 rounded-2xl border border-zinc-200 text-xs text-zinc-700 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#252B26] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-[#0D0F0D]">CircuitCare Service Policy</span>
              Currently serving Jaipur. Our team will confirm availability, pricing, and timing on WhatsApp.
            </div>
          </div>

          {/* Action Buttons: Continue to WhatsApp & Edit */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleLaunchWhatsApp}
              disabled={submitting}
              className="w-full min-h-[52px] bg-[#BBFA47] hover:bg-[#aee83e] active:scale-[0.99] text-[#0D0F0D] font-extrabold text-base rounded-full flex items-center justify-center gap-2.5 shadow-md shadow-[#BBFA47]/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current transform rotate-45 -mt-0.5" />
              <span>{submitting ? 'Opening WhatsApp...' : 'Continue to WhatsApp'}</span>
            </button>

            {/* Helper Text (Requirement 8) */}
            <p className="text-center text-xs text-zinc-600 leading-relaxed px-2">
              WhatsApp will open with your enquiry filled in. Tap Send there to share it with CircuitCare.
            </p>

            <button
              type="button"
              onClick={() => setStep('form')}
              className="w-full py-2.5 rounded-full border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Back to Edit Details</span>
            </button>
          </div>

          {/* Fallback & Assistance Box */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <div className="bg-[#252B26] text-[#FEFAF7] rounded-2xl p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#BBFA47] uppercase tracking-wider">
                  Enquiry Message Text
                </span>
                <span className="text-[#A4ADA5]">Helpline: {BRAND.businessPhone}</span>
              </div>
              <div className="bg-[#0D0F0D] rounded-xl p-3 font-mono text-[11px] text-zinc-300 whitespace-pre-wrap max-h-36 overflow-y-auto select-all">
                {preparedEnquiry?.messageText}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleLaunchWhatsApp}
                  className="btn-lime text-xs px-3.5 py-1.5 font-bold flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open WhatsApp Again</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="btn-dark text-xs px-3.5 py-1.5 font-semibold flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#BBFA47]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Enquiry Text'}</span>
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 text-center italic">
              Opening WhatsApp launches your enquiry draft. Your booking is confirmed only after our Jaipur coordination team confirms availability and charges with you on WhatsApp.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ScheduleRepairCard;
