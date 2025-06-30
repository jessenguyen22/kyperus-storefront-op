import React from 'react';
import { motion } from 'framer-motion';

interface ProductCardSkeletonProps {
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function ProductCardSkeleton({ 
  variant = 'default', 
  className = '' 
}: ProductCardSkeletonProps) {
  const getCardClasses = () => {
    const baseClasses = "relative overflow-hidden bg-dark-card border border-dark-border clip-corner-lg";
    
    switch (variant) {
      case 'featured':
        return `${baseClasses} w-full max-w-md mx-auto`;
      case 'compact':
        return `${baseClasses} flex flex-row h-32`;
      default:
        return `${baseClasses} w-full`;
    }
  };

  const getImageClasses = () => {
    switch (variant) {
      case 'compact':
        return "w-32 h-32 flex-shrink-0";
      default:
        return "w-full aspect-[3/4]";
    }
  };

  if (variant === 'compact') {
    return (
      <div className={`${getCardClasses()} ${className}`}>
        <div className={`${getImageClasses()} product-card-skeleton`} />
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="h-3 bg-dark-secondary rounded w-20 mb-2 product-card-skeleton" />
            <div className="h-4 bg-dark-secondary rounded w-full mb-1 product-card-skeleton" />
            <div className="h-4 bg-dark-secondary rounded w-3/4 product-card-skeleton" />
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="h-5 bg-dark-secondary rounded w-16 product-card-skeleton" />
            <div className="h-3 bg-dark-secondary rounded w-12 product-card-skeleton" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getCardClasses()} ${className}`}>
      {/* Image Skeleton */}
      <div className={`${getImageClasses()} product-card-skeleton`} />
      
      {/* Content Skeleton */}
      <div className="p-6">
        {/* Collection Tag */}
        <div className="h-3 bg-dark-secondary rounded w-24 mb-2 product-card-skeleton" />
        
        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-5 bg-dark-secondary rounded w-full product-card-skeleton" />
          <div className="h-5 bg-dark-secondary rounded w-3/4 product-card-skeleton" />
        </div>
        
        {/* Price and Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 bg-dark-secondary rounded w-20 product-card-skeleton" />
            <div className="h-4 bg-dark-secondary rounded w-16 product-card-skeleton" />
          </div>
          <div className="h-4 bg-dark-secondary rounded w-16 product-card-skeleton" />
        </div>
        
        {variant === 'featured' && (
          <div className="mt-4 pt-4 border-t border-dark-border">
            <div className="space-y-2">
              <div className="h-3 bg-dark-secondary rounded w-full product-card-skeleton" />
              <div className="h-3 bg-dark-secondary rounded w-5/6 product-card-skeleton" />
              <div className="h-3 bg-dark-secondary rounded w-4/6 product-card-skeleton" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ 
  count = 6, 
  variant = 'default',
  columns = 3,
  className = '' 
}: {
  count?: number;
  variant?: 'default' | 'featured' | 'compact';
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const getGridClasses = () => {
    const baseClasses = "grid gap-6";
    
    if (variant === 'compact') {
      return `${baseClasses} grid-cols-1`;
    }
    
    switch (columns) {
      case 2:
        return `${baseClasses} grid-cols-1 md:grid-cols-2`;
      case 4:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`;
    }
  };

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton 
          key={index} 
          variant={variant}
        />
      ))}
    </div>
  );
}