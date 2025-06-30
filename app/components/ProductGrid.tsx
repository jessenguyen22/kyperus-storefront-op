import React from 'react';
import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';
import type { ProductItemFragment } from 'storefrontapi.generated';

interface ProductGridProps {
  products: ProductItemFragment[];
  variant?: 'default' | 'featured' | 'compact';
  columns?: 2 | 3 | 4;
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export function ProductGrid({
  products,
  variant = 'default',
  columns = 3,
  showQuickView = true,
  showAddToCart = true,
  showWishlist = true,
  onAddToCart,
  onQuickView,
  onWishlistToggle,
  className = ''
}: ProductGridProps) {
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

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-dark-secondary flex items-center justify-center">
          <svg className="w-12 h-12 text-light-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-xl font-oxanium font-semibold text-light mb-2">
          No Products Found
        </h3>
        <p className="text-light-secondary">
          We couldn't find any products matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className={`${getGridClasses()} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
        >
          <ProductCard
            product={product}
            variant={variant}
            showQuickView={showQuickView}
            showAddToCart={showAddToCart}
            showWishlist={showWishlist}
            onAddToCart={onAddToCart}
            onQuickView={onQuickView}
            onWishlistToggle={onWishlistToggle}
            loading={index < 6 ? 'eager' : 'lazy'}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}