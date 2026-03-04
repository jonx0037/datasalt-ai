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
          // Rewrite boats.datasalt.ai → /boats, excluding _next assets
          // and paths already prefixed with /boats (to avoid double-rewriting)
          source: "/((?!_next|boats|favicon\\.ico).*)",
          has: [{ type: "host", value: "boats.datasalt.ai" }],
          destination: "/boats/$1",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
