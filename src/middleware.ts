import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr'];
const defaultLocale = 'fr';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // --- CORRECTION ICI ---
  // On ajoute une condition pour ignorer tous les fichiers qui ont une extension (ex: .pdf, .png)
  matcher: [
    '/((?!api|_next/static|_next/image|.*\\..*).*)',
  ],
};