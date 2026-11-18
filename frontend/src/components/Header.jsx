import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X, LogOut, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../lib/brand';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Enquiry', path: '/enquiry' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed-header-black ${scrolled ? 'is-scrolled' : ''}`}
      style={{
        backgroundColor: '#0D0F0D',
        color: '#FEFAF7',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#252B26] border border-white/10 flex items-center justify-center p-1 group-hover:border-[#BBFA47]/50 transition-colors">
              <img
                src="/assets/circuitcare-logo.svg"
                alt="CircuitCare Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              circuit<span className="text-[#BBFA47]">care</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors hover:text-[#BBFA47] ${
                    isActive ? 'text-[#BBFA47]' : 'text-[#A4ADA5]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions (Auth & Book Button) */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#252B26] border border-white/10 text-xs font-semibold text-white hover:border-[#BBFA47]/40 transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[#BBFA47]" />
                  <span className="truncate max-w-[120px]">{user?.fullName?.split(' ')[0]}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-xl text-[#A4ADA5] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#252B26] border border-white/10 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            <Link
              to="/services"
              className="btn-lime text-xs sm:text-sm px-5 py-2.5 font-bold shadow-md shadow-[#BBFA47]/20"
            >
              Book a Service
            </Link>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2.5 md:hidden">
            <Link
              to="/services"
              className="btn-lime text-xs px-3.5 py-1.5 font-bold"
            >
              Book
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#252B26] border border-white/10 text-[#FEFAF7] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-white/10 px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 shadow-2xl"
          style={{ backgroundColor: '#0D0F0D' }}
        >
          {/* Mobile Nav Links */}
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-[#252B26] hover:text-[#BBFA47] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth actions */}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#252B26] text-sm text-white"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#BBFA47]" />
                    <span className="font-semibold">{user?.fullName}</span>
                  </div>
                  <span className="text-xs text-[#A4ADA5]">My Profile</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-xs text-[#A4ADA5] hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-dark text-center text-xs py-2.5"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-lime text-center text-xs py-2.5"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <div className="pt-2 text-center text-xs text-[#A4ADA5] flex items-center justify-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#BBFA47]" />
              <span>Jaipur Helpline: {BRAND.businessPhone}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
