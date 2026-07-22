export * from './auth';

import type { Auth } from './auth';

export interface SeoLocaleConfig {
    path: string;
    og_locale: string;
    image: string;
}

export interface SeoOrganization {
    name: string;
    founder: string;
    logo: string;
    area_served: string[];
}

export interface SeoSocialLink {
    url: string;
    icon: string;
    label: string;
}

export interface SeoDefaults {
    url: string;
    siteName: string;
    twitterHandle: string;
    defaultImage: string;
    defaultImageWidth: number;
    defaultImageHeight: number;
    organization: SeoOrganization;
    social: Record<string, SeoSocialLink>;
    locales: Record<string, SeoLocaleConfig>;
    defaultLocale: string;
}

export type AppPageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    name: string;
    auth: Auth;
    seoDefaults: SeoDefaults;
    [key: string]: unknown;
};
