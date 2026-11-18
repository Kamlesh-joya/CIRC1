/**
 * CircuitCare Frontend Brand Tokens & WhatsApp Formatter
 */

export const BRAND = {
  name: 'CircuitCare',
  tagline: "Glitching? Let's Fix It.",
  slogan: 'Your Tech. Our Care.',
  serviceCity: 'Jaipur',
  
  // Single configuration value
  businessPhone: '+91 9829139943',
  whatsappRawNumber: '919829139943',
  supportEmail: 'circuitcareofficial@gmail.com',
  operatingHours: '9:00 AM – 8:00 PM, Monday to Sunday',

  serviceNotice: 'Currently serving Jaipur. Our team will confirm availability, pricing, and timing on WhatsApp.',
  whatsappHelperText: 'WhatsApp will open with your enquiry filled in. Tap Send there to share it with CircuitCare.',

  colors: {
    lime: '#BBFA47',
    black: '#0D0F0D',
    charcoal: '#252B26',
    offwhite: '#FEFAF7',
    muted: '#A4ADA5',
  },

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

/**
 * Format enquiry message strictly according to specification:
 * 
 * Hello CircuitCare 👋
 * I would like to enquire about a service.
 * 
 * Name: {fullName}
 * Mobile / WhatsApp: {phone}
 * Device Category: {category}
 * Service: {serviceName}
 * Service ID: {serviceId}
 * Brand / Model: {brandModel}
 * Issue: {issue}
 * Address / Locality: {address}
 * PIN Code: {pincode}
 * Preferred Date: {date}
 * Preferred Time: {time}
 * 
 * Please confirm availability, charges, and the next steps.
 */
export function formatWhatsAppMessage(data) {
  const lines = [
    'Hello CircuitCare 👋',
    'I would like to enquire about a service.',
    '',
    `Name: ${data.fullName?.trim() || ''}`,
    `Mobile / WhatsApp: ${data.phone?.trim() || ''}`,
    `Device Category: ${data.category?.trim() || ''}`,
    `Service: ${data.serviceName?.trim() || ''}`,
    `Service ID: ${data.serviceId?.trim() || ''}`
  ];

  if (data.brandModel && data.brandModel.trim()) {
    lines.push(`Brand / Model: ${data.brandModel.trim()}`);
  }

  if (data.issue && data.issue.trim()) {
    lines.push(`Issue: ${data.issue.trim()}`);
  }

  lines.push(`Address / Locality: ${data.address?.trim() || ''}`);
  if (data.liveLocation && data.liveLocation.trim()) {
    lines.push(`Live Location: ${data.liveLocation.trim()}`);
  }
  lines.push(`PIN Code: ${(data.pincode || '').toString().trim()}`);

  if (data.preferredDate && data.preferredDate.trim()) {
    lines.push(`Preferred Date: ${data.preferredDate.trim()}`);
  }

  if (data.preferredTime && data.preferredTime.trim()) {
    lines.push(`Preferred Time: ${data.preferredTime.trim()}`);
  }

  lines.push('');
  lines.push('Please confirm availability, charges, and the next steps.');

  return lines.join('\n');
}

export function buildWhatsAppLink(plainMessage) {
  const encoded = encodeURIComponent(plainMessage);
  return `https://wa.me/${BRAND.whatsappRawNumber}?text=${encoded}`;
}
