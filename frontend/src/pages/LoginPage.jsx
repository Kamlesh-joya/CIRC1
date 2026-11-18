import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Validate return URLs so redirects remain within this website
  const rawReturnTo = searchParams.get('returnTo');
  const returnTo = rawReturnTo && rawReturnTo.startsWith('/') && !rawReturnTo.startsWith('//')
    ? rawReturnTo
    : '/services';

  const serviceId = searchParams.get('serviceId');
  const category = searchParams.get('category');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);

      // Construct return destination preserving service query params
      const destinationParams = new URLSearchParams();
      if (serviceId) destinationParams.set('serviceId', serviceId);
      if (category) destinationParams.set('category', category);

      let targetUrl = returnTo;
      const paramStr = destinationParams.toString();
      if (paramStr && !targetUrl.includes('?')) {
        targetUrl = `${targetUrl}?${paramStr}`;
      } else if (paramStr && targetUrl.includes('?')) {
        targetUrl = `${targetUrl}&${paramStr}`;
      }

      navigate(targetUrl, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const signupLink = `/signup?returnTo=${encodeURIComponent(returnTo)}${
    serviceId ? `&serviceId=${serviceId}` : ''
  }${category ? `&category=${category}` : ''}`;

  return (
    <div className="min-h-screen bg-[#FEFAF7] py-12 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-md bg-white border border-[#0D0F0D]/10 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#0D0F0D]">Welcome Back</h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Sign in to continue your CircuitCare enquiry in Jaipur.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

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

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-zinc-700">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-[#0D0F0D] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#0D0F0D] focus:outline-none focus:border-[#0D0F0D] focus:ring-1 focus:ring-[#0D0F0D]"
              />
              <Lock className="w-4 h-4 text-zinc-600 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-zinc-500 hover:text-black focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn-lime py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-zinc-100 text-xs text-zinc-600">
          Don't have an account yet?{' '}
          <Link to={signupLink} className="font-bold text-[#0D0F0D] hover:underline">
            Create an account
          </Link>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;
