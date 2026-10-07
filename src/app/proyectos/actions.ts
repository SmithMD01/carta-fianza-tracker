"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createProjectSchema = z.object({
  projectCode: z.string().trim().min(1),
  cui: z.string().trim().min(1),
  referenceName: z.string().trim().min(1),
  formalName: z.string().trim().min(1),
  entityName: z.string().trim().min(1),
  projectValue: z.number().nonnegative(),
  selectionProcess: z.string().trim().min(1),
  consortiumWith: z.string().trim(),
  wonWith: z.string().trim().min(1),
  projectStage: z.string().trim().min(1),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export async function createProjectAction(input: CreateProjectInput) {
  const data = createProjectSchema.parse(input);

  const project = await prisma.project.create({
    data: {
      projectCode: data.projectCode,
      cui: data.cui,
      referenceName: data.referenceName,
      formalName: data.formalName,
      entityName: data.entityName,
      projectValue: data.projectValue,
      selectionProcess: data.selectionProcess,
      consortiumWith: data.consortiumWith || null,
      wonWith: data.wonWith,
      projectStage: data.projectStage,
    },
  });

  return {
    id: project.id,
    projectCode: project.projectCode,
    cui: project.cui,
    referenceName: project.referenceName,
    formalName: project.formalName,
    entityName: project.entityName,
    projectValue: Number(project.projectValue),
    selectionProcess: project.selectionProcess,
    consortiumWith: project.consortiumWith ?? "",
    wonWith: project.wonWith ?? "",
    projectStage: project.projectStage,
    activeGuarantees: 0,
  };
}