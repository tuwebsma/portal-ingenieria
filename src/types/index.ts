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
  icon: string;
  bannerImage: string;
  keyAreas: string[];
  flagshipProjects: FlagshipProject[];
  careerImpact: string;
  technologies: string[];
  featuredArticleSlug?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  content: string[];
  category: string;
  categoryName: string;
  engineeringBranch: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  isFeatured: boolean;
  source: string;
  location: string;
  keyTakeaways?: string[];
  quote?: {
    text: string;
    author: string;
    role: string;
  };
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
