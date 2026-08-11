/** @type {import("next").NextConfig} */
const nextConfig = {
  basePath: "/cart",
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
