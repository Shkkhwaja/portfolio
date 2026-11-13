import { PERSON, SITE_URL } from '@/lib/seo-config'

/**
 * Single source of truth for the "Multi Brand SEO Automation" OAuth pages
 * (/seo-automation and /seo-automation/privacy-policy).
 * Keep the name, scope and contact identical everywhere — Google's branding review compares them.
 */
export const APP_NAME = 'Multi Brand SEO Automation'
export const APP_PATH = '/seo-automation'
export const POLICY_PATH = '/seo-automation/privacy-policy'
export const APP_URL = `${SITE_URL}${APP_PATH}`
export const POLICY_URL = `${SITE_URL}${POLICY_PATH}`

export const OAUTH_SCOPE = 'https://www.googleapis.com/auth/webmasters'
export const REPORT_RETENTION_DAYS = 30

/** Contact shown on both pages: the verified email already used across the portfolio. */
export const CONTACT_EMAIL = PERSON.email
export const OPERATOR = PERSON.name
export const OPERATOR_LOCATION = PERSON.location

/** Update this whenever the policy text changes. */
export const POLICY_LAST_UPDATED = 'November 13, 2026'

export const GOOGLE_CONNECTIONS_URL = 'https://myaccount.google.com/connections'
export const GOOGLE_API_POLICY_URL = 'https://developers.google.com/terms/api-services-user-data-policy'
