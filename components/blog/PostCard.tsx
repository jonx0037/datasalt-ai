import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/mdx";
import type { Post } from "@/lib/mdx";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col border-border hover:border-teal/40 transition-colors group overflow-hidden">
      {/* Hero image */}
      <Link href={`/blog/${post.slug}`} className="block">
        {post.hero ? (
          <div className="relative aspect-video">
            <Image
              src={post.hero}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-navy to-navy-dark flex items-center justify-center">
            <span className="text-white/20 text-sm font-mono">DataSalt</span>
          </div>
        )}
      </Link>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {post.category}
          </Badge>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-semibold text-foreground group-hover:text-teal transition-colors leading-snug">
            {post.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3">
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
          {post.excerpt}
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 rounded text-xs font-mono text-teal/80 bg-teal/5 border border-teal/10"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs text-teal hover:text-teal/80 font-medium transition-colors"
          >
            Read
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
