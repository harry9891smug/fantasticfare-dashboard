'use client'

import { useEffect } from 'react'

export default function CssLoader() {
  useEffect(() => {
    const loadCSS = (href: string) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      document.head.appendChild(link)
      return () => document.head.removeChild(link)
    }

    const stylesheets = [
     '/assets/css/vector-map.css',
      '/assets/css/style.css',

      '/assets/css/magnific-popup.css',
      '/assets/css/responsive.css',
      '/assets/css/vendors/scrollbar.css',
      '/assets/css/vendors/animate.css',
      '/assets/css/vendors/date-picker.css',
      '/assets/css/vector-map.css',
      '/assets/css/slick.css',
      '/assets/css/slick-theme.css',
      '/assets/css/font-awesome.css',
      '/assets/css/vendors/themify.css',
      '/assets/css/ratio.css',
      '/assets/css/vendors/feather-icon.css',
      '/assets/css/vendors/bootstrap.css',
      '/assets/css/vendors/dropzone.css',
      'assets/css/vendors/chartist.css',
      'assets/css/vendors/bootstrap-tagsinput.css'
    ]

    const cleanups = stylesheets.map(loadCSS)

    return () => cleanups.forEach(cleanup => cleanup())
  }, [])

  return null
}
