// next.config.ts
import { NextConfig } from "next";

const nextConfig: NextConfig = {
    devIndicators: false,
    output: "standalone",
    experimental: {
        optimizePackageImports: ["@chakra-ui/react"],
    },
};

export default nextConfig;
