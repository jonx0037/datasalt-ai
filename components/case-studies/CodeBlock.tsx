interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
}

export function CodeBlock({ code, language, title }: CodeBlockProps) {
  return (
    <div className="my-6 rounded-lg overflow-hidden border border-border">
      {title && (
        <div className="bg-muted px-4 py-2 border-b border-border">
          <p className="text-xs font-mono text-muted-foreground">{title}</p>
        </div>
      )}
      <div className="text-sm [&_pre]:p-4 [&_pre]:m-0 [&_pre]:bg-[#0d1117] [&_code]:font-mono">
        <pre><code className={`hljs language-${language}`}>{code}</code></pre>
      </div>
    </div>
  );
}
