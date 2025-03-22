import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { AuthInitializer } from "@/components/auth/auth-initializer"
import "@/app/globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>
        <AuthInitializer />
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
