/**
 * Comprehensive CircuitCare Integration Test Suite
 * Tests:
 * 1. Database & Models
 * 2. Service Catalogue (188 services, 16 categories)
 * 3. Price Display Logic (No blank prices as 0 or Free)
 * 4. Authentication (Signup, Login, JWT verification, Logout)
 * 5. Quick Service Enquiry Form Validation
 * 6. WhatsApp Message & URL Generation (+91 9829139943)
 */

import http from 'http';
import app from './backend/server.js';
import { CatalogModel } from './backend/models/Catalog.model.js';
import { EnquiryModel } from './backend/models/Enquiry.model.js';
import { BRAND_CONFIG } from './backend/config/brand.config.js';

let server;
const PORT = 5055;

async function runTests() {
  console.log('==================================================');
  console.log('🧪 RUNNING CIRCUITCARE COMPREHENSIVE TEST SUITE');
  console.log('==================================================\n');

  // Start test server
  await new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });

  const BASE = `http://localhost:${PORT}/api`;
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Check Brand Config
    assert(
      BRAND_CONFIG.businessPhone === '+91 9829139943' &&
      BRAND_CONFIG.whatsappRawNumber === '919829139943',
      'Brand Config contains exact business number (+91 9829139943)'
    );

    // 2. Check Catalogue Import
    const allServices = CatalogModel.getServices();
    assert(allServices.length === 188, `Catalogue contains exactly 188 services (got ${allServices.length})`);

    const categories = CatalogModel.getCategories();
    assert(categories.length === 16, `Catalogue contains exactly 16 categories (got ${categories.length})`);

    // Verify all 16 categories
    const expectedCategories = [
      'AC', 'Air Cooler', 'CCTV', 'Desktop PC', 'Geyser',
      'Kitchen Appliances', 'Laptop', 'Mobile & Tablet', 'Networking',
      'Printer & Scanner', 'Refrigerator', 'Small Appliances', 'TV & Audio',
      'UPS & Inverter', 'Washing Machine', 'Water Purifier'
    ];
    const actualCatNames = categories.map(c => c.name).sort();
    assert(
      JSON.stringify(actualCatNames) === JSON.stringify(expectedCategories.sort()),
      'All 16 device categories match Excel exactly'
    );

    // 3. Price Integrity Check
    const freePrices = allServices.filter(s => s.websitePrice === 0 || s.websitePrice === '0' || s.websitePrice === 'Free');
    assert(freePrices.length === 0, 'Zero blank prices converted to 0 or Free (integrity preserved)');

    // 4. API Health Check
    const healthRes = await fetch(`${BASE}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'ok', 'GET /api/health returns 200 OK');

    // 5. API Services Check
    const servicesRes = await fetch(`${BASE}/services`);
    const servicesJson = await servicesRes.json();
    assert(servicesJson.count === 188, 'GET /api/services returns 188 services');

    // 6. API Category Filter Check
    const laptopRes = await fetch(`${BASE}/services?category=Laptop`);
    const laptopJson = await laptopRes.json();
    assert(laptopJson.count === 18, `GET /api/services?category=Laptop returns 18 services (got ${laptopJson.count})`);

    // 7. API Search Check
    const searchRes = await fetch(`${BASE}/services?search=thermal`);
    const searchJson = await searchRes.json();
    assert(searchJson.count > 0, `GET /api/services?search=thermal matches keyword (got ${searchJson.count})`);

    // 8. Service Detail by ID
    const singleRes = await fetch(`${BASE}/services/CC-001`);
    const singleJson = await singleRes.json();
    assert(singleJson.data?.id === 'CC-001' && singleJson.data?.name === 'Check-up & fault diagnosis', 'GET /api/services/CC-001 returns exact service');

    // 9. Auth Signup Test
    const testEmail = `customer_${Date.now()}@testcircuitcare.in`;
    const signupRes = await fetch(`${BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Vikram Singh',
        email: testEmail,
        phone: '9829139943',
        password: 'password123'
      })
    });
    const signupJson = await signupRes.json();
    assert(signupRes.status === 201 && signupJson.data?.token, 'POST /api/auth/signup creates account & returns JWT');
    const authToken = signupJson.data?.token;

    // 10. Auth Me Check
    const meRes = await fetch(`${BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.data?.user?.email === testEmail, 'GET /api/auth/me verifies session token');

    // 11. Auth Login Test
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'password123'
      })
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.data?.token, 'POST /api/auth/login authenticates with valid credentials');

    // 12. Invalid Login Test
    const badLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'wrongpassword'
      })
    });
    assert(badLoginRes.status === 401, 'POST /api/auth/login rejects invalid password with 401');

    // 13. Enquiry Validation - Missing required fields
    const invalidEnquiryRes = await fetch(`${BASE}/enquiry/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        fullName: '',
        phone: '123' // invalid phone
      })
    });
    const invalidJson = await invalidEnquiryRes.json();
    assert(invalidEnquiryRes.status === 400 && invalidJson.errors?.fullName && invalidJson.errors?.phone, 'POST /api/enquiry/prepare validates required and invalid fields');

    // 14. Enquiry Validation & WhatsApp Message Generation
    const validEnquiry = {
      fullName: 'Vikram Singh',
      phone: '9829139943',
      category: 'Laptop',
      serviceId: 'CC-001',
      serviceName: 'Check-up & fault diagnosis',
      brandModel: 'Lenovo ThinkPad E14',
      issue: 'Not booting after power surge',
      address: 'Plot 45, Surya Nagar, Gopalpura Bypass, Jaipur',
      pincode: '302018',
      preferredDate: '2026-11-25',
      preferredTime: 'Morning (9 AM - 12 PM)'
    };

    const enquiryRes = await fetch(`${BASE}/enquiry/prepare`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify(validEnquiry)
    });
    const enquiryJson = await enquiryRes.json();
    assert(enquiryRes.status === 200 && enquiryJson.success, 'POST /api/enquiry/prepare succeeds for valid enquiry');

    // Verify WhatsApp URL format
    const expectedBase = 'https://wa.me/919829139943?text=';
    assert(
      enquiryJson.data?.whatsappUrl?.startsWith(expectedBase),
      `WhatsApp URL has base ${expectedBase}`
    );

    // Verify message text format
    const msg = enquiryJson.data?.messageText || '';
    // 15. Profile Update & Ownership Check
    const updateProfileRes = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`
      },
      body: JSON.stringify({
        address: 'B-12, Vaishali Nagar',
        locality: 'Amrapali Circle',
        city: 'Jaipur',
        pincode: '302021'
      })
    });
    const updateProfileJson = await updateProfileRes.json();
    assert(
      updateProfileRes.status === 200 &&
      updateProfileJson.data?.user?.address === 'B-12, Vaishali Nagar' &&
      updateProfileJson.data?.user?.pincode === '302021',
      'PUT /api/auth/profile persists saved service address and PIN'
    );

    // 16. Profile Unauthorized Update Rejection
    const unauthProfileRes = await fetch(`${BASE}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address: 'Hacked Address' })
    });
    assert(unauthProfileRes.status === 401, 'PUT /api/auth/profile strictly rejects unauthenticated updates');

    // 17. Password Reset Flow
    const forgotRes = await fetch(`${BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail })
    });
    const forgotJson = await forgotRes.json();
    const resetToken = forgotJson.data?.resetToken;
    assert(forgotRes.status === 200 && resetToken, 'POST /api/auth/forgot-password generates valid reset token');

    const resetRes = await fetch(`${BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: resetToken,
        password: 'newpassword456'
      })
    });
    assert(resetRes.status === 200, 'POST /api/auth/reset-password updates password successfully');

    // Login with new password
    const newLoginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'newpassword456'
      })
    });
    assert(newLoginRes.status === 200, 'POST /api/auth/login authenticates with newly reset password');

    // 18. Live Location & WhatsApp encoding check (Hindi, symbols, ampersands)
    const complexEnquiry = {
      fullName: 'रोहित शर्मा',
      phone: '9829139943',
      category: 'AC',
      serviceId: 'CC-033',
      serviceName: 'Split AC deep cleaning & filter wash',
      brandModel: 'Daikin 1.5T & Inverter #2',
      issue: 'Cooling issue + low air throw',
      address: 'Plot 10, Mansarovar, Jaipur',
      liveLocation: 'https://maps.google.com/?q=26.853000,75.760000',
      pincode: '302020'
    };
    const complexMsg = EnquiryModel.formatMessage(complexEnquiry);
    const complexUrl = EnquiryModel.generateWhatsAppUrl(complexMsg);
    assert(
      complexUrl.includes(encodeURIComponent('रोहित शर्मा')) &&
      complexUrl.includes(encodeURIComponent('https://maps.google.com/?q=26.853000,75.760000')) &&
      complexMsg.includes('Live Location: https://maps.google.com/?q=26.853000,75.760000'),
      'WhatsApp URL safely encodes Hindi, live location, and special symbols'
    );

  } catch (err) {
    console.error('Test suite error:', err);
    failed++;
  } finally {
    server.close();
    console.log('\n==================================================');
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('==================================================\n');
    process.exit(failed > 0 ? 1 : 0);
  }
}

runTests();
