export const siteConfig = {
  name: 'Nexus',
  description: 'A modern blogging platform built with Next.js, tRPC, and Drizzle ORM',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  author: {
    name: 'Atharv Shelke',
    email: 'shelkeatharv964@gmail.com',
    // twitter: '@yourusername',
    github: 'AtharvShelke',
  },
  links: {
    github: 'https://github.com/AtharvShelke/blog-app',
    // twitter: 'https://twitter.com/yourusername',
    linkedin: 'https://linkedin.com/in/atharv-shelke',
  },
  meta: {
    locale: 'en_US',
    type: 'website',
  },
  nav: [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Blog',
      href: '/blog',
    },
    {
      title: 'Dashboard',
      href: '/dashboard',
    },
  ],
  footer: {
    links: [
      {
        title: 'Navigation',
        items: [
          { title: 'Home', href: '/' },
          { title: 'Blog', href: '/blog' },
          { title: 'Dashboard', href: '/dashboard' },
        ],
      },
      {
        title: 'Resources',
        items: [
          { title: 'Documentation', href: '#' },
          { title: 'API Reference', href: '#' },
          { title: 'Support', href: '#' },
        ],
      },
      {
        title: 'Social',
        items: [
          { title: 'GitHub', href: 'https://github.com/AtharvShelke' },
        //   { title: 'Twitter', href: 'https://twitter.com/yourusername' },
          { title: 'LinkedIn', href: 'https://linkedin.com/in/atharv-shelke' },
        ],
      },
    ],
  },
  postsPerPage: 12,
  excerpt: {
    maxLength: 160,
  },
};

export type SiteConfig = typeof siteConfig;
