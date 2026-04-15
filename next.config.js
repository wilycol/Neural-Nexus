const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const withNextIntl = require('next-intl/plugin')('./i18n.ts');

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com", "picsum.photos", "wsyotripkntaebxzzlkc.supabase.co"],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(baseConfig);
// Force deploy trigger - 04/15/2026 15:46:00💋🖤✨
