"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { TrendWithOverlays } from "@/components/charts/TrendWithOverlays";
import rawReviews from "@/data/resort/review-explorer.json";

// ── Types ─────────────────────────────────────────────────────
interface Review {
  id: number;
  date: string;
  sentiment: number;
  topics: string[];
  snippet: string;
  room_type: string;
  rating: number;
}

const reviews = rawReviews as Review[];

const ALL_TOPICS = [
  "Location",
  "Service",
  "Cleanliness",
  "Food",
  "Value",
  "Amenities",
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "sentiment-desc", label: "Highest Sentiment" },
  { value: "sentiment-asc", label: "Lowest Sentiment" },
  { value: "rating-desc", label: "Highest Rating" },
];

// ── Component ────────────────────────────────────────────────
export function ReviewExplorer() {
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("date-desc");

  const toggleTopic = (topic: string) => {
    setActiveTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  // Filter reviews by active topics (empty = all)
  const filtered = useMemo(() => {
    let list =
      activeTopics.length === 0
        ? reviews
        : reviews.filter((r) =>
            r.topics.some((t) => activeTopics.includes(t))
          );

    const [field, dir] = sortBy.split("-");
    list = [...list].sort((a, b) => {
      const va = field === "date" ? new Date(a.date).getTime() : (a as unknown as Record<string, number>)[field!];
      const vb = field === "date" ? new Date(b.date).getTime() : (b as unknown as Record<string, number>)[field!];
      return dir === "desc" ? Number(vb) - Number(va) : Number(va) - Number(vb);
    });

    return list;
  }, [activeTopics, sortBy]);

  // Aggregate monthly sentiment for trend chart
  const trendData = useMemo(() => {
    const buckets = new Map<
      string,
      { total: number; count: number; byTopic: Record<string, { total: number; count: number }> }
    >();

    const source = activeTopics.length === 0 ? reviews : filtered;
    source.forEach((r) => {
      const month = r.date.slice(0, 7); // "YYYY-MM"
      if (!buckets.has(month)) {
        buckets.set(month, { total: 0, count: 0, byTopic: {} });
      }
      const b = buckets.get(month)!;
      b.total += r.sentiment;
      b.count += 1;

      r.topics.forEach((t) => {
        if (!b.byTopic[t]) b.byTopic[t] = { total: 0, count: 0 };
        b.byTopic[t].total += r.sentiment;
        b.byTopic[t].count += 1;
      });
    });

    return [...buckets.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, b]) => {
        const row: Record<string, string | number> = {
          date: month,
          "Avg Sentiment": +(b.total / b.count).toFixed(2),
        };
        ALL_TOPICS.forEach((t) => {
          if (b.byTopic[t]) {
            row[t] = +(b.byTopic[t].total / b.byTopic[t].count).toFixed(2);
          }
        });
        return row;
      });
  }, [filtered, activeTopics]);

  // Determine which overlay keys to show
  const overlayKeys = useMemo(() => {
    if (activeTopics.length === 0) return [];
    return activeTopics;
  }, [activeTopics]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {ALL_TOPICS.map((topic) => (
            <Badge
              key={topic}
              variant={activeTopics.includes(topic) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleTopic(topic)}
            >
              {topic}
            </Badge>
          ))}
        </div>
        <div className="ml-auto w-48">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sentiment trend chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            Sentiment Trends
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({filtered.length} reviews)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TrendWithOverlays
            data={trendData}
            xKey="date"
            primaryKey="Avg Sentiment"
            primaryLabel="Avg Sentiment"
            overlayKeys={overlayKeys}
            format="number"
          />
        </CardContent>
      </Card>

      {/* Review cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[600px] overflow-y-auto pr-1">
        {filtered.slice(0, 30).map((review) => (
          <Card key={review.id} className="flex flex-col">
            <CardContent className="pt-4 flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {review.date}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{review.snippet}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {review.topics.map((t) => (
                  <Badge key={t} variant="secondary" className="text-xs">
                    {t}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  {review.room_type}
                </Badge>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-muted-foreground">
                  Sentiment
                </span>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    review.sentiment >= 4
                      ? "text-green-600 dark:text-green-400"
                      : review.sentiment >= 3
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                  )}
                >
                  {review.sentiment.toFixed(1)}/5
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
