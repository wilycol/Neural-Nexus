import createMiddleware from 'next-intl/middleware';
 
export default createMiddleware({
  // A list of all locales that are supported
  locales: ['es', 'en'],
 
  // Used when no locale matches
  defaultLocale: 'es'
});
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(es|en)/:path*',

    // Enable redirects for all internal paths unless 
    // they are part of the exceptions list
    '/((?!api|_next|_vercel|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};
