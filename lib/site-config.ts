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
    sourceCode: 'https://github.com/emigdio821/the-secret-chat',
  },
}
