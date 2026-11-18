import React from 'react';
import { FileText, Home, ShieldCheck, CheckSquare } from 'lucide-react';

const FEATURES = [
  {
    icon: CheckSquare,
    title: 'Strict Catalogue Scope',
    desc: 'We provide exclusively the 188 services defined in our official catalogue across 16 device categories.',
  },
  {
    icon: FileText,
    title: 'Transparent Pricing Basis',
    desc: 'Each listing clearly defines its charging unit and pricing basis (Inspection fee, Fixed service fee, or Quote after inspection).',
  },
  {
    icon: Home,
    title: 'Jaipur Doorstep Service',
    desc: 'Convenient home visits scheduled across Jaipur Municipal Corporation localities for your selected appliance.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval Before Work',
    desc: 'Required spare parts and consumables are quoted after inspection and proceed only after your explicit approval.',
  },
];

export function TrustBadges() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <div className="max-w-2xl mb-8">
        <p className="text-xs font-bold uppercase tracking-wider text-[#252B26]/70">
          Why CircuitCare
        </p>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D0F0D] mt-1">
          Built strictly around our verified 188-service catalogue.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white border border-[#0D0F0D]/10 rounded-2xl p-6 shadow-card space-y-3 hover:border-[#0D0F0D]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#BBFA47] text-[#0D0F0D] flex items-center justify-center">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-[#0D0F0D]">{item.title}</h3>
              <p className="text-sm text-[#252B26]/80 leading-relaxed">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default TrustBadges;
