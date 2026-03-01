interface CaseStudyChallengeProps {
  children: React.ReactNode;
}

export function CaseStudyChallenge({ children }: CaseStudyChallengeProps) {
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <span className="text-teal font-mono text-base">01</span>
          The Challenge
        </h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none text-muted-foreground leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}
