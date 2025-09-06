import type { NextConfig } from "next";

const redirects: NextConfig["redirects"] = async () => [
  {
    source: "/",
    destination: "/generator",
    permanent: true,
  },
];

const nextConfig: NextConfig = {
  redirects,
};

export default nextConfig;
