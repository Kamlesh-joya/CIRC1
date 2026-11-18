import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'Which services does CircuitCare provide?',
    a: 'CircuitCare provides exclusively the 188 services listed in our official Excel catalogue across 16 device categories: Laptop, Desktop PC, AC, Refrigerator, Washing Machine, Air Cooler, UPS & Inverter, CCTV, Networking, TV & Audio, Water Purifier, Geyser, Kitchen Appliances, Printer & Scanner, Mobile & Tablet, and Small Appliances. We do not provide unlisted or unverified services.',
  },
  {
    q: 'How does pricing work when a service shows "Contact for price"?',
    a: 'Each service in our catalogue indicates its pricing basis: Inspection fee, Fixed service fee, or Quote after inspection. When website price is blank, it means the service requires model verification or physical inspection first. An itemised quote is provided to you before any repair work starts.',
  },
  {
    q: 'Are spare parts and consumables included in the service?',
    a: 'Each service listing clearly states its parts & consumables scope. Unless expressly bundled, replacement components or consumables are charged extra with your prior consent.',
  },
  {
    q: 'Can I enquire about a service not in the Excel catalogue?',
    a: 'No. For our Jaipur launch, our technicians and diagnostic tools are strictly equipped for the 188 catalogue services. Please choose your device category and select from the available catalogue options in our enquiry form.',
  },
  {
    q: 'How do I complete a booking on WhatsApp?',
    a: 'Select your required service from the catalogue, complete the Quick Service Enquiry form, and click "Continue to WhatsApp". WhatsApp will open with all details prefilled. Tap Send in WhatsApp to connect with our Jaipur team to confirm timing and assignment.',
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      <div className="text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#252B26]/70">
          Frequently Asked Questions
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F0D] mt-1">
          Good to know before you enquire
        </h2>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.q}
              className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-5 shadow-card transition-all hover:border-[#0D0F0D]/30"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full text-left font-semibold text-[#0D0F0D] flex items-center justify-between gap-4 focus:outline-none"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <span className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 text-[#0D0F0D]">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>
              {isOpen && (
                <p className="mt-3 text-xs sm:text-sm text-[#252B26]/80 leading-relaxed border-t border-zinc-100 pt-3">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQAccordion;
