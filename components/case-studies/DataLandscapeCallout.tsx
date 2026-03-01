interface DataLandscapeCalloutProps {
  children: React.ReactNode;
}

export function DataLandscapeCallout({ children }: DataLandscapeCalloutProps) {
  return (
    <div className="border-l-4 border-teal bg-teal/5 dark:bg-teal/10 p-6 rounded-r-lg my-6">
      <p className="text-xs font-medium text-teal uppercase tracking-widest mb-2">
        Data Landscape
      </p>
      <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
