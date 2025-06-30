import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Money } from '@shopify/hydrogen';
import { AddToCartButton } from './AddToCartButton';
import type { ProductItemFragment } from 'storefrontapi.generated';

interface QuickViewModalProps {
  product: ProductItemFragment | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productId: string) => void;
}

const modalVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.8,
    y: 50
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

export function QuickViewModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}: QuickViewModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;

  const images = product.images || [product.featuredImage].filter(Boolean);
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.priceRange.maxVariantPrice;
  const isOnSale = compareAtPrice && price.amount !== compareAtPrice.amount;
  const isAvailable = product.availableForSale ?? true;

  const handleAddToCart = () => {
    onAddToCart?.(product.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-dark/80 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-4xl max-h-[90vh] bg-dark-card border border-dark-border clip-corner-lg overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-dark/50 backdrop-blur-sm border border-dark-border hover:bg-dark/70 transition-colors"
              onClick={onClose}
            >
              <svg className="w-6 h-6 text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Image Section */}
              <div className="lg:w-1/2 relative">
                <div className="aspect-square relative overflow-hidden">
                  {images[selectedImageIndex] && (
                    <Image
                      data={images[selectedImageIndex]}
                      alt={product.title}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {isOnSale && (
                      <span className="px-3 py-1 bg-accent-red text-light text-sm font-semibold rounded clip-corner">
                        SALE
                      </span>
                    )}
                    {!isAvailable && (
                      <span className="px-3 py-1 bg-dark-secondary text-light-secondary text-sm font-semibold rounded clip-corner">
                        SOLD OUT
                      </span>
                    )}
                  </div>
                </div>

                {/* Image Thumbnails */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-4 right-4 flex gap-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                          selectedImageIndex === index 
                            ? 'border-brand-purple' 
                            : 'border-dark-border hover:border-light-secondary'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          data={image}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="lg:w-1/2 p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Product Info */}
                  <div>
                    <span className="text-sm text-brand-purple font-orbitron uppercase tracking-wider">
                      {product.tags?.[0] || 'Billiards Cues'}
                    </span>
                    <h2 className="text-3xl font-oxanium font-bold text-light mt-2 mb-4">
                      {product.title}
                    </h2>
                    
                    {/* Price */}
                    <div className="flex items-center gap-4 mb-6">
                      <Money 
                        data={price} 
                        className="text-3xl font-oxanium font-bold text-light"
                      />
                      {isOnSale && compareAtPrice && (
                        <Money 
                          data={compareAtPrice}
                          className="text-xl text-light-secondary line-through"
                        />
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-accent-green' : 'bg-accent-red'}`} />
                      <span className="text-sm text-light-secondary font-orbitron">
                        {isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-oxanium font-semibold text-light mb-3">
                      Description
                    </h3>
                    <p className="text-light-secondary leading-relaxed">
                      {product.description || 'Premium billiards cue crafted with precision and attention to detail. Perfect for professional players and enthusiasts alike.'}
                    </p>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-oxanium font-semibold text-light mb-3">
                      Features
                    </h3>
                    <ul className="space-y-2 text-light-secondary">
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Professional grade construction
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Premium materials and finish
                      </li>
                      <li className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-brand-purple" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Precision balanced weight
                      </li>
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t border-dark-border">
                    <AddToCartButton
                      lines={[{
                        merchandiseId: `gid://shopify/ProductVariant/${product.id}`,
                        quantity: 1,
                      }]}
                      onClick={handleAddToCart}
                      disabled={!isAvailable}
                      className="flex-1"
                    >
                      <span className="w-full py-4 px-6 bg-brand-purple border border-brand-purple text-light font-orbitron font-semibold rounded clip-corner hover:bg-brand-purple-light transition-all duration-200 text-center disabled:opacity-50 disabled:cursor-not-allowed">
                        {isAvailable ? 'ADD TO CART' : 'OUT OF STOCK'}
                      </span>
                    </AddToCartButton>
                    
                    <a
                      href={`/products/${product.handle}`}
                      className="px-6 py-4 bg-transparent border border-brand-purple text-brand-purple font-orbitron font-semibold rounded clip-corner hover:bg-brand-purple hover:text-light transition-all duration-200 text-center"
                    >
                      VIEW DETAILS
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}