import type { NextConfig } from "next";

/**
 * Dashboard di-export statis (folder out/) lalu disajikan oleh server Express bot
 * (src/dashboard/server.js). Semua data diambil dari /api/* di browser.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
