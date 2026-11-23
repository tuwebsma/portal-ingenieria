export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

export interface FlagshipProject {
  name: string;
  description: string;
  country: string;
}

export interface EngineeringBranch {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  knowledgeArea: string;
  institution: string;
  institutionUrl?: string;
  icon: string;
  bannerImage: string;
  keyAreas: string[];
  flagshipProjects: FlagshipProject[];
  careerImpact: string;
  technologies: string[];
  featuredArticleSlug?: string;
  relatedKeywords?: string[];
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  categoryName: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  originalUrl: string;
  publishedAt: string;
  ingestedAt: string;
  tags?: string[];
  isFeatured: boolean;
}

export type NewsSourceKind =
  | 'institucion'
  | 'universidad'
  | 'centro-investigacion'
  | 'organismo'
  | 'agencia';

export interface NewsSource {
  id: string;
  name: string;
  shortName: string;
  country: string;
  category: NewsSourceKind;
  websiteUrl: string;
  feedUrl?: string;
  enabled: boolean;
  integrationType: 'rss' | 'atom' | 'api' | 'pending';
}

export type InstitutionType = 'investigacion' | 'empresa' | 'universidad' | 'gobierno' | 'consorcio';

export interface Institution {
  id: string;
  slug: string;
  name: string;
  acronym: string;
  type: InstitutionType;
  typeName: string;
  country: string;
  city: string;
  description: string;
  websiteUrl: string;
  logoUrl?: string;
  focusAreas: string[];
  flagshipProjects: string[];
  establishedYear: number;
}

export type PublicationType = 'revista' | 'paper' | 'whitepaper' | 'reporte';

export interface Publication {
  id: string;
  slug: string;
  name?: string;
  title: string;
  publisher: string;
  type: PublicationType;
  frequency: string;
  description: string;
  linkUrl: string;
  language: string;
  coverImage?: string;
  tags: string[];
  openAccess: boolean;
  issnOrDoi?: string;
}
