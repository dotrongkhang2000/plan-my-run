import { router } from "../../trpc";
import { userRunningPlanRouter } from "./user-running-plan-router";

export const v1Router = router({
  userRunningPlan: userRunningPlanRouter,
});
