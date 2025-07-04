import slugify from 'slugify';

export function generateSEOData(product) {
  const title = `${product.name} | YourDollarsOnline`;
  const description = product.description.length > 160 
    ? product.description.substring(0, 157) + '...' 
    : product.description;
  
  const keywords = [
    product.name,
    product.category,
    ...product.tags || [],
    'buy online',
    'shop',
    'YourDollarsOnline'
  ].join(', ');

  return {
    title,
    description,
    keywords,
    slug: slugify(product.name, { lower: true, strict: true }),
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slugify(product.name, { lower: true, strict: true })}`,
    openGraph: {
      title,
      description,
      type: 'product',
      images: product.images || [],
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slugify(product.name, { lower: true, strict: true })}`,
      siteName: 'YourDollarsOnline'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images || []
    }
  };
}

export function generateCategorySEO(category) {
  return {
    title: `${category.name} | YourDollarsOnline`,
    description: category.description || `Shop ${category.name} products at YourDollarsOnline`,
    keywords: `${category.name}, shop, buy online, YourDollarsOnline`,
    slug: slugify(category.name, { lower: true, strict: true }),
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slugify(category.name, { lower: true, strict: true })}`,
    openGraph: {
      title: `${category.name} | YourDollarsOnline`,
      description: category.description || `Shop ${category.name} products at YourDollarsOnline`,
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${slugify(category.name, { lower: true, strict: true })}`,
      siteName: 'YourDollarsOnline'
    }
  };
}

export function generateProductSchema(product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [],
    "brand": {
      "@type": "Brand",
      "name": "YourDollarsOnline"
    },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "YourDollarsOnline"
      }
    },
    "aggregateRating": product.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.rating.average,
      "reviewCount": product.rating.count
    } : null
  };
}

export function createSlug(text) {
  return slugify(text, { lower: true, strict: true });
}

export default {
  generateSEOData,
  generateCategorySEO,
  generateProductSchema,
  createSlug
};
