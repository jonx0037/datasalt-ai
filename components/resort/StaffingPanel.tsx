"use client";

import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StaffingData {
  recommendation: string;
  total_fte: number;
  gap: number;
  by_department: {
    department: string;
    current: number;
    recommended: number;
  }[];
}

export function StaffingPanel({
  staffing,
  loading,
}: {
  staffing: StaffingData | null;
  loading: boolean;
}) {
  if (!staffing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            Staffing Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select parameters to see staffing recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(loading && "opacity-60 transition-opacity")}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Staffing Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {staffing.by_department.map((dept) => {
          const gap = +(dept.recommended - dept.current).toFixed(1);
          return (
            <div key={dept.department} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{dept.department}</span>
                <span className="tabular-nums text-muted-foreground">
                  {dept.current} → {dept.recommended}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (dept.current / Math.max(dept.recommended, dept.current)) * 100)}%`,
                    }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums min-w-[3rem] text-right",
                    gap > 0
                      ? "text-orange-600 dark:text-orange-400"
                      : gap < 0
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                  )}
                >
                  {gap > 0 ? `+${gap}` : gap === 0 ? "—" : String(gap)}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
