interface CaseStudyFindingsProps {
  children: React.ReactNode;
}

export function CaseStudyFindings({ children }: CaseStudyFindingsProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="text-teal font-mono text-base">03</span>
          Key Findings
        </h2>
        <div className="space-y-6">{children}</div>
      </div>
    </section>
  );
}
