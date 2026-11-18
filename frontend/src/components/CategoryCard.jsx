import React from 'react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from './CategoryIcon';

export function CategoryCard({ category }) {
  return (
    <Link
      to={`/services?category=${encodeURIComponent(category.name)}`}
      className="group bg-white border border-[#0D0F0D]/10 rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover hover:border-[#0D0F0D]/30 transition-all flex flex-col justify-between gap-3.5 h-full"
    >
      {/* 4:3 Realistic Category Photograph */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-neutral-100 border border-black/5">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/assets/images/cat-laptop.jpg';
          }}
        />
        {category.serviceCount > 0 && (
          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md bg-[#0D0F0D]/85 backdrop-blur-sm text-[10px] font-bold text-[#BBFA47] tracking-wider shadow-sm">
            {category.serviceCount} Services
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="w-10 h-10 rounded-xl bg-[#0D0F0D] text-[#BBFA47] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <CategoryIcon name={category.name} icon={category.icon} className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-[#0D0F0D] text-sm sm:text-base leading-tight truncate group-hover:text-black">
            {category.name}
          </h3>
          <p className="text-xs text-[#252B26]/75 mt-1 line-clamp-1 font-normal" title={category.tagline}>
            {category.tagline}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default CategoryCard;
