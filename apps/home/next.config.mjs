import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = dirname(fileURLToPath(import.meta.url));
const cartOrigin = process.env.CART_ORIGIN ?? "http://localhost:3002";

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: resolve(appDirectory, "../.."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**",
      },
    ],
  },
  transpilePackages: ["@kayra/cart-contract", "@kayra/types", "@kayra/ui"],
  async rewrites() {
    return [
      {
        source: "/cart/:path*",
        destination: `${cartOrigin}/cart/:path*`,
      },
    ];
  },
};

export default nextConfig;
