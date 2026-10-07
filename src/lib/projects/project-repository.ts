import "server-only";
import { prisma } from "@/lib/prisma";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          guarantees: {
            where: {
              status: "Activa",
            },
          },
        },
      },
    },
  });

  return projects.map((project) => ({
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
    activeGuarantees: project._count.guarantees,
  }));
}