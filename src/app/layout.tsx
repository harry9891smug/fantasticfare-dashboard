import type { Metadata } from 'next'
import { Nunito, Nunito_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from "./context/AuthContext";

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
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
  title: 'FantasticFare Dashboard',
  description: 'FantasticFare Dashboard',
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
      <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
     
      </body>
    </html>
  )
}