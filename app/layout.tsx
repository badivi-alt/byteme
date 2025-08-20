import "./globals.css"
import Sidebar from "@/components/Sidebar"
import Topbar from "@/components/Topbar"
import Providers from "@/components/Providers"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ByteSized Starter",
  description: "Next.js 14 + Prisma + NextAuth starter"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Providers>
          <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="p-6">
                <div className="container max-w-6xl mx-auto">{children}</div>
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
