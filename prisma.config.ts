import path from "node:path";
import type { PrismaConfig } from "prisma";

export default {
  schema: path.join("packages", "db", "prisma", "schema.prisma"),
  migrations: {
    path: path.join("packages", "db", "prisma", "migrations"),
  },
  views: {
    path: path.join("packages", "db", "prisma", "views"),
  },
  typedSql: {
    path: path.join("packages", "db", "prisma", "queries"),
  },
} satisfies PrismaConfig;
