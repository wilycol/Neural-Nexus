const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/** @type {import('next').NextConfig} */
const baseConfig = {
  images: {
    domains: ["localhost", "images.unsplash.com", "picsum.photos", "wsyotripkntaetxxzlkc.supabase.co"],
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

module.exports = (phase) => {
  const distDir = phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next-build";
  return { ...baseConfig, distDir };
};
// Force deploy trigger - 03/28/2026 15:47:18
