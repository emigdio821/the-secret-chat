import { Navbar } from '@/components/navbar'

interface MainLayoutProps {
  children: React.ReactNode
}

export default async function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Navbar />
      <section className="px-4 pt-4">
        <div className="mx-auto max-w-2xl">{children}</div>
      </section>
    </>
  )
}
