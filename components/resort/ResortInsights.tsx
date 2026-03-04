import { Radar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadarComparison } from "@/components/charts/RadarComparison";
import { DayHourHeatmap } from "@/components/charts/DayHourHeatmap";
import roomData from "@/data/resort/room-comparison.json";
import checkinData from "@/data/resort/checkin-patterns.json";

export function ResortInsights() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Room Type Comparison Radar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Radar className="h-4 w-4 text-primary" />
            Room Type Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadarComparison
            data={roomData}
            entities={["Standard", "Ocean View", "Suite", "Beachfront"]}
            axisKey="axis"
          />
        </CardContent>
      </Card>

      {/* Check-in Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Check-in Patterns
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DayHourHeatmap
            data={checkinData}
            valueLabel="check-ins"
          />
        </CardContent>
      </Card>
    </div>
  );
}
