import type React from "react"
import { MantineUIProvider } from "@/components/mantine-provider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Rebane's Discord Colored Text Generator",
  description: "Create colored text for Discord messages using ANSI color codes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MantineUIProvider>{children}</MantineUIProvider>
      </body>
    </html>
  )
}

