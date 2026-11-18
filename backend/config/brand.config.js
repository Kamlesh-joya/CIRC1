/**
 * CircuitCare Brand & Business Configuration
 * Single source of truth for business number, WhatsApp endpoint, and brand tokens.
 */

export const BRAND_CONFIG = {
  name: 'CircuitCare',
  tagline: "Glitching? Let's Fix It.",
  slogan: 'Your Tech. Our Care.',
  serviceCity: 'Jaipur',
  serviceRegion: 'Rajasthan, India',
  
  // Single configuration value for business contact and WhatsApp
  businessPhone: '+91 9829139943',
  whatsappRawNumber: '919829139943', // Format required for https://wa.me/919829139943
  businessEmail: 'circuitcareofficial@gmail.com',
  operatingHours: '9:00 AM – 8:00 PM, Monday to Sunday',
  
  serviceNotice: 'Currently serving Jaipur. Our team will confirm availability, pricing, and timing on WhatsApp.',
  whatsappHelperText: 'WhatsApp will open with your enquiry filled in. Tap Send there to share it with CircuitCare.',

  // Exact brand colors matching previous website and hero visual
  colors: {
    lime: '#BBFA47',       // Electric neon green accent
    black: '#0D0F0D',      // Pitch black primary background
    charcoal: '#252B26',   // Dark surface / card background
    offwhite: '#FEFAF7',   // Clean background
    muted: '#A4ADA5',      // Secondary text
    borderDark: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(13, 15, 13, 0.1)',
  },

  trustBadges: [
    '16 appliance & IT categories',
    '188 transparent service options',
    'Approval before extra repair work'
  ],

  jaipurLocalities: [
    'Mansarovar',
    'Vaishali Nagar',
    'Malviya Nagar',
    'Raja Park',
    'C-Scheme',
    'Jagatpura',
    'Tonk Road',
    'Ajmer Road',
    'Vidhyadhar Nagar',
    'Civil Lines',
    'Bani Park',
    'Shyam Nagar',
    'Gopalpura',
    'Pratap Nagar',
    'Sanganer',
    'Jhotwara',
    'Other Jaipur Locality'
  ]
};

export default BRAND_CONFIG;
