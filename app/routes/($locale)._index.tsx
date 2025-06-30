import {type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from 'react-router';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import {Button, ProductCard} from '~/components/ui';

export const meta: MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader(args: LoaderFunctionArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: LoaderFunctionArgs) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: LoaderFunctionArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home bg-brand-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="container-brand text-center">
          <h1 className="text-hero text-light mb-6 animate-fade-in-up">
            KYPERUS
          </h1>
          <p className="text-body-lg text-light-secondary mb-8 max-w-2xl mx-auto">
            Crafting precision billiards cues for champions. Experience the perfect balance of tradition and innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="lg" className="clip-corner">
              Shop Collections
            </Button>
            <Button variant="secondary" size="lg" className="clip-corner">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <FeaturedCollection collection={data.featuredCollection} />
      
      {/* Recommended Products */}
      <RecommendedProducts products={data.recommendedProducts} />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection || !collection.products) return null;
  
  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-black">
      <div className="container-brand">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-section text-light mb-4">{collection.title}</h2>
          <p className="text-body-lg text-light-secondary max-w-2xl mx-auto">
            Discover our premium collection of professional billiards cues
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {collection.products.nodes.map((product) => {
            const transformedProduct = {
              id: product.id,
              title: product.title,
              handle: product.handle,
              price: product.priceRange.minVariantPrice.amount,
              compareAtPrice: product.compareAtPriceRange?.minVariantPrice?.amount,
              images: product.images?.nodes?.map(img => ({
                url: img.url,
                altText: img.altText || product.title,
              })) || [],
              availableForSale: product.availableForSale,
              tags: product.tags || [],
              collection: collection.title,
            };

            return (
              <ProductCard
                key={product.id}
                product={transformedProduct}
                variant="default"
                onAddToCart={(productId) => {
                  console.log('Add to cart:', productId);
                }}
                onQuickView={(productId) => {
                  console.log('Quick view:', productId);
                }}
                onWishlistToggle={(productId) => {
                  console.log('Wishlist toggle:', productId);
                }}
              />
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to={`/collections/${collection.handle}`}>
            <Button variant="primary" size="lg" className="clip-corner">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="py-16 bg-black">
      <div className="container-brand">
        <div className="text-center mb-12">
          <h2 className="text-section text-light mb-4">
            Recommended Products
          </h2>
          <p className="text-body text-light-secondary">
            Handpicked selections from our master craftsmen
          </p>
        </div>

        <Suspense fallback={
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full mx-auto"></div>
            <p className="text-light-secondary mt-4">Loading recommendations...</p>
          </div>
        }>
          <Await resolve={products}>
            {(response) => (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {response
                  ? response.products.nodes.map((product) => {
                      const transformedProduct = {
                        id: product.id,
                        title: product.title,
                        handle: product.handle,
                        price: product.priceRange.minVariantPrice.amount,
                        compareAtPrice: undefined,
                        images: product.featuredImage ? [{
                          url: product.featuredImage.url,
                          altText: product.featuredImage.altText || product.title,
                        }] : [],
                        availableForSale: true,
                        tags: [],
                        collection: 'Recommended',
                      };

                      return (
                        <ProductCard
                          key={product.id}
                          product={transformedProduct}
                          variant="default"
                          onAddToCart={(productId) => {
                            console.log('Add to cart:', productId);
                          }}
                          onQuickView={(productId) => {
                            console.log('Quick view:', productId);
                          }}
                          onWishlistToggle={(productId) => {
                            console.log('Wishlist toggle:', productId);
                          }}
                        />
                      );
                    })
                  : null}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
    products(first: 8) {
      nodes {
        id
        title
        handle
        availableForSale
        tags
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 3) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
