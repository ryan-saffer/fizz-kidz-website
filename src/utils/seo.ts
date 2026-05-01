export type JsonLd = Record<string, unknown>;

export const SITE_URL = "https://www.fizzkidz.com.au";
export const BUSINESS_NAME = "Fizz Kidz";
export const BUSINESS_PHONE = "+61390598144";
export const BUSINESS_EMAIL = "bookings@fizzkidz.com.au";

export const studioLocations = [
  {
    slug: "balwyn",
    name: "Balwyn",
    streetAddress: "184 Whitehorse Rd",
    locality: "Balwyn",
    postalCode: "3103",
    nearbySuburbs: ["Kew", "Camberwell", "Surrey Hills", "Canterbury"],
  },
  {
    slug: "cheltenham",
    name: "Cheltenham",
    streetAddress: "273 Bay Rd",
    locality: "Cheltenham",
    postalCode: "3192",
    nearbySuburbs: ["Mentone", "Highett", "Moorabbin", "Beaumaris"],
  },
  {
    slug: "essendon",
    name: "Essendon",
    streetAddress: "75 Raleigh Street",
    locality: "Essendon",
    postalCode: "3040",
    nearbySuburbs: ["Moonee Ponds", "Niddrie", "Strathmore", "Ascot Vale"],
  },
  {
    slug: "kingsville",
    name: "Kingsville",
    streetAddress: "238 Somerville Rd",
    locality: "Kingsville",
    postalCode: "3012",
    nearbySuburbs: ["Yarraville", "Seddon", "West Footscray", "Footscray"],
  },
  {
    slug: "malvern",
    name: "Malvern",
    streetAddress: "20 Glenferrie Road",
    locality: "Malvern",
    postalCode: "3144",
    nearbySuburbs: ["Armadale", "Prahran", "Toorak", "Caulfield"],
  },
] as const;

export type StudioSlug = (typeof studioLocations)[number]["slug"];

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

export function getStudio(slug: StudioSlug) {
  return studioLocations.find((studio) => studio.slug === slug)!;
}

export const organizationSchema: JsonLd = {
  "@type": "Organization",
  "@id": absoluteUrl("/#organization"),
  name: BUSINESS_NAME,
  url: SITE_URL,
  logo: absoluteUrl("/images/logo-horizontal.png"),
  image: absoluteUrl("/open-graph/home.jpg"),
  email: BUSINESS_EMAIL,
  telephone: BUSINESS_PHONE,
  sameAs: ["https://www.instagram.com/fizzkidzz/"],
};

export const websiteSchema: JsonLd = {
  "@type": "WebSite",
  "@id": absoluteUrl("/#website"),
  name: BUSINESS_NAME,
  url: SITE_URL,
  publisher: { "@id": absoluteUrl("/#organization") },
};

export function createBreadcrumbSchema(
  items: { name: string; url?: string }[],
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: absoluteUrl(item.url) } : {}),
    })),
  };
}

export function createFaqSchema(
  url: string,
  items: { question: string; answer: string }[],
): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl(url)}#faq`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function createServiceSchema({
  name,
  description,
  url,
  serviceType,
  areaServed = ["Melbourne", "Victoria"],
}: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  areaServed?: string[];
}): JsonLd {
  return {
    "@type": "Service",
    "@id": `${absoluteUrl(url)}#service`,
    name,
    description,
    serviceType,
    url: absoluteUrl(url),
    provider: { "@id": absoluteUrl("/#organization") },
    areaServed: areaServed.map((name) => ({ "@type": "Place", name })),
  };
}

export function createLocalBusinessSchema(slug: StudioSlug): JsonLd {
  const studio = getStudio(slug);

  return {
    "@type": "LocalBusiness",
    "@id": absoluteUrl(`/locations/${studio.slug}/#localbusiness`),
    name: `${BUSINESS_NAME} ${studio.name}`,
    url: absoluteUrl(`/locations/${studio.slug}/`),
    image: absoluteUrl(`/images/studios/${studio.slug}.jpg`),
    telephone: BUSINESS_PHONE,
    email: BUSINESS_EMAIL,
    priceRange: "$$",
    parentOrganization: { "@id": absoluteUrl("/#organization") },
    address: {
      "@type": "PostalAddress",
      streetAddress: studio.streetAddress,
      addressLocality: studio.locality,
      addressRegion: "VIC",
      postalCode: studio.postalCode,
      addressCountry: "AU",
    },
    areaServed: [studio.locality, ...studio.nearbySuburbs].map((name) => ({
      "@type": "Place",
      name,
    })),
  };
}

export function createSchemaGraph(items: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema, websiteSchema, ...items],
  };
}
