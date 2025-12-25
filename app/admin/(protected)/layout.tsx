import { AdminNav } from '@/app/admin/components/AdminNav'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
