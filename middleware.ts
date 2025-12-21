import { createServerClient, type CookieOptions } from '@supabase/ssr';
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// 1. Inicializamos el middleware de idiomas
const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
    // 2. Obtenemos la respuesta del middleware de idiomas
    let response = intlMiddleware(req);

    // 3. Configuramos el cliente de Supabase para el Middleware
    // Esta es la forma recomendada para Next.js 14/15
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return req.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        req.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: req.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 4. Refrescamos la sesión (Importante para mantener el login activo)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // 5. Lógica de Protección de Rutas
    const pathname = req.nextUrl.pathname;

    // Verificamos si la ruta es /admin (incluyendo /es/admin, /pt/admin, etc.)
    const isAdminPage = pathname.split('/').some(segment => segment === 'admin');

    // Si intenta entrar a admin y no hay usuario, redirigimos a /login
    if (isAdminPage && !user) {
        const locale = pathname.split('/')[1] || 'es';
        const loginUrl = new URL(`/${locale}/login`, req.url);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    // Matcher para que el middleware corra en todas las rutas excepto archivos estáticos y APIs
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)'],
};