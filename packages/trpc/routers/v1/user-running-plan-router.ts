import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
import { parseTimeInMinutes } from "../../utils/parse-time-to-minutes";
import { gemini } from "../../vendors/gemini";
import {
  parseTrainingPlan,
  weekPlanSchema,
} from "../../utils/parse-running-plan-from-text";

const planningDaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const userRunningPlanRouter = router({
  get: publicProcedure
    .input(
      z.object({
        distance: z.number(),
        unit: z.enum(["kilometers", "miles"]),
        totalTrainingWeeks: z.number(),
        runningLevel: z.enum(["beginner", "intermediate", "advanced", "elite"]),
        goalTime: z.object({
          hour: z.number(),
          minute: z.number(),
          second: z.number(),
        }),
        hillyType: z.enum(["flat", "rolling", "moderate", "hilly"]),
        weeklyRunningPlan: z.object({
          availableDays: z.array(planningDaySchema),
          longRunDay: planningDaySchema,
        }),
      }),
    )
    .output(z.array(weekPlanSchema))
    .query(async ({ input }) => {
      const {
        distance,
        unit,
        totalTrainingWeeks,
        runningLevel,
        goalTime,
        hillyType,
        weeklyRunningPlan,
      } = input;

      const goalTimeMinutes = parseTimeInMinutes(goalTime);
      const goalPacePerKm = goalTimeMinutes / distance;

      const contents = `
      You are an expert running coach. Create a structured, progressive, and safe training plan for the following athlete:
      
      Goal distance: ${distance} km
      
      Goal time: ${goalTime.hour}h ${goalTime.minute}m ${goalTime.second}s (target average pace: ${goalPacePerKm.toFixed(2)} min/km)
      
      Terrain type: ${hillyType}
      
      Runner level: ${runningLevel}
      
      Weekly running days: ${weeklyRunningPlan.availableDays.length} (${weeklyRunningPlan.availableDays.join(", ")})
      
      Total training weeks: ${totalTrainingWeeks}
      
      # Output Requirements
      
      ## Markdown Schema
      
      Your response **must** strictly follow this markdown schema:
      
      \`\`\`markdown
      ## [Plan Title]
      
      ### Athlete Summary
      
      - Level: [level]
      - Goal: [distance] km in [goal time] ([pace] min/km)
      - Terrain: [terrain]
      - Current Fitness: [current fitness]
      - Weekly Running Days: [days] ([available days])
      - Total Training Days: [total days]
      - Start Date: [start date]
      
      ## Week-by-Week Breakdown
      
      **Week 1: [total distance for week 1]**
      - Monday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Tuesday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Wednesday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Thursday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Friday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Saturday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Sunday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      
      **Week 2: [total distance for week 2]**
      - Monday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) or Rest]
      - Tuesday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Wednesday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Thursday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Friday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Saturday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      - Sunday: [Long Run if equals ${weeklyRunningPlan.longRunDay} else Workout if in (\`${weeklyRunningPlan.availableDays.join(", ")}\`) else Rest]
      
      [Repeat for all weeks]
      \`\`\`
      
      # Additional Instructions
      
      - **Always** use the above markdown schema for your response.
      - For each week, always show all 7 days (Monday → Sunday).
      - Workouts **must only be scheduled on the athlete’s available days** (\`${weeklyRunningPlan.availableDays.join(", ")}\`).  
      - All other days must explicitly be marked as **Rest**.
      - The number of running days per week **must not exceed** \`${weeklyRunningPlan.availableDays.length}\`.
      - Each running session **must follow this format**:  
        \`[Running type] - [distance] km (Pace: [pace] min/km)\`  
        Example: \`Easy Run - 3 km (Pace: 3:40 min/km)\`
      - Keep the tone clear, supportive, and motivational.
      - Do not include any text outside the markdown code block.
      
      Begin the training plan below:
      `;

      const userPlan = await gemini.models.generateContent({
        model: "gemma-3-27b-it",
        contents,
      });

      return parseTrainingPlan(userPlan.text || "");
    }),
});
