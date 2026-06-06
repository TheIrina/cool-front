"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, Suspense } from "react"
import Script from "next/script"

export function NavigationAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === "undefined") return

    // 1. Meta Pixel PageView
    if (typeof window.fbq === "function") {
      window.fbq('track', 'PageView')
    }

    // 2. Google Analytics page_view
    if (typeof window.gtag === "function") {
      window.gtag('event', 'page_view', {
        page_path: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ""),
        page_location: window.location.href,
        page_title: document.title
      })
    }
  }, [pathname, searchParams])

  return null
}

export function AnalyticsScripts() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  return (
    <>
      {pixelId && (
        <>
          <Script
            id="fb-pixel"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
              `,
            }}
          />
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}

      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  send_page_view: false
                });
              `,
            }}
          />
        </>
      )}
    </>
  )
}

export function AnalyticsProvider() {
  return (
    <>
      <AnalyticsScripts />
      <Suspense fallback={null}>
        <NavigationAnalytics />
      </Suspense>
    </>
  )
}
