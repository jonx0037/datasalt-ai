"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Calendar, Ruler, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Comparable {
  boat_type: string;
  manufacturer: string;
  model_year: number;
  length_ft: number;
  engine_hp: number;
  condition: string;
  location: string;
  days_on_lot: number;
  sale_price: number;
}

interface ComparableSalesProps {
  query: Record<string, string | number>;
}

export function ComparableSales({ query }: ComparableSalesProps) {
  const [comps, setComps] = useState<Comparable[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/boats/api/comparables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...query, limit: 5 }),
        });
        const data = await res.json();
        setComps(data.comparables ?? []);
      } catch {
        // Keep last results
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const conditionColor: Record<string, string> = {
    New: "bg-green-500/10 text-green-700 dark:text-green-400",
    Excellent: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    Good: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    Fair: "bg-orange-500/10 text-orange-700 dark:text-orange-400",
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Comparable Sales</CardTitle>
        <p className="text-xs text-muted-foreground">
          Most similar boats by type, year, and specs
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading && comps.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        )}

        {comps.map((comp, i) => (
          <div
            key={i}
            className={cn(
              "rounded-lg border p-3 space-y-2 transition-opacity",
              loading && "opacity-60"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-sm leading-tight">
                  {comp.manufacturer} {comp.boat_type}
                </p>
                <p className="text-xs text-muted-foreground">
                  {comp.model_year}
                </p>
              </div>
              <span className="font-bold text-sm whitespace-nowrap">
                ${comp.sale_price.toLocaleString()}
              </span>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Ruler className="h-3 w-3" />
                {comp.length_ft} ft
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {comp.engine_hp} HP
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {comp.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {comp.days_on_lot}d on lot
              </span>
            </div>

            {/* Condition badge */}
            <Badge
              variant="secondary"
              className={cn("text-xs", conditionColor[comp.condition])}
            >
              {comp.condition}
            </Badge>
          </div>
        ))}

        {!loading && comps.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comparable sales found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
