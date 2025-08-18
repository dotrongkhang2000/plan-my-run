import { z } from "zod";
import { publicProcedure, router } from "../../trpc";
// import { prisma } from "@trainly/db";
import { prisma } from "../../../db";

export const exampleRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(async ({}) => {
      const users = await prisma.user.findMany();

      return {
        data: users,
      };
    }),
});
