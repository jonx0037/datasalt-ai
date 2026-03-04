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
          source: "/:path*",
          has: [{ type: "host", value: "boats.datasalt.ai" }],
          destination: "/boats/:path*",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default withMDX(nextConfig);
