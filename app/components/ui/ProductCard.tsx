import {motion, type Variants} from 'framer-motion';
import {forwardRef, useState, type ReactNode} from 'react';
import {Heart, Eye, Share2, ShoppingCart} from 'lucide-react';
import {Button} from './Button';

interface ProductImage {
  url: string;
  altText: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  price: string;
  compareAtPrice?: string;
  images: ProductImage[];
  availableForSale: boolean;
  tags: string[];
  collection?: string;
}

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'featured' | 'compact';
  showQuickView?: boolean;
  showAddToCart?: boolean;
  showWishlist?: boolean;
  onAddToCart?: (productId: string) => void;
  onQuickView?: (productId: string) => void;
  onWishlistToggle?: (productId: string) => void;
  className?: string;
}

const cardVariants: Variants = {
  initial: {
    scale: 1,
    rotateY: 0,
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const overlayVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  hover: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: 'easeOut',
    },
  },
};

const imageVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

const glowVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

const badgeVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'backOut',
      delay: 0.1,
    },
  },
};

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(
  (
    {
      product,
      variant = 'default',
      showQuickView = true,
      showAddToCart = true,
      showWishlist = true,
      onAddToCart,
      onQuickView,
      onWishlistToggle,
      className = '',
    },
    ref,
  ) => {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddToCart = async () => {
      if (!onAddToCart) return;
      setIsLoading(true);
      try {
        await onAddToCart(product.id);
      } finally {
        setIsLoading(false);
      }
    };

    const handleWishlistToggle = () => {
      setIsWishlisted(!isWishlisted);
      onWishlistToggle?.(product.id);
    };

    const handleQuickView = () => {
      onQuickView?.(product.id);
    };

    const isOnSale = product.compareAtPrice && parseFloat(product.compareAtPrice) > parseFloat(product.price);
    const isNew = product.tags.includes('new') || product.tags.includes('New');
    const isLimited = product.tags.includes('limited') || product.tags.includes('Limited Edition');

    const getCardClasses = () => {
      const baseClasses = `
        relative
        bg-gradient-to-br from-gray-900 to-gray-800
        border border-gray-700
        clip-corner-lg
        overflow-hidden
        transition-all
        duration-300
        group
        ${className}
      `;

      switch (variant) {
        case 'featured':
          return `${baseClasses} lg:flex lg:flex-row`;
        case 'compact':
          return `${baseClasses} flex flex-row max-h-32`;
        default:
          return `${baseClasses} flex flex-col`;
      }
    };

    const getImageClasses = () => {
      switch (variant) {
        case 'featured':
          return 'aspect-square lg:aspect-[4/3] lg:w-1/2';
        case 'compact':
          return 'w-32 h-full flex-shrink-0';
        default:
          return 'aspect-[3/4] w-full';
      }
    };

    const getContentClasses = () => {
      switch (variant) {
        case 'featured':
          return 'p-6 lg:p-8 lg:w-1/2 flex flex-col justify-between';
        case 'compact':
          return 'p-4 flex-1 flex flex-col justify-between';
        default:
          return 'p-4 flex-1';
      }
    };

    return (
      <motion.div
        ref={ref}
        className={getCardClasses()}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        layout
      >
        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-brand-purple/20 to-transparent opacity-0 pointer-events-none"
          variants={glowVariants}
          style={{
            filter: 'blur(20px)',
            zIndex: -1,
          }}
        />

        {/* Image Container */}
        <div className={`relative ${getImageClasses()} overflow-hidden`}>
          <motion.img
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.title}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />

          {/* Image Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isOnSale && (
              <motion.div
                className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded clip-corner-sm"
                variants={badgeVariants}
                initial="initial"
                animate="animate"
              >
                SALE
              </motion.div>
            )}
            {isNew && (
              <motion.div
                className="px-2 py-1 bg-brand-purple text-white text-xs font-semibold rounded clip-corner-sm"
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                style={{animationDelay: '0.1s'}}
              >
                NEW
              </motion.div>
            )}
            {isLimited && (
              <motion.div
                className="px-2 py-1 bg-yellow-600 text-white text-xs font-semibold rounded clip-corner-sm"
                variants={badgeVariants}
                initial="initial"
                animate="animate"
                style={{animationDelay: '0.2s'}}
              >
                LIMITED
              </motion.div>
            )}
          </div>

          {/* Stock Status */}
          {!product.availableForSale && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">SOLD OUT</span>
            </div>
          )}

          {/* Interactive Overlay */}
          {variant !== 'compact' && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center gap-3"
              variants={overlayVariants}
            >
              {showQuickView && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleQuickView}
                  className="backdrop-blur-sm bg-black/30"
                >
                  <Eye size={16} />
                  Quick View
                </Button>
              )}
              {showAddToCart && product.availableForSale && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  isLoading={isLoading}
                  className="backdrop-blur-sm"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              )}
            </motion.div>
          )}

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors"
              >
                <Heart
                  size={16}
                  className={`transition-colors ${
                    isWishlisted ? 'text-red-500 fill-current' : 'text-white'
                  }`}
                />
              </button>
            )}
            <button className="p-2 bg-black/30 backdrop-blur-sm rounded-full hover:bg-black/50 transition-colors">
              <Share2 size={16} className="text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={getContentClasses()}>
          {/* Collection Tag */}
          {product.collection && (
            <span className="text-label text-brand-purple mb-2 block">
              {product.collection}
            </span>
          )}

          {/* Product Title */}
          <h3 className="text-card-title text-light mb-3 line-clamp-2">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-oxanium font-semibold text-light">
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-light-secondary line-through">
                ${product.compareAtPrice}
              </span>
            )}
          </div>

          {/* Compact Actions */}
          {variant === 'compact' && (
            <div className="flex items-center gap-2 mt-auto">
              {showQuickView && (
                <button
                  onClick={handleQuickView}
                  className="p-2 text-light-secondary hover:text-light transition-colors"
                >
                  <Eye size={16} />
                </button>
              )}
              {showAddToCart && product.availableForSale && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddToCart}
                  isLoading={isLoading}
                  className="flex-1"
                >
                  <ShoppingCart size={14} />
                </Button>
              )}
            </div>
          )}

          {/* Featured Additional Info */}
          {variant === 'featured' && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-700 text-light-secondary rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                {showAddToCart && product.availableForSale && (
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    isLoading={isLoading}
                    className="flex-1"
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </Button>
                )}
                {showQuickView && (
                  <Button variant="secondary" onClick={handleQuickView}>
                    <Eye size={16} />
                    Quick View
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    );
  },
);

ProductCard.displayName = 'ProductCard';