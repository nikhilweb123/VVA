import { Schema, model, models } from 'mongoose';

export interface INavItem {
  label: string;
  href: string;
}

export interface INavColumn {
  heading: string;
  links: INavItem[];
}

export interface ISiteNavbar {
  logoUrl: string;
  logoAlt: string;
  navItems: INavItem[];
}

export interface ISiteFooter {
  ctaHeading: string;
  ctaSubtext: string;
  email: string;
  phone: string;
  address: string;
  brandName: string;
  tagline: string;
  navColumns: INavColumn[];
  socialLinks: INavItem[];
  copyright: string;
}

export interface ISiteSeo {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
}

export interface ISiteSettings {
  navbar: ISiteNavbar;
  footer: ISiteFooter;
  seo: ISiteSeo;
}

const NavItemSchema = new Schema<INavItem>({ label: String, href: String }, { _id: false });

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    navbar: {
      logoUrl: { type: String, default: '/logo_transparent.png' },
      logoAlt: { type: String, default: 'VVA Design Studio' },
      navItems: { type: [NavItemSchema], default: [
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Services', href: '/services' },
        { label: 'Projects', href: '/projects' },
        { label: 'Team', href: '/team' },
        { label: 'Contact', href: '/contact' },
      ]},
    },
    footer: {
      ctaHeading: { type: String, default: "Let's Build Something Exceptional." },
      ctaSubtext: { type: String, default: "Let's Work Together" },
      email: { type: String, default: 'connect@vvadesignstudio.in' },
      phone: { type: String, default: '+91 7042024600' },
      address: { type: String, default: 'B-120 Ground Floor Level, Sector 43,\nFaridabad, Haryana — 121010. IN.' },
      brandName: { type: String, default: 'VVA' },
      tagline: { type: String, default: 'Design Studio' },
      navColumns: {
        type: [
          new Schema({ heading: String, links: [NavItemSchema] }, { _id: false }),
        ],
        default: [
          {
            heading: 'Studio',
            links: [
              { label: 'Projects', href: '/#projects' },
              { label: 'About', href: '/#about' },
              { label: 'Our Team', href: '/team' },
              { label: 'Contact', href: '/#contact' },
            ],
          },
          {
            heading: 'Services',
            links: [
              { label: 'Master Planning', href: '/services' },
              { label: 'Architectural Design', href: '/services' },
              { label: 'Infrastructure Design', href: '/services' },
              { label: 'Landscape Design', href: '/services' },
            ],
          },
        ],
      },
      socialLinks: {
        type: [NavItemSchema],
        default: [
          { label: 'Instagram', href: 'https://www.instagram.com/vvarts.studio/' },
          { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vva-design-studio/' },
        ],
      },
      copyright: { type: String, default: 'Architecture & Interiors — Faridabad, Haryana' },
    },
    seo: {
      metaTitle: { type: String, default: 'VVA — Architecture & Interiors' },
      metaDescription: { type: String, default: 'Award-winning architecture and interior design studio crafting spaces that inspire.' },
      ogImage: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc: unknown, ret: Record<string, unknown>) => {
        ret.id = (ret._id as object).toString();
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const SiteSettings = models.SiteSettings || model('SiteSettings', SiteSettingsSchema);
export default SiteSettings;
