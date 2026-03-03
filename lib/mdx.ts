import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  tags: string[];
  readTime: string;
  hero: string;
}

export interface PostWithContent extends Post {
  content: string;
}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
}

export function getAllPosts(): Post[] {
  ensureBlogDir();

  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const posts = files
    .map((filename) => {
      const slug = filename.replace(/\.(mdx|md)$/, "");
      const filepath = path.join(BLOG_DIR, filename);
      const raw = fs.readFileSync(filepath, "utf-8");
      const { data, content } = matter(raw);
      const stats = readingTime(content);

      const tags = data.tags ?? [];
      return {
        slug,
        title: data.title ?? "Untitled",
        date: data.date ?? new Date().toISOString().split("T")[0],
        category: data.category ?? tags[0] ?? "General",
        excerpt: data.excerpt ?? data.description ?? "",
        tags,
        readTime: stats.text,
        hero: data.hero ?? "",
      } satisfies Post;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): PostWithContent | null {
  ensureBlogDir();

  const extensions = [".mdx", ".md"];
  let filepath: string | null = null;

  for (const ext of extensions) {
    const candidate = path.join(BLOG_DIR, `${slug}${ext}`);
    if (fs.existsSync(candidate)) {
      filepath = candidate;
      break;
    }
  }

  if (!filepath) return null;

  const raw = fs.readFileSync(filepath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const tags = data.tags ?? [];
  return {
    slug,
    title: data.title ?? "Untitled",
    date: data.date ?? new Date().toISOString().split("T")[0],
    category: data.category ?? tags[0] ?? "General",
    excerpt: data.excerpt ?? data.description ?? "",
    tags,
    readTime: stats.text,
    hero: data.hero ?? "",
    content,
  };
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
