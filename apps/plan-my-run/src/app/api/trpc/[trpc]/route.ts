import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@trainly/trpc";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
  });

export { handler as GET, handler as POST };
