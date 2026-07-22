export interface SofaGenerationRequest {
  imagesBase64: string[]; // List of base64 image data strings (e.g. data:image/jpeg;base64,...)
  location?: string;
  targetPrice?: number;
  condition?: string; // Brand New, Like New, Very Good, Good, Refurbished
  seaterOverride?: string; // 2-Seater, 3-Seater, Corner Sofa, L-Shape, Recliner, Sofa Bed, Armchair
  fabricOverride?: string; // Plush Velvet, Corduroy, Leather, Linen, Chenille, Woven Fabric
  deliveryOption?: string; // Free Local Delivery, Paid UK Delivery, Collection Only, Same-Day Available
  tone?: string; // Marketplace High-Conversion, Luxury & High-End, Urgent Clearance Sale, Minimalist & Direct
  shopName?: string;
  phone?: string;
  whatsapp?: string;
  customNotes?: string;
}

export interface SofaListingData {
  id: string;
  createdAt: string;
  primaryImage: string;
  allImages: string[];
  facebookTitle: string;
  price: number;
  priceRange: string; // e.g. "£350 - £450"
  location: string;
  seater: string;
  fabric: string;
  color: string;
  condition: string;
  dimensions: {
    widthCm?: number;
    depthCm?: number;
    heightCm?: number;
    approxText: string; // e.g. "W: 210cm x D: 95cm x H: 88cm"
  };
  delivery: string;
  description: string;
  hashtags: string[];
  seoKeywords: string[];
  shopName?: string;
  contactNumber?: string;
}

export interface ShopSettings {
  shopName: string;
  location: string;
  phone: string;
  whatsapp: string;
  deliveryTerms: string;
  pricingMarkupPercent: number;
  defaultCondition: string;
}

export interface SampleSofaPhoto {
  id: string;
  name: string;
  category: string;
  url: string;
  description: string;
}
