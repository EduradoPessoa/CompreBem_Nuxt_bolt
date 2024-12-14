import { getHeader } from 'h3'

export default defineEventHandler((event) => {
  // Security headers
  const headers = event.node.res.headers
  
  // Prevent clickjacking
  headers.set('X-Frame-Options', 'DENY')
  
  // XSS protection
  headers.set('X-XSS-Protection', '1; mode=block')
  
  // Content Security Policy
  headers.set('Content-Security-Policy', [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "media-src 'self' blob:",
    "connect-src 'self'",
    "font-src 'self'"
  ].join('; '))
  
  // Prevent MIME type sniffing
  headers.set('X-Content-Type-Options', 'nosniff')
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // HSTS (uncomment in production with proper SSL)
  // headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
})