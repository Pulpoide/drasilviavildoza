import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['es', 'en', 'pt'],

    // Used when no locale matches
    defaultLocale: 'es'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will preserve the locale in the URL
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
