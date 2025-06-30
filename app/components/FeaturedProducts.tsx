import React from 'react';
import { motion } from 'framer-motion';
import { ProductGrid } from './ProductGrid';
import type { ProductItemFragment } from 'storefrontapi.generated';

interface FeaturedProductsProps {
  products: ProductItemFragment[];
  title?: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const headerVariants = {
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

export function FeaturedProducts({
  products,
  title = "Featured Products",
  subtitle = "Discover our premium collection of professional billiards cues",
  showViewAll = true,
  viewAllLink = "/collections/all",
  onAddToCart,
  onQuickView,
  onWishlistToggle,
  className = ''
}: FeaturedProductsProps) {
  return (
    <motion.section
      className={`py-16 ${className}`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={headerVariants}
        >
          <h2 className="text-4xl md:text-5xl font-oxanium font-bold text-light mb-4">
            {title}
          </h2>
          <p className="text-lg text-light-secondary max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          {/* Decorative Line */}
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-brand-purple to-brand-purple-light mx-auto mt-6"
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        {/* Products Grid */}
        <ProductGrid
          products={products}
          variant="default"
          columns={3}
          showQuickView={true}
          showAddToCart={true}
          showWishlist={true}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          onWishlistToggle={onWishlistToggle}
        />

        {/* View All Button */}
        {showViewAll && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.a
              href={viewAllLink}
              className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-brand-purple text-brand-purple font-orbitron font-semibold rounded clip-corner-lg hover:bg-brand-purple hover:text-light transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              VIEW ALL PRODUCTS
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}