import { NextResponse } from 'next/server'

export default function middleware(req) {
  const { pathname } = req.nextUrl
  // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
  const hostname = req.headers.get('host')

  // If localhost, assign the host value manually
  // If prod, get the custom domain/customHost value by removing the root URL
  // (in the case of "test.vercel.app", "vercel.app" is the root URL)

  const currentHost =
    process.env.NODE_ENV === 'production'
      ? hostname.replace(`.${process.env.NEXT_PUBLIC_HOSTNAME}`, '')
      : process.env.TEST_HOST

  // Prevent security issues – users should not be able to canonically access
  // the pages/sites folder and its respective contents. This can also be done
  // via rewrites to a custom 404 page
  if (pathname.startsWith(`/_hosts`)) {
    return new Response(null, { status: 404 })
  }

  if (
    currentHost &&
    currentHost !== process.env.NEXT_PUBLIC_HOSTNAME &&
    !pathname.includes('.') && // exclude all files in the public folder
    !pathname.startsWith('/api') // exclude all API routes
  ) {
    // rewrite to the current hostname under the pages/sites folder
    // the main logic component will happen in pages/sites/[site]/index.tsx
    const url = req.nextUrl.clone()
    url.pathname = `/_hosts/${currentHost}${pathname}`
    return NextResponse.rewrite(url)
  }
}
