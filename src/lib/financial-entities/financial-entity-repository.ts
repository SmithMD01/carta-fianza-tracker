import "server-only";

import { prisma } from "@/lib/prisma";

export type FinancialEntityOption = {
  id: string;
  name: string;
};

export async function getFinancialEntities(): Promise<
  FinancialEntityOption[]
> {
  return prisma.financialEntity.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}