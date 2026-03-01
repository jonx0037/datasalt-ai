import type { Metadata } from "next";
import { getAllPosts } from "@/lib/mdx";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Blog — DataSalt",
  description:
    "Applied ML tutorials, NLP use cases in finance and government, and practical AI engineering insights from the DataSalt team.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
            Thought Leadership
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Applied ML tutorials, NLP use cases in finance and government, and
            practical insights from building real production systems.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium mb-2">Posts coming soon.</p>
            <p className="text-sm">
              Thought leadership content is in progress. Check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
