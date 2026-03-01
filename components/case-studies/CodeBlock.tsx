import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export async function CodeBlock({ code, language, title }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  });

  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border">
      {title && (
        <div className="bg-muted px-4 py-2 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground">{title}</p>
        </div>
      )}
      <div
        className="text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-[#0d1117] [&_code]:font-mono"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
