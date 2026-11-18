import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { BRAND_CONFIG } from '../config/brand.config.js';
import { CatalogModel } from './Catalog.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure enquiries file exists
if (!fs.existsSync(ENQUIRIES_FILE)) {
  fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
}

export class EnquiryModel {
  static validate(data) {
    const errors = {};

    // 1. Full Name
    if (!data.fullName || !data.fullName.trim()) {
      errors.fullName = 'Full Name is required';
    }

    // 2. Mobile / WhatsApp Number (Indian 10-digit number, starts with 6, 7, 8, or 9)
    const cleanPhone = (data.phone || '').toString().replace(/\D/g, '');
    const phoneValid = /^[6-9]\d{9}$/.test(cleanPhone.slice(-10));
    if (!data.phone || !phoneValid) {
      errors.phone = 'Valid 10-digit Indian mobile number is required (e.g. 9829139943)';
    }

    // 3. Device Category
    if (!data.category || !data.category.trim()) {
      errors.category = 'Device Category is required';
    } else {
      const categories = CatalogModel.getCategories();
      const match = categories.some(
        (c) => c.name.toLowerCase() === data.category.trim().toLowerCase()
      );
      if (!match) {
        errors.category = 'Invalid device category selected';
      }
    }

    // 4. Service Required
    if (!data.serviceId && !data.serviceName) {
      errors.service = 'Service Required is required';
    } else {
      let svc = null;
      if (data.serviceId) {
        svc = CatalogModel.findServiceById(data.serviceId);
      }
      if (!svc && data.serviceName) {
        const services = CatalogModel.getServices();
        svc = services.find((s) => s.name.toLowerCase() === data.serviceName.trim().toLowerCase());
      }
      if (!svc) {
        errors.service = 'Selected service not found in catalogue';
      } else if (
        data.category &&
        svc.category.toLowerCase() !== data.category.trim().toLowerCase()
      ) {
        errors.service = 'Selected service does not belong to the chosen device category';
      }
    }

    // 5. Address / Locality
    if (!data.address || !data.address.trim()) {
      errors.address = 'Address / Locality in Jaipur is required';
    }

    // 6. PIN Code (6-digit Indian PIN)
    const cleanPin = (data.pincode || '').toString().trim();
    if (!cleanPin || !/^\d{6}$/.test(cleanPin)) {
      errors.pincode = 'Valid 6-digit PIN code is required (e.g. 302020)';
    }

    // 7. Preferred Date (Optional, cannot be in the past)
    if (data.preferredDate) {
      const selected = new Date(data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selected.getTime()) || selected < today) {
        errors.preferredDate = 'Preferred date cannot be in the past';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Generates the WhatsApp message exactly as specified:
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
  static formatMessage(data) {
    let serviceName = data.serviceName || '';
    let serviceId = data.serviceId || '';

    if (data.serviceId && !serviceName) {
      const svc = CatalogModel.findServiceById(data.serviceId);
      if (svc) serviceName = svc.name;
    } else if (data.serviceName && !serviceId) {
      const services = CatalogModel.getServices();
      const svc = services.find((s) => s.name.toLowerCase() === data.serviceName.trim().toLowerCase());
      if (svc) serviceId = svc.id;
    }

    const lines = [
      'Hello CircuitCare 👋',
      'I would like to enquire about a service.',
      '',
      `Name: ${data.fullName.trim()}`,
      `Mobile / WhatsApp: ${data.phone.trim()}`,
      `Device Category: ${data.category.trim()}`,
      `Service: ${serviceName}`,
      `Service ID: ${serviceId}`
    ];

    if (data.brandModel && data.brandModel.trim()) {
      lines.push(`Brand / Model: ${data.brandModel.trim()}`);
    }

    if (data.issue && data.issue.trim()) {
      lines.push(`Issue: ${data.issue.trim()}`);
    }

    lines.push(`Address / Locality: ${data.address.trim()}`);
    if (data.liveLocation && data.liveLocation.trim()) {
      lines.push(`Live Location: ${data.liveLocation.trim()}`);
    }
    lines.push(`PIN Code: ${data.pincode.toString().trim()}`);

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

  static generateWhatsAppUrl(plainMessage) {
    const encoded = encodeURIComponent(plainMessage);
    return `https://wa.me/${BRAND_CONFIG.whatsappRawNumber}?text=${encoded}`;
  }

  static saveAuditRecord(enquiryData, userId = null) {
    try {
      let records = [];
      if (fs.existsSync(ENQUIRIES_FILE)) {
        records = JSON.parse(fs.readFileSync(ENQUIRIES_FILE, 'utf-8') || '[]');
      }

      const record = {
        id: 'ENQ-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6),
        userId,
        customerName: enquiryData.fullName,
        phone: enquiryData.phone,
        category: enquiryData.category,
        serviceId: enquiryData.serviceId,
        serviceName: enquiryData.serviceName,
        address: enquiryData.address,
        liveLocation: enquiryData.liveLocation || null,
        pincode: enquiryData.pincode,
        createdAt: new Date().toISOString()
      };

      records.push(record);
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(records, null, 2), 'utf-8');
      return record;
    } catch (err) {
      console.error('[EnquiryModel] Error saving enquiry audit record:', err);
      return null;
    }
  }
}

export default EnquiryModel;
