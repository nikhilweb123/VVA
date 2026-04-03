# ENSO Design - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install & Run

```bash
# Navigate to project
cd architecture-portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

### 2. Project Structure

```
architecture-portfolio/
├── app/
│   ├── components/          # Reusable UI components
│   ├── sections/            # Full-page sections
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── index.ts             # Central exports
├── public/                  # Static assets
├── tailwind.config.ts       # Design tokens
├── next.config.js           # Next.js config
├── tsconfig.json            # TypeScript config
├── postcss.config.js        # PostCSS config
├── package.json             # Dependencies
├── README.md                # Full documentation
├── FEATURES.md              # Feature list
├── DEVELOPMENT.md           # Dev guide
└── DEPLOYMENT.md            # Deploy guide
```

### 3. Update Content

**Hero Section** - `app/sections/Hero.tsx`
```typescript
<Hero
  title="YOUR COMPANY"
  subtitle="Your tagline"
  backgroundImage="url('/your-bg.jpg')"
/>
```

**Projects** - `app/sections/ProjectShowcase.tsx`
```typescript
const projects = [
  {
    id: 1,
    title: 'Your Project',
    category: 'Category',
    description: 'Description',
    image: 'gradient-color',
  },
  // Add more projects...
];
```

**About** - `app/sections/About.tsx`
```typescript
// Update company info, stats, and values
```

**Contact** - `app/sections/Footer.tsx`
```typescript
const contactInfo = [
  { label: 'Email', value: 'your.email@company.com' },
  { label: 'Phone', value: '+1 (000) 000-0000' },
  { label: 'Location', value: 'Your City, Country' },
];
```

### 4. Customize Design

**Colors** - `tailwind.config.ts`
```typescript
colors: {
  dark: '#000000',
  light: '#FFFFFF',
  // Add your colors
}
```

**Typography** - `tailwind.config.ts`
```typescript
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'],
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
}
```

**Animations** - Component files
```typescript
transition={{ duration: 0.8, ease: 'easeOut' }}
```

### 5. Deploy

```bash
# Build for production
npm run build

# Test production build
npm run start

# Deploy to Vercel
npm i -g vercel
vercel
```

---

## 📂 File Quick Reference

### Components (`app/components/`)
| File | Purpose | Status |
|------|---------|--------|
| `Header.tsx` | Navigation bar | ✅ Complete |
| `ScrollIndicator.tsx` | Progress bar & dot | ✅ Complete |
| `CustomCursor.tsx` | Premium cursor | ✅ Optional |
| `ContactForm.tsx` | Contact form | ✅ Complete |

### Sections (`app/sections/`)
| File | Purpose | Status |
|------|---------|--------|
| `Hero.tsx` | Fullscreen hero | ✅ Complete |
| `ProjectShowcase.tsx` | Project sections | ✅ Complete |
| `ImageGrid.tsx` | Masonry grid | ✅ Complete |
| `About.tsx` | About section | ✅ Complete |
| `Footer.tsx` | Footer with links | ✅ Complete |

### Hooks (`app/hooks/`)
| File | Purpose | Status |
|------|---------|--------|
| `useScrollTrigger.ts` | GSAP animations | ✅ Complete |
| `useLenisScroll.ts` | Smooth scroll | ✅ Complete |

### Utilities (`app/utils/`)
| File | Purpose | Status |
|------|---------|--------|
| `animations.ts` | Animation helpers | ✅ Complete |

---

## 🎨 Design System

### Typography Sizes
- **Display XL**: 96px (headings)
- **Display LG**: 72px (section titles)
- **Display MD**: 56px (subheadings)
- **Heading LG**: 36px
- **Body LG**: 18px
- **Body MD**: 16px (default)

### Colors
- **Dark**: #000000
- **Light**: #FFFFFF
- **Gray**: 900-100 scale
- **Custom**: Add to `tailwind.config.ts`

### Spacing
- **Base unit**: 4px
- **Section**: 120px (mobile: 60px)
- **Container max**: 1400px
- **Container padding**: 40px

---

## ⚡ Key Features at a Glance

### Animations
- ✅ Lenis smooth scroll
- ✅ GSAP parallax
- ✅ Framer Motion interactions
- ✅ Stagger animations
- ✅ Hover effects
- ✅ Scroll indicators

### Performance
- ✅ Next.js 14 optimization
- ✅ Image lazy loading
- ✅ Code splitting
- ✅ CSS optimization
- ✅ Fast Core Web Vitals
- ✅ Mobile optimized

### Responsive
- ✅ Mobile first
- ✅ All breakpoints covered
- ✅ Touch friendly
- ✅ Tablet optimized
- ✅ Desktop perfect

---

## 🔧 Common Tasks

### Add a New Section

```typescript
// app/sections/MySection.tsx
'use client';

