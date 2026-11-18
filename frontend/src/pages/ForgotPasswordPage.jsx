import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, KeyRound } from 'lucide-react';
import { api } from '../lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [debugToken, setDebugToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.forgotPassword(email.trim());
      setSubmitted(true);
      if (res.data?.resetToken) {
        setDebugToken(res.data.resetToken);
      }
    } catch (err) {
      setError(err.message || 'Unable to process password reset');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#0D0F0D]/10 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#0D0F0D]">Reset Password</h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Enter your account email to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="space-y-5 text-center">
            <div className="p-4 rounded-2xl bg-green-50 border border-green-200 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-bold text-green-900 text-sm">Request Sent</h3>
              <p className="text-xs text-green-800 leading-relaxed">
                If <strong>{email}</strong> is associated with an active CircuitCare account, you can proceed with resetting your password.
              </p>
            </div>

            {debugToken && (
              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-left text-xs space-y-1.5">
                <span className="font-bold text-zinc-700 block">Direct Reset Link:</span>
                <Link
                  to={`/reset-password?token=${debugToken}`}
                  className="text-[#0D0F0D] font-bold underline break-all"
                >
                  Click here to set a new password
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/login"
                className="btn-lime w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]"
                />
                <Mail className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-lime py-3 text-sm font-bold flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Generating instructions...' : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center pt-2 border-t border-zinc-100 text-xs text-zinc-600">
          <Link to="/login" className="font-bold text-[#0D0F0D] hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ForgotPasswordPage;
