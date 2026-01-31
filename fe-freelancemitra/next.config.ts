// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
};

export default nextConfig;
