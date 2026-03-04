import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          // Rewrite boats.datasalt.ai → /boats
          source: "/((?!_next|boats|resort|images|favicon\\.ico).*)",
          has: [{ type: "host", value: "boats.datasalt.ai" }],
          destination: "/boats/$1",
        },
        {
          // Rewrite resort.datasalt.ai → /resort
          source: "/((?!_next|resort|boats|images|favicon\\.ico).*)",
          has: [{ type: "host", value: "resort.datasalt.ai" }],
          destination: "/resort/$1",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
