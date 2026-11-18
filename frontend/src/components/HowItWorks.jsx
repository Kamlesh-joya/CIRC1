import React from 'react';
import { Wrench, UserCheck, MessageSquare } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: Wrench,
    title: 'Select your service',
    desc: 'Browse 188 services across 16 categories. View transparent estimates or inspection fees.',
  },
  {
    step: '02',
    icon: UserCheck,
    title: 'Quick account login',
    desc: 'Sign in or create your customer account to save your address, phone, and service selection.',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Connect on WhatsApp',
    desc: 'Submit the enquiry to launch WhatsApp with prefilled service details and chat directly with our Jaipur team.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-[#0D0F0D] text-[#FEFAF7] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-bold uppercase tracking-wider text-[#BBFA47]">
            Customer Journey
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
            From glitching to fixed in three clear steps.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="bg-[#252B26] border border-white/10 rounded-2xl p-6 space-y-4 hover:border-[#BBFA47]/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-[#BBFA47]">
                    STEP {s.step}
                  </span>
                  <div className="p-2 rounded-xl bg-[#0D0F0D] text-[#BBFA47]">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="text-sm text-[#A4ADA5] leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
