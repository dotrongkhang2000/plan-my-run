import { z } from "zod";

interface AthleteSummary {
  level: string;
  goal: string;
  terrain: string;
  currentFitness: string;
  weeklyDays: string;
  totalDays: string;
  startDate: string;
}

export const weekPlanSchema = z.object({
  week: z.number(),
  total: z.string(),
  days: z.array(
    z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  ),
});

type WeekPlan = z.infer<typeof weekPlanSchema>;

export const parseTrainingPlan = (text: string): WeekPlan[] => {
  const lines = text.split("\n");

  // --- 1. Athlete Summary ---
  const summarySection = lines.slice(
    lines.findIndex((l) => l.startsWith("### Athlete Summary")),
    lines.findIndex((l) => l.startsWith("### Important Notes")),
  );
  const summary: AthleteSummary = {
    level:
      summarySection
        .find((l) => l.includes("Level:"))
        ?.split(":")[1]
        .trim() ?? "",
    goal:
      summarySection
        .find((l) => l.includes("Goal:"))
        ?.split(":")[1]
        .trim() ?? "",
    terrain:
      summarySection
        .find((l) => l.includes("Terrain:"))
        ?.split(":")[1]
        .trim() ?? "",
    currentFitness:
      summarySection
        .find((l) => l.includes("Current Fitness:"))
        ?.split(":")[1]
        .trim() ?? "",
    weeklyDays:
      summarySection
        .find((l) => l.includes("Weekly Running Days:"))
        ?.split(":")[1]
        .trim() ?? "",
    totalDays:
      summarySection
        .find((l) => l.includes("Total Training Days:"))
        ?.split(":")[1]
        .trim() ?? "",
    startDate:
      summarySection
        .find((l) => l.includes("Start Date:"))
        ?.split(":")[1]
        .trim() ?? "",
  };

  // --- 3. Week-by-Week Breakdown ---
  const weekRegex = /\*\*Week\s+(\d+):\s*([^\n*]+)\*\*/;
  const weeks: WeekPlan[] = [];

  let currentWeek: WeekPlan | null = null;

  lines.forEach((line) => {
    const weekMatch = line.match(weekRegex);
    if (weekMatch) {
      if (currentWeek) weeks.push(currentWeek);

      currentWeek = {
        week: parseInt(weekMatch[1], 10),
        total: weekMatch[2].trim(),
        days: [],
      };
    } else if (line.startsWith("-") && currentWeek) {
      const content = line.replace(/^- /, "").trim();
      const [day, ...workout] = content.split(":");

      currentWeek.days.push({
        title: workout.join().split("-")[0]?.trim() ?? "",
        description: workout.join().split("-")[1]?.trim() ?? "",
      });
    }
  });

  if (currentWeek) weeks.push(currentWeek);

  return weeks;
};
