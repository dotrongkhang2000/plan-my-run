import { gemini } from "@/vendors/gemini";

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface GetUserPlanProps {
  distance: number;
  hillyType: "flat" | "rolling" | "moderate" | "hilly";
  runningLevel: "beginner" | "intermediate" | "advanced" | "elite";
  currentFitnessLevel: {
    distance: number;
    finishedTime: number;
  };
  weeklyRunningPlan: {
    days: number;
    availableDays: WeekDay[];
  };
  totalTrainingDays: number;
  startDate: Date;
}

export const getUserPlanAsync = async ({
  distance,
  hillyType,
  runningLevel,
  currentFitnessLevel,
  weeklyRunningPlan,
  totalTrainingDays,
  startDate,
}: GetUserPlanProps) => {
  const contents = `
You are an expert running coach. Please create a detailed running plan for the following athlete:

- Goal distance: ${distance} km
- Terrain type: ${hillyType}
- Runner level: ${runningLevel}
- Current fitness: Can run ${currentFitnessLevel.distance} km in ${
    currentFitnessLevel.finishedTime
  } minutes
- Weekly running days: ${
    weeklyRunningPlan.days
  } (${weeklyRunningPlan.availableDays.join(", ")})
- Total training days: ${totalTrainingDays}
- Training start date: ${startDate.toDateString()}

The plan should be structured week by week, specifying the workout for each available day. Include rest days, long runs, speed work, and easy runs as appropriate for the runner's level and goal. Make sure the plan is progressive and safe.

Format the plan in clear, readable markdown.

Begin the plan below:
`;

  const userPlan = await gemini.models.generateContent({
    model: "gemma-3n-e2b-it",
    contents,
  });

  return userPlan;
};
