const cartOrigin = process.env.CART_ORIGIN ?? "http://localhost:3001";

/** @type {import("next").NextConfig} */
const nextConfig = {
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
