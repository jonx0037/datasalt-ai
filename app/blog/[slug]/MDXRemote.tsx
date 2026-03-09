import { MDXRemote as NextMDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { DemoCallout } from "@/components/case-studies/DemoCallout";

const mdxComponents = {
  DemoCallout,
};

interface MDXRemoteProps {
  source: string;
}

export function MDXRemote({ source }: MDXRemoteProps) {
  return (
    <NextMDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeHighlight],
        },
      }}
    />
  );
}
