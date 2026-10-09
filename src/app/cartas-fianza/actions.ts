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


const updateGuaranteeSchema = z.object({
  id: z.string().min(1),
  insurerName: z.string().trim(),
  guaranteeNumber: z.string().trim(),
  guaranteeReason: z.string().trim().min(1),
  validFrom: z.string().min(1),
  validityDays: z.number().int().positive(),
  requestingArea: z.string().trim().min(1),
  vof: z.string().trim(),
  carPolicy: z.string().trim(),
  guaranteePercentage: z.number().nonnegative(),
  componentValue: z.number().nonnegative(),
  premium: z.number().nonnegative(),
  collateral: z.number().nonnegative(),
  collateralPercentage: z.number().nonnegative(),
  costCenter: z.string().trim(),
  documentUrl: z.union([z.string().url(), z.literal(""),]),
  status: z.enum(["Solicitud", "Activa"]),
});

export type UpdateGuaranteeInput = z.infer<
  typeof updateGuaranteeSchema
>;

export async function updateGuaranteeAction(
  input: UpdateGuaranteeInput,
) {
  const data = updateGuaranteeSchema.parse(input);

  const guarantee = await prisma.guarantee.findUnique({
    where: {
      id: data.id,
    },
  });

  if (!guarantee) {
    throw new Error("La carta fianza no existe");
  }

  const guaranteeValue =
    (data.componentValue * data.guaranteePercentage) / 100;

  const expiresAt = calculateExpirationDate(
    data.validFrom,
    data.validityDays,
  );

  const updatedGuarantee = await prisma.guarantee.update({
    where: {
      id: data.id,
    },
    data: {
      guaranteeNumber: data.guaranteeNumber || null,
      guaranteeReason: data.guaranteeReason,
      guaranteeGroups: getGuaranteeGroups(data.guaranteeReason),
      validFrom: new Date(`${data.validFrom}T00:00:00`),
      validityDays: data.validityDays,
      expiresAt,
      requestingArea: data.requestingArea,
      vof: data.vof || null,
      carPolicy: data.carPolicy || null,
      guaranteeValue,
      guaranteePercentage: data.guaranteePercentage,
      componentValue: data.componentValue,
      premium: data.premium,
      collateral: data.collateral,
      collateralPercentage: data.collateralPercentage,
      costCenter: data.costCenter || null,
      documentUrl: data.documentUrl || null,
      status: data.status,
      renewalDays: calculateRemainingDays(data.validFrom),
    },
  });

  return {
    id: updatedGuarantee.id,
    status: updatedGuarantee.status,
  };
}