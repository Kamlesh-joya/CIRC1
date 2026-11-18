import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Edit2,
  Check,
  AlertCircle,
  Save,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../lib/brand';

export function ProfilePage() {
  const { user, isAuthenticated, logout, updateProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    locality: '',
    city: 'Jaipur',
    pincode: '302021',
  });
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        locality: user.locality || '',
        city: user.city || 'Jaipur',
        pincode: user.pincode || '302021',
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFAF7] py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-[#0D0F0D] border-t-[#BBFA47] rounded-full animate-spin"></div>
        <p className="mt-3 text-sm text-zinc-600">Loading customer profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login?returnTo=/profile');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!formData.fullName.trim()) {
      setStatusMessage({ type: 'error', text: 'Full name cannot be empty.' });
      return;
    }

    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    if (formData.pincode && !/^[1-9][0-9]{5}$/.test(formData.pincode.trim())) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit PIN code.' });
      return;
    }

    setSaving(true);
    try {
      await updateProfile({
        fullName: formData.fullName.trim(),
        phone: cleanPhone.slice(-10),
        address: formData.address.trim(),
        locality: formData.locality.trim(),
        city: formData.city.trim() || 'Jaipur',
        pincode: formData.pincode.trim() || '302021',
      });
      setStatusMessage({ type: 'success', text: 'Profile and saved service address updated successfully!' });
      setIsEditing(false);
      setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Active Jaipur Customer';

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Profile Card */}
        <div className="bg-white border border-[#0D0F0D]/10 rounded-3xl p-6 sm:p-10 shadow-card space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center text-xl font-bold shadow-md">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#0D0F0D]">
                  {user?.fullName}
                </h1>
                <p className="text-xs text-zinc-600 flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#252B26]" />
                  <span>Verified CircuitCare Customer · Jaipur</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="btn-lime text-xs px-3.5 py-2 flex items-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="btn-dark text-xs px-3.5 py-2 flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {statusMessage.text && (
            <div
              className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 shrink-0 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {isEditing ? (
            /* Edit Form */
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#252B26]">
                  Edit Personal &amp; Service Address Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-sm text-zinc-500 font-semibold">+91</span>
                      <input
                        type="tel"
                        name="phone"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-12 pr-3 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Saved Service Address (House / Flat / Street)
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="e.g. Flat 302, Royal Residency"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      Area / Locality
                    </label>
                    <input
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      placeholder="e.g. Vaishali Nagar"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 302021"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D]"
                    />
                  </div>
                </div>

                <p className="text-[11px] text-zinc-500 italic">
                  Note: Email ({user?.email}) is tied to your account credentials. To request an email change, please contact CircuitCare support.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lime text-xs px-5 py-2.5 font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving Changes...' : 'Save Profile'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn-dark text-xs px-4 py-2.5 flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#252B26] mb-3">
                  Account Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
                    <Mail className="w-5 h-5 text-zinc-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                        Email Address
                      </span>
                      <span className="text-sm font-bold text-[#0D0F0D] break-all">{user?.email}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
                    <Phone className="w-5 h-5 text-zinc-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block">
                        Mobile Number
                      </span>
                      <span className="text-sm font-bold text-[#0D0F0D]">+91 {user?.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#252B26] mb-3">
                  Saved Service Address (Jaipur)
                </h2>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#252B26] mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-[#0D0F0D]">
                        {user?.address || user?.locality ? (
                          <>
                            {user?.address && <span>{user.address}, </span>}
                            {user?.locality && <span>{user.locality}, </span>}
                            <span>{user?.city || 'Jaipur'} — {user?.pincode || '302021'}</span>
                          </>
                        ) : (
                          <span className="text-zinc-500 font-normal italic">
                            No default service address saved yet. Click "Edit Profile" above to save your address for faster booking.
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-zinc-500">
                        This address will automatically prefill your service enquiries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-zinc-500 flex items-center gap-2 pt-2 border-t border-zinc-100">
                <Calendar className="w-4 h-4 text-zinc-400" />
                <span>Customer account created: {formattedDate}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-100 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#252B26]">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/services"
                className="btn-lime text-xs sm:text-sm py-3 justify-center font-bold"
              >
                <span>Browse 188 Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/enquiry"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-xl border border-zinc-200 text-[#0D0F0D] font-semibold text-xs sm:text-sm hover:bg-zinc-50 transition-colors"
              >
                <span>Schedule a Repair</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
