import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = dirname(fileURLToPath(import.meta.url));

/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: "/cart",
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
};

export default nextConfig;
