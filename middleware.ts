import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/utils/env'

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let host = req.headers
    .get("host")!
    .replace(".localhost:3000", "")
    .replace(`.${env.NEXT_PUBLIC_ROOT_DOMAIN}`, "");

  // special case for Vercel preview deployment URLs
  if (
    host.includes("---") &&
    host.endsWith(".vercel.app")
  ) {
    host = `${host.split("---")[0]}.${env.NEXT_PUBLIC_ROOT_DOMAIN}`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  // rewrites for app pages
  // if (host == `app.${env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
  //   const session = await getToken({ req });
  //   if (!session && path !== "/login") {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   } else if (session && path == "/login") {
  //     return NextResponse.redirect(new URL("/", req.url));
  //   }
  //   return NextResponse.rewrite(
  //     new URL(`/app${path === "/" ? "" : path}`, req.url),
  //   );
  // }

  // rewrite root application to `/home` folder
  if (
    host === "localhost:3000" ||
    host === env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`${path === "/" ? "" : path}`, req.url),
    );
  }

  // rewrite everything else to `/[host]/[slug] dynamic route
  return NextResponse.rewrite(new URL(`/${host}${path}`, req.url));
}
