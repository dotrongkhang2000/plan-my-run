import { PrismaClient } from "./generated/prisma";
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

// const adapter = new PrismaBetterSQLite3({
//   url: "file:./dev.db",
// });

const prisma = new PrismaClient();

export { prisma };
