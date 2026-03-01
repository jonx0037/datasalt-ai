interface Tool {
  name: string;
  description: string;
}

interface CaseStudyApproachProps {
  overview: string;
  tools?: Tool[];
  children?: React.ReactNode;
}

export function CaseStudyApproach({
  overview,
  tools,
  children,
}: CaseStudyApproachProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="text-teal font-mono text-base">02</span>
          Our Approach
        </h2>

        <p className="text-muted-foreground leading-relaxed mb-6">
          {overview}
        </p>

        {tools && tools.length > 0 && (
          <ul className="space-y-2 mb-6">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 flex-shrink-0" />
                <span>
                  <strong className="text-foreground">{tool.name}</strong> —{" "}
                  {tool.description}
                </span>
              </li>
            ))}
          </ul>
        )}

        {children}
      </div>
    </section>
  );
}
