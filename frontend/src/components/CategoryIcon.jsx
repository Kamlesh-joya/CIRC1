import React from 'react';
import {
  Laptop,
  Monitor,
  Wind,
  Fan,
  BatteryCharging,
  Camera,
  Wifi,
  Tv,
  Droplets,
  Flame,
  Utensils,
  Printer,
  Smartphone,
  Sparkles,
  Wrench,
  Refrigerator,
  WashingMachine
} from 'lucide-react';

export function CategoryIcon({ name, icon, className = 'w-5 h-5' }) {
  const norm = `${name || ''} ${icon || ''}`.toLowerCase().trim();

  if (norm.includes('laptop')) return <Laptop className={className} />;
  if (norm.includes('desktop') || norm.includes('monitor') || norm.includes('pc')) return <Monitor className={className} />;
  if (norm.includes('ac') || norm.includes('wind') || norm.includes('air conditioner')) return <Wind className={className} />;
  if (norm.includes('cooler') || norm.includes('fan')) return <Fan className={className} />;
  if (norm.includes('mobile') || norm.includes('tablet') || norm.includes('phone') || norm.includes('smartphone')) return <Smartphone className={className} />;
  if (norm.includes('cctv') || norm.includes('camera')) return <Camera className={className} />;
  if (norm.includes('purifier') || norm.includes('ro') || norm.includes('water') || norm.includes('droplet')) return <Droplets className={className} />;
  if (norm.includes('tv') || norm.includes('audio')) return <Tv className={className} />;
  if (norm.includes('geyser') || norm.includes('flame')) return <Flame className={className} />;
  if (norm.includes('kitchen') || norm.includes('chimney') || norm.includes('microwave') || norm.includes('utensil')) return <Utensils className={className} />;
  if (norm.includes('refrigerator') || norm.includes('fridge')) return <Refrigerator className={className} />;
  if (norm.includes('wash')) return <WashingMachine className={className} />;
  if (norm.includes('network') || norm.includes('wifi') || norm.includes('wi-fi')) return <Wifi className={className} />;
  if (norm.includes('printer') || norm.includes('scanner')) return <Printer className={className} />;
  if (norm.includes('ups') || norm.includes('inverter') || norm.includes('battery')) return <BatteryCharging className={className} />;
  if (norm.includes('small') || norm.includes('appliance') || norm.includes('sparkle')) return <Sparkles className={className} />;

  return <Wrench className={className} />;
}

export default CategoryIcon;
