export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'The Secret Chat',
  url: 'https://thesecretchat.vercel.app/',
  description: 'The Secret Chat is a simple chat app.',
  ogUrl: 'https://thesecretchat.vercel.app/api/og',
  navItems: [
    {
      title: 'Resume',
      href: '/resume',
    },
  ],
  links: {
    github: 'https://github.com/emigdio821/',
    sourceCode: 'https://github.com/emigdio821/em-torres',
    linkedin: 'https://www.linkedin.com/in/emigdio821/',
    jobCompany: 'https://www.wizeline.com/',
    location: 'https://www.google.com.mx/maps/place/Jalisco',
  },
}
