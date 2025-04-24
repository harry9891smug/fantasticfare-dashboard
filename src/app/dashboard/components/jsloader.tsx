'use client'

import Script from 'next/script'

export default function JsLoader() {
  return (
    <>
     
      {/* Other scripts */}
    <Script src="/assets/js/jquery-3.5.1.min.js"  strategy="lazyOnload"  />
    <Script src="/assets/js/bootstrap/bootstrap.bundle.min.js" strategy="lazyOnload"  />
    <Script src="/assets/js/icons/feather-icon/feather.min.js" strategy="lazyOnload"  />
    <Script src="/assets/js/icons/feather-icon/feather-icon.js" strategy="lazyOnload"  />
    <Script src="/assets/js/scrollbar/simplebar.js" strategy="lazyOnload"  />
    <Script src="/assets/js/scrollbar/custom.js" strategy="lazyOnload"  />
    <Script src="/assets/js/config.js" strategy="lazyOnload"  />
    <Script src="/assets/js/tooltip-init.js" strategy="lazyOnload"  />
    <Script src="/assets/js/slick.js" strategy="lazyOnload"  />
    <Script src="/assets/js/sidebar-menu.js" strategy="lazyOnload"  />
    <Script src="/assets/js/notify/bootstrap-notify.min.js" strategy="lazyOnload"  />
    <Script src="/assets/js/notify/index.js" strategy="lazyOnload"  />
    <Script src="/assets/js/typeahead/handlebars.js" strategy="lazyOnload"  />
    <Script src="/assets/js/typeahead/typeahead.bundle.js" strategy="lazyOnload"  />
    <Script src="/assets/js/typeahead/typeahead.custom.js" strategy="lazyOnload"  />
    <Script src="/assets/js/typeahead-search/handlebars.js" strategy="lazyOnload"  />
    <Script src="/assets/js/typeahead-search/typeahead-custom.js" strategy="lazyOnload"  />
    <Script src="/assets/js/datepicker/date-picker/datepicker.js" strategy="lazyOnload"  />
    <Script src="/assets/js/datepicker/date-picker/datepicker.en.js" strategy="lazyOnload"  />
    <Script src="/assets/js/datepicker/date-picker/datepicker.custom.js" strategy="lazyOnload"  />
    <Script src="/assets/js/chart/apex-chart/moment.min.js" strategy="lazyOnload"  />
    <Script src="/assets/js/chart/apex-chart/apex-chart.js" strategy="lazyOnload"  />
    <Script src="/assets/js/chart/apex-chart/stock-prices.js" strategy="lazyOnload"  />
    <Script src="/assets/js/chart/apex-chart/chart-custom.js" strategy="lazyOnload"  />
    <Script src="/assets/js/ratio.js" strategy="lazyOnload"  />
    <Script src="/assets/js/customizer.js" strategy="lazyOnload"  />
    <Script src="/assets/js/vector-map/jquery-jvectormap-2.0.2.min.js" strategy="lazyOnload"  />
    <Script src="/assets/js/vector-map/map/jquery-jvectormap-world-mill-en.js" strategy="lazyOnload"  />
    <Script src="/assets/js/vector-map/map-vector.js" strategy="lazyOnload"  />
    <Script src="/assets/js/script.js" strategy="lazyOnload"  />
    </>
  )
}