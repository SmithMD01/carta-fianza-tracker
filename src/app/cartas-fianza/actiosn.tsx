"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createGuaranteeSchema = z.object({
  projectId: z.string().min(1),
  guaranteeReason: z.string().trim().min(1),
  validFrom: z.string().min(1),
  requestingArea: z.string().trim().min(1),
  validityDays: z.number().int().positive(),
  guaranteePercentage: z.number().nonnegative(),
  componentValue: z.number().nonnegative(),
  costCenter: z.string().trim(),
});

export type CreateGuaranteeInput = z.infer<
  typeof createGuaranteeSchema
>;

function calculateExpirationDate(
  validFrom: string,
  validityDays: number,
) {
  const expirationDate = new Date(`${validFrom}T00:00:00`);

  expirationDate.setDate(
    expirationDate.getDate() + validityDays,
  );

  return expirationDate;
}

function calculateRemainingDays(validFrom: string) {
  const startDate = new Date(`${validFrom}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (startDate.getTime() - today.getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

function getGuaranteeGroups(reason: string) {
  const groups: string[] = [];

  if (reason.includes("Elaboración")) {
    groups.push("Elaboración");
  }

  if (reason.includes("Ejecución")) {
    groups.push("Ejecución");
  }

  if (reason.includes("Supervisión")) {
    groups.push("Supervisión");
  }

  if (
    reason.includes("Adicional") ||
    reason.includes("Mayor Trabajo")
  ) {
    groups.push("Adicionales");
  }

  return groups;
}

export async function createGuaranteeAction(
  input: CreateGuaranteeInput,
) {
  const data = createGuaranteeSchema.parse(input);

  const project = await prisma.project.findUnique({
    where: {
      id: data.projectId,
    },
  });

  if (!project) {
    throw new Error("El proyecto seleccionado no existe");
  }

  const guaranteeValue =
    (data.componentValue * data.guaranteePercentage) / 100;

  const expiresAt = calculateExpirationDate(
    data.validFrom,
    data.validityDays,
  );

  const guarantee = await prisma.guarantee.create({
    data: {
      projectId: data.projectId,
      guaranteeReason: data.guaranteeReason,
      guaranteeGroups: getGuaranteeGroups(
        data.guaranteeReason,
      ),
      validFrom: new Date(`${data.validFrom}T00:00:00`),
      validityDays: data.validityDays,
      expiresAt,
      requestingArea: data.requestingArea,
      guaranteeValue,
      guaranteePercentage: data.guaranteePercentage,
      componentValue: data.componentValue,
      costCenter: data.costCenter || null,
      renewalDays: calculateRemainingDays(data.validFrom),
      status: "Solicitud",
      requestStatus: "Pendiente",
    },
  });

  return {
    id: guarantee.id,
    guaranteeNumber: guarantee.guaranteeNumber,
    status: guarantee.status,
  };
}