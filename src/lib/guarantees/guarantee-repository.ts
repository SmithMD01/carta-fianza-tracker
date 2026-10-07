import "server-only";

import { prisma } from "@/lib/prisma";
import type { Guarantee } from "@/types/guarantee";

function formatDate(date: Date | null) {
  return date ? date.toISOString().slice(0, 10) : "";
}

export async function getGuarantees(): Promise<Guarantee[]> {
  const guarantees = await prisma.guarantee.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      project: true,
      financialEntity: true,
    },
  });

  return guarantees.map((guarantee) => ({
    id: guarantee.id,

    projectCode: guarantee.project.projectCode,
    projectCui: guarantee.project.cui,
    projectName: guarantee.project.referenceName,
    formalProjectName: guarantee.project.formalName,
    entityName: guarantee.project.entityName,

    insurerName: guarantee.financialEntity?.name ?? "",

    guaranteeNumber: guarantee.guaranteeNumber ?? "",
    guaranteeReason: guarantee.guaranteeReason,
    guaranteeGroups: guarantee.guaranteeGroups,

    validFrom: formatDate(guarantee.validFrom),
    validityDays: guarantee.validityDays ?? 0,
    expiresAt: formatDate(guarantee.expiresAt),

    requestingArea: guarantee.requestingArea,
    vof: guarantee.vof ?? "",
    carPolicy: guarantee.carPolicy ?? "",

    guaranteeValue: Number(guarantee.guaranteeValue),
    guaranteePercentage: Number(
      guarantee.guaranteePercentage ?? 0,
    ),
    projectValue: Number(guarantee.project.projectValue),
    componentValue: Number(
      guarantee.componentValue ?? 0,
    ),

    costCenter: guarantee.costCenter ?? "",
    observations: guarantee.observations ?? "",

    selectionProcess: guarantee.project.selectionProcess,
    consortiumWith: guarantee.project.consortiumWith ?? "",
    wonWith: guarantee.project.wonWith ?? "",

    premium: Number(guarantee.premium ?? 0),
    collateral: Number(guarantee.collateral ?? 0),
    collateralPercentage: Number(
      guarantee.collateralPercentage ?? 0,
    ),

    renewalDays: guarantee.renewalDays,
    renewalNumber: guarantee.renewalNumber ?? undefined,
    originalGuaranteeId:
      guarantee.originalGuaranteeId ?? undefined,

    status: guarantee.status,
    requestStatus: guarantee.requestStatus ?? "",
    projectStage: guarantee.project.projectStage,
  }));
}