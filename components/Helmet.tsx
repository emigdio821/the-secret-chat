import Head from 'next/head'

interface DynamicHeadProps {
  title?: string
  image?: string
  description?: string
}

export default function DynamicHead({
  title = 'TheScretetChat',
  description = 'TheScretetChat is a simple secret chat app',
}: DynamicHeadProps) {
  return (
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="description" content={description} />
    </Head>
  )
}
