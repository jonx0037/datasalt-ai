import { MDXRemote as NextMDXRemote } from "next-mdx-remote/rsc";

interface MDXRemoteProps {
  source: string;
}

export function MDXRemote({ source }: MDXRemoteProps) {
  return <NextMDXRemote source={source} />;
}
