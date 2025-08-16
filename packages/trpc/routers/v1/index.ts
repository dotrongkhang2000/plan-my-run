import { router } from "../../trpc";
import { exampleRouter } from "./example";

export const v1Router = router({
  example: exampleRouter,
});
