import mongoose, { Schema, model, models } from 'mongoose';

export interface IHeroSlide {
  src: string;
  title: string;
  subtitle: string;
  location: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface IService {
  title: string;
  description: string;
}

export interface IStat {
  value: string;
  label: string;
}

export interface ITestimonial {
  name: string;
  role: string;
  image: string;
  review: string;
}

export interface IAboutContent {
  title: string;
  description1: string;
  description2: string;
  image: string;
}

export interface IFooterContent {
  ctaHeading: string;
  ctaSubtext: string;
  email: string;
  phone: string;
  address: string;
  brandName: string;
  tagline: string;
  socialLinks: Array<{ label: string; href: string }>;
  copyright: string;
}

export interface IHomepageContent {
  hero: IHeroSlide[];
  about: IAboutContent;
  servicesHeading: string;
  servicesSubheading: string;
  services: IService[];
  stats: IStat[];
  testimonials: ITestimonial[];
  footer: IFooterContent;
}

const HomepageContentSchema = new Schema<IHomepageContent>(
  {
    hero: [
      {
        src: { type: String, required: true },
        title: { type: String, required: true },
        subtitle: { type: String, required: true },
        location: { type: String, required: true },
        ctaText: { type: String, default: '' },
        ctaLink: { type: String, default: '' },
      },
    ],
    about: {
      title: { type: String, default: 'Vaibhav Vashisht Architects Design Studio Private Limited' },
      description1: { type: String, default: '' },
      description2: { type: String, default: '' },
      image: { type: String, default: '' },
    },
    servicesHeading: { type: String, default: 'Elevating spaces through thoughtful design.' },
    servicesSubheading: { type: String, default: 'Our Expertise' },
    services: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    stats: [
      {
        value: { type: String, required: true },
        label: { type: String, required: true },
      },
    ],
    testimonials: [
      {
        name: { type: String, required: true },
        role: { type: String, default: '' },
        image: { type: String, default: '' },
        review: { type: String, required: true },
      },
    ],
    footer: {
      ctaHeading: { type: String, default: "Let's Build Something Exceptional." },
      ctaSubtext: { type: String, default: "Let's Work Together" },
      email: { type: String, default: 'connect@vvadesignstudio.in' },
      phone: { type: String, default: '+91 7042024600' },
      address: { type: String, default: 'B-120 Ground Floor Level, Sector 43, Faridabad, Haryana — 121010. IN.' },
      brandName: { type: String, default: 'VVA' },
      tagline: { type: String, default: 'Design Studio' },
      socialLinks: [{ label: String, href: String }],
      copyright: { type: String, default: 'Architecture & Interiors — Faridabad, Haryana' },
    },
  },
  { timestamps: true }
);

const HomepageContent = models.HomepageContent || model('HomepageContent', HomepageContentSchema);

export default HomepageContent;
