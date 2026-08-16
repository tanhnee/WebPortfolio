export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  category: string;
  status: string;
  featured: boolean;
  coverUrl?: string | null;
  thumbnailUrl?: string | null;
  pdfUrl?: string | null;
  description: string;
  abstract?: string | null;
  problem?: string | null;
  objectives?: string | null;
  methodology?: string | null;
  architecture?: string | null;
  features?: string | null;
  results?: string | null;
  lessons?: string | null;
  role?: string | null;
  team?: string | null;
  githubUrl?: string | null;
  demoUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  tags: string[];
  technologies: string[];
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  caption?: string | null;
  order: number;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  phone?: string | null;
  location: string;
  avatarUrl?: string | null;
  cvUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  facebookUrl?: string | null;
  website?: string | null;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  type: string;
  description: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  location?: string | null;
  logoUrl?: string | null;
  order: number;
  createdAt: Date;
}

export interface Research {
  id: string;
  title: string;
  journal?: string | null;
  conference?: string | null;
  authors: string[];
  abstract: string;
  doi?: string | null;
  pdfUrl?: string | null;
  publishedAt?: Date | null;
  status: string;
  tags: string[];
  createdAt: Date;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  description?: string | null;
  date: Date;
  imageUrl?: string | null;
  order: number;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon?: string | null;
  order: number;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa?: string | null;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  description?: string | null;
  logoUrl?: string | null;
  order: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  body: string;
  read: boolean;
  createdAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  body: string;
}
