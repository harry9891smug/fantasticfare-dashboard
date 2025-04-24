import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "./context/AuthContext";
const nunito = Nunito({
  subsets: ['latin'],
  weight: ['200', '300', '400', '600', '700', '800', '900'],
  variable: '--font-nunito'
})

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['200'],
  variable: '--font-nunito-sans'
})

export const metadata: Metadata = {
  title: 'Rica - Dashboard',
  description: 'Rica admin dashboard template',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 
  return (
    <html lang="en" className={`${nunito.variable} ${nunitoSans.variable} `}>
      <body>
      <AuthProvider>{children}</AuthProvider>
        
     
      </body>
    </html>
  )
}