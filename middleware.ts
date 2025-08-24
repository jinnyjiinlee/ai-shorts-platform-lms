import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            httpOnly: false,
            path: '/'
          };
          
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: any) {
          const cookieOptions = {
            ...options,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            httpOnly: false,
            path: '/'
          };
          
          request.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...cookieOptions,
          });
        },
      },
    }
  );

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/auth/register'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If no session and trying to access protected route
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL('/', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If user is authenticated, check role-based access
    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', session.user.id)
        .single();

      console.log('Middleware - Profile data:', profile);
      console.log('Middleware - Profile error:', profileError);
      console.log('Middleware - User ID:', session.user.id);
      console.log('Middleware - Pathname:', pathname);

      // Check if user is approved
      if (profile?.status !== 'approved') {
        console.log('User not approved, redirecting to pending');
        const redirectUrl = new URL('/auth/pending', request.url);
        return NextResponse.redirect(redirectUrl);
      }

      // Get user role
      const userRole = profile?.role;
      console.log('User role:', userRole);

      // Role-based route protection
      if (pathname.startsWith('/admin')) {
        if (userRole !== 'admin') {
          console.log('Non-admin trying to access admin area, redirecting to student');
          return NextResponse.redirect(new URL('/student', request.url));
        }
      } else if (pathname.startsWith('/student')) {
        if (userRole !== 'student') {
          console.log('Non-student trying to access student area, redirecting to admin');
          return NextResponse.redirect(new URL('/admin', request.url));
        }
      }
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
