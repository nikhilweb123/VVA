import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import HomepageContent from '@/models/HomepageContent';

export const dynamic = 'force-dynamic';

const DEFAULT_CONTENT = {
  hero: [
    {
      src: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=85',
      title: 'A Sleek Vision of\nModern Commerce',
      subtitle: 'Golden Square, Manesar',
      location: 'Haryana',
      ctaText: '',
      ctaLink: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&q=85',
      title: 'Merging Modernity with\nCultural Heritage',
      subtitle: 'Mall Extension, Amritsar',
      location: 'Punjab',
      ctaText: '',
      ctaLink: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=1920&q=85',
      title: 'Industrial Design\nwith Precision',
      subtitle: 'Lal Sweets, Greater Noida',
      location: 'Uttar Pradesh',
      ctaText: '',
      ctaLink: '',
    },
    {
      src: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee?w=1920&q=85',
      title: 'Strategic Planning for\nSustainable Living',
      subtitle: 'Village Wave Group, Bengaluru',
      location: 'Karnataka',
      ctaText: '',
      ctaLink: '',
    },
  ],
  about: {
    title: 'Vaibhav Vashisht Architects Design Studio Private Limited',
    description1:
      'Headed by Mr. Vaibhav Vashisht, Architect, Registered under Council of Architecture (CoA), with Design & Execution experience of 18+ years, supported by a strong team of 6 Architects & Interior Designers.',
    description2:
      'Based in Faridabad NCR, executing projects PAN India. As creative thinkers and technology specialists, we have designed & executed multiple projects with strengths in Residential — High-Rise & Low-Rise buildings, Industrial, Warehousing, Retail, Multiplexes & Hotels.',
    image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=1000&q=80',
  },
  servicesHeading: 'Elevating spaces through thoughtful design.',
  servicesSubheading: 'Our Expertise',
  services: [
    { title: 'Master Planning', description: 'Comprehensive master planning strategies that integrate community needs, ecological balance, and long-term urban viability.' },
    { title: 'Architectural Design', description: 'Creating visionary, functional, and sustainable structures that redefine spatial experiences and respond harmoniously to their contexts.' },
    { title: 'Infrastructure Design Development', description: 'End-to-end infrastructure design and development ensuring seamless integration of technical systems with architectural vision.' },
    { title: 'Landscape and Hardscape Design', description: 'Designing outdoor environments that harmoniously blend soft landscaping with hardscape elements to create cohesive, liveable spaces.' },
    { title: 'Urban Spaces and Master Planning', description: 'Forward-looking urban design strategies that activate public spaces and shape thriving, connected communities.' },
    { title: 'Workspace Interior', description: 'Crafting productive and inspiring workplace environments that balance aesthetic elegance with intuitive flow and functional efficiency.' },
    { title: 'Hospitality Interior', description: 'Designing immersive hospitality spaces that create memorable guest experiences through thoughtful detailing and refined aesthetics.' },
    { title: 'Retail & Public Space Interior', description: 'Creating engaging retail and public interiors that draw people in, elevate brand presence, and encourage meaningful interaction.' },
  ],
  stats: [
    { value: '18+', label: 'Years of Practice' },
    { value: '120+', label: 'Projects Completed' },
    { value: '14', label: 'Design Awards' },
    { value: '8', label: 'States Across India' },
  ],
  testimonials: [],
  footer: {
    ctaHeading: "Let's Build Something Exceptional.",
    ctaSubtext: "Let's Work Together",
    email: 'connect@vvadesignstudio.in',
    phone: '+91 7042024600',
    address: 'B-120 Ground Floor Level, Sector 43, Faridabad, Haryana — 121010. IN.',
    brandName: 'VVA',
    tagline: 'Design Studio',
    socialLinks: [
      { label: 'Instagram', href: 'https://www.instagram.com/vvarts.studio/' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/vva-design-studio/' },
    ],
    copyright: 'Architecture & Interiors — Faridabad, Haryana',
  },
};

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  try {
    await dbConnect();
    const content = await HomepageContent.findOne({}).lean();
    return NextResponse.json(content ?? DEFAULT_CONTENT);
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(DEFAULT_CONTENT);
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const content = await HomepageContent.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json({ error: 'Failed to update homepage content' }, { status: 500 });
  }
}
