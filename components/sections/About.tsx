export function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-sm font-medium text-teal uppercase tracking-widest mb-3">
              About
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              We Work. We Build.
              <br />
              We Deliver.
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                DataSalt is a boutique AI/ML consultancy based in South Texas,
                founded by an AWS AI Engineer and Data Scientist with over a
                decade of experience building production systems. We specialize
                in applied machine learning, NLP, and cloud deployment — with
                the full-stack capability to deliver complete, usable products.
              </p>
              <p>
                We work with organizations that need real solutions — not slide
                decks. Our background spans financial NLP, government AI
                deployment, and cloud ML engineering at AWS. If your problem
                involves data, we can help you solve it.
              </p>
            </div>

            {/* Brand etymology */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground/70 leading-relaxed font-mono">
                <span className="text-teal font-medium">DataSalt</span> — named
                for the cryptographic practice of data salting, the Gulf of
                Mexico coastline of South Texas, and the timeless idiom of being
                worth your salt. Boutique by design. Enterprise by standard.
              </p>
            </div>
          </div>

          {/* Visual accent */}
          <div className="relative hidden lg:block">
            <div className="aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden">
              {/* Abstract data visualization accent */}
              <div className="w-full h-full bg-gradient-to-br from-navy via-navy/80 to-teal/30 dark:from-navy-dark dark:via-navy dark:to-teal/20 rounded-2xl flex items-center justify-center">
                <div className="p-8 space-y-3 w-full font-mono text-xs">
                  {[
                    { label: "model.fit(X_train)", color: "text-teal" },
                    { label: "accuracy: 0.9847", color: "text-green-400" },
                    { label: "deploy → production", color: "text-white/60" },
                    { label: "latency: 42ms p95", color: "text-white/60" },
                    { label: "status: HEALTHY", color: "text-teal" },
                  ].map((line, i) => (
                    <div
                      key={i}
                      className={`${line.color} opacity-80`}
                      style={{ paddingLeft: `${i * 12}px` }}
                    >
                      {line.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div
              className="absolute inset-0 rounded-2xl blur-3xl opacity-20 bg-teal max-w-sm mx-auto"
              aria-hidden
            />
          </div>
        </div>
      </div>
    </section>
  );
}
