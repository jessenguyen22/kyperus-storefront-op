import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Money } from '@shopify/hydrogen';
import { AddToCartButton } from './AddToCartButton';
import { useAside } from './Aside';
import type { ProductItemFragment } from 'storefrontapi.generated';

interface ProductCardProps {
  product: ProductItemFragment;
  variant?: 'default' | 'featured' | 'compact';
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
  loading?: 'eager' | 'lazy';
}

const cardVariants = {
  initial: { scale: 1, rotateY: 0 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const overlayVariants = {
  initial: { opacity: 0, y: 20 },
  hover: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

const imageVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const buttonVariants = {
  initial: { opacity: 0, y: 10 },
  hover: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, delay: 0.1 }
  }
};

export function ProductCard({
  product,
  variant = 'default',
  showQuickView = true,
  showAddToCart = true,
  showWishlist = true,
  onAddToCart,
  onQuickView,
  onWishlistToggle,
  className = '',
  loading = 'lazy'
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { open } = useAside();

  const image = product.featuredImage;
  const price = product.priceRange.minVariantPrice;
  const compareAtPrice = product.priceRange.maxVariantPrice;
  const isOnSale = compareAtPrice && price.amount !== compareAtPrice.amount;

  // Extract collection from product tags or handle
  const collection = product.tags?.[0] || 'Billiards Cues';
  
  // Determine availability
  const isAvailable = product.availableForSale ?? true;

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    onWishlistToggle?.(product.id);
  };

  const handleQuickView = () => {
    onQuickView?.(product.id);
    open('search'); // You might want to create a specific quick view aside
  };

  const handleAddToCart = () => {
    onAddToCart?.(product.id);
    open('cart');
  };

  const getCardClasses = () => {
    const baseClasses = "group relative overflow-hidden bg-dark-card border border-dark-border clip-corner-lg";
    
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
      <motion.div
        className={`${getCardClasses()} ${className}`}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
      >
        <Link to={`/products/${product.handle}`} className="flex w-full h-full">
          <div className={`${getImageClasses()} relative overflow-hidden`}>
            {image && !imageError ? (
              <motion.div variants={imageVariants} className="w-full h-full">
                <Image
                  data={image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  loading={loading}
                  onError={() => setImageError(true)}
                />
              </motion.div>
            ) : (
              <div className="w-full h-full bg-dark-secondary flex items-center justify-center">
                <span className="text-light-secondary text-sm">No Image</span>
              </div>
            )}
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {isOnSale && (
                <span className="px-2 py-1 bg-accent-red text-light text-xs font-semibold rounded">
                  SALE
                </span>
              )}
              {!isAvailable && (
                <span className="px-2 py-1 bg-dark-secondary text-light-secondary text-xs font-semibold rounded">
                  SOLD OUT
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <span className="text-xs text-brand-purple font-orbitron uppercase tracking-wider">
                {collection}
              </span>
              <h3 className="text-sm font-oxanium font-semibold text-light mt-1 line-clamp-2">
                {product.title}
              </h3>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <Money 
                  data={price} 
                  className="text-lg font-oxanium font-bold text-light"
                />
                {isOnSale && compareAtPrice && (
                  <Money 
                    data={compareAtPrice}
                    className="text-sm text-light-secondary line-through"
                  />
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-accent-green' : 'bg-accent-red'}`} />
                <span className="text-xs text-light-secondary">
                  {isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`${getCardClasses()} ${className}`}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
    >
      {/* Product Image */}
      <div className={`${getImageClasses()} relative overflow-hidden`}>
        <Link to={`/products/${product.handle}`}>
          {image && !imageError ? (
            <motion.div variants={imageVariants} className="w-full h-full">
              <Image
                data={image}
                alt={product.title}
                className="w-full h-full object-cover"
                loading={loading}
                onError={() => setImageError(true)}
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-dark-secondary flex items-center justify-center">
              <span className="text-light-secondary">No Image Available</span>
            </div>
          )}
        </Link>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {isOnSale && (
            <motion.span 
              className="px-3 py-1 bg-accent-red text-light text-sm font-semibold rounded clip-corner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              SALE
            </motion.span>
          )}
          {!isAvailable && (
            <motion.span 
              className="px-3 py-1 bg-dark-secondary text-light-secondary text-sm font-semibold rounded clip-corner"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              SOLD OUT
            </motion.span>
          )}
        </div>

        {/* Wishlist Button */}
        {showWishlist && (
          <motion.button
            className="absolute top-4 right-4 p-2 rounded-full bg-dark/50 backdrop-blur-sm border border-dark-border hover:bg-dark/70 transition-colors"
            onClick={handleWishlistToggle}
            variants={buttonVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              className={`w-5 h-5 ${isWishlisted ? 'text-accent-red fill-current' : 'text-light'}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </motion.button>
        )}

        {/* Quick Actions Overlay */}
        <motion.div
          className="absolute inset-x-4 bottom-4 flex gap-2"
          variants={overlayVariants}
        >
          {showQuickView && (
            <motion.button
              className="flex-1 py-3 px-4 bg-dark/80 backdrop-blur-sm border border-dark-border text-light font-orbitron text-sm font-semibold rounded clip-corner hover:bg-brand-purple hover:border-brand-purple transition-all duration-200"
              onClick={handleQuickView}
              variants={buttonVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              QUICK VIEW
            </motion.button>
          )}
          
          {showAddToCart && isAvailable && (
            <AddToCartButton
              lines={[{
                merchandiseId: `gid://shopify/ProductVariant/${product.id}`,
                quantity: 1,
              }]}
              onClick={handleAddToCart}
              disabled={!isAvailable}
            >
              <motion.span
                className="flex-1 py-3 px-4 bg-brand-purple border border-brand-purple text-light font-orbitron text-sm font-semibold rounded clip-corner hover:bg-brand-purple-light transition-all duration-200 text-center"
                variants={buttonVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                ADD TO CART
              </motion.span>
            </AddToCartButton>
          )}
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-brand-purple font-orbitron uppercase tracking-wider">
            {collection}
          </span>
        </div>
        
        <Link to={`/products/${product.handle}`}>
          <h3 className="text-xl font-oxanium font-semibold text-light mb-3 hover:text-brand-purple transition-colors duration-200 line-clamp-2">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Money 
              data={price} 
              className="text-2xl font-oxanium font-bold text-light"
            />
            {isOnSale && compareAtPrice && (
              <Money 
                data={compareAtPrice}
                className="text-lg text-light-secondary line-through"
              />
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isAvailable ? 'bg-accent-green' : 'bg-accent-red'}`} />
            <span className="text-sm text-light-secondary font-orbitron">
              {isAvailable ? 'IN STOCK' : 'OUT OF STOCK'}
            </span>
          </div>
        </div>

        {variant === 'featured' && (
          <motion.div 
            className="mt-4 pt-4 border-t border-dark-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-sm text-light-secondary leading-relaxed">
              Premium billiards cue crafted with precision and attention to detail.
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}