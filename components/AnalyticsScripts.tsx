'use client'

import Script from 'next/script'

const GA_ID = process.env.NEXT_PUBLIC_GA4_ID
const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID
const CRISP_ID = process.env.NEXT_PUBLIC_CRISP_ID

export default function AnalyticsScripts() {
  return (
    <>
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {HOTJAR_ID && (
        <Script id="hotjar-init" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${HOTJAR_ID},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r)})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}
      {CRISP_ID && (
        <Script id="crisp-init" strategy="afterInteractive">
          {`window.$crisp=[];window.CRISP_WEBSITE_ID="${CRISP_ID}";(function(){var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s)})()`}
        </Script>
      )}
    </>
  )
}
