const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://*.sentry.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: https://images.unsplash.com",
      "connect-src 'self' https://*.sentry.io https://rpc.ankr.com https://eth.llamarpc.com",
      "font-src 'self' https://fonts.gstatic.com",
      "frame-ancestors 'none'",
      "base-uri 'self'"
    ].join('; ')
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  }
];

const config = {
  reactStrictMode: true,
  experimental: {
    instrumentationHook: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders
      }
    ];
  }
};

let withSentryConfig = (nextConfig) => nextConfig;
try {
  ({ withSentryConfig } = await import("@sentry/nextjs"));
} catch (error) {
  console.warn("Sentry not initialized during build:", error?.message ?? error);
}

export default withSentryConfig(config, { silent: true }, { hideSourceMaps: true });
