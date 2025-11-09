"use client"

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartTooltipContent, ChartContainer } from "@/components/ui/chart"
import { useTheme } from "next-themes"

const chartData = [
  { time: "9:00", "Normal Alert": 20, "AI Alert": 35 },
  { time: "10:00", "Normal Alert": 30, "AI Alert": 45 },
  { time: "11:00", "Normal Alert": 35, "AI Alert": 55 },
  { time: "12:00", "Normal Alert": 40, "AI Alert": 70 },
  { time: "13:00", "Normal Alert": 50, "AI Alert": 80 },
  { time: "14:00", "Normal Alert": 55, "AI Alert": 95 },
]

const chartConfig = {
  "Normal Alert": {
    label: "Normal Alert",
    color: "hsl(var(--secondary-foreground))",
  },
  "AI Alert": {
    label: "AI Alert",
    color: "hsl(var(--primary))",
  },
}

export function AIWeatherChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <ResponsiveContainer>
        <BarChart 
          data={chartData} 
          margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis 
            label={{ value: 'Prediction Accuracy (%)', angle: -90, position: 'insideLeft', offset: 10, style: { textAnchor: 'middle' } }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar 
            dataKey="Normal Alert" 
            fill="var(--color-Normal Alert)" 
            radius={4}
            barSize={20} 
          />
          <Bar 
            dataKey="AI Alert" 
            fill="var(--color-AI Alert)" 
            radius={4}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
