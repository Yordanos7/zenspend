import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "@zenspend/env/server";

import { PrismaClient } from "../prisma/generated/client";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
