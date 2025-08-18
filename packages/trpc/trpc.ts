import { initTRPC } from "@trpc/server";
import { Context } from "./context";
import superjson from "superjson";

import { appRouter, type AppRouter } from "./routers/root";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export { appRouter, type AppRouter };