import { motion } from 'framer-motion';

export const MySection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        <motion.h2 className="text-display-lg font-serif">
          My Section
        </motion.h2>
      </div>
    </section>
  );
};
```

Then add to `app/page.tsx`:
```typescript
import { MySection } from './sections/MySection';

export default function Home() {
  return (
    <main>
      {/* ... other sections ... */}
      <MySection />
    </main>
  );
}
```

### Add Animation to Element

```typescript
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  viewport={{ once: true, amount: 0.3 }}
>
  Your content
</motion.div>
```

### Add Hover Effect

```typescript
<motion.button
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

### Change Colors

Update in `tailwind.config.ts`:
```typescript
colors: {
  dark: '#1a1a1a',      // Dark color
  light: '#f0f0f0',     // Light color
}
```

### Customize Fonts

Update in `globals.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

---

## 📊 Performance Targets

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

---

## 🔒 Deployment Checklist

- [ ] Update all content
- [ ] Configure environment variables
- [ ] Optimize images
- [ ] Test animations
- [ ] Mobile test
- [ ] Run Lighthouse audit
- [ ] Setup domain/DNS
- [ ] Enable HTTPS
- [ ] Configure analytics
- [ ] Setup monitoring

**For detailed deployment steps, see `DEPLOYMENT.md`**

---

## 📚 Documentation

- **README.md** - Full project overview
- **FEATURES.md** - Complete feature list
- **DEVELOPMENT.md** - Developer guide
- **DEPLOYMENT.md** - Deployment instructions

---

## 🆘 Troubleshooting

### Smooth scroll not working?
- Check if Lenis is initialized in `page.tsx`
- Verify GSAP ScrollTrigger is registered
- Check browser console for errors

### Animations not showing?
- Verify viewport thresholds
- Check element ref connections
- Ensure GSAP context is created
- Test in different browser

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Performance issues?
```bash
# Analyze bundle
npx next/bundle-analyzer

# Check Lighthouse
npx lighthouse https://localhost:3000
```

---

## 🚀 Ready to Launch?

1. **Customize** your content
2. **Test** thoroughly
3. **Build** for production: `npm run build`
4. **Deploy** to Vercel/Netlify
5. **Monitor** performance

---

## 💡 Pro Tips

1. **Use custom hooks** for complex animations
2. **Lazy load** heavy components
3. **Optimize images** before deployment
4. **Test on real devices** regularly
5. **Monitor Core Web Vitals** continuously
6. **Keep animations subtle** for better performance
7. **Use CSS classes** for static styles
8. **Leverage TypeScript** for type safety

---

## 📞 Support Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Framer Motion](https://www.framer.com/motion/)
- [GSAP Docs](https://greensock.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lenis Docs](https://lenis.darkroom.engineering)

---

## 🎉 You're All Set!

Your premium architecture portfolio is ready to customize and deploy.

**Happy coding!** 🚀

---

*Last Updated: 2024*
*Version: 1.0.0*
*License: MIT*
