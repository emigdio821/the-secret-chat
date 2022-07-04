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
      <meta name="description" content={description} />
    </Head>
  )
}
