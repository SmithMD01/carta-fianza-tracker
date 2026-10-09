import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/projects/project-detail-view";
import {getProjectById} from "@/lib/projects/project-repository";
import {getGuaranteesByProjectId} from "@/lib/guarantees/guarantee-repository";

export const dynamic = "force-dynamic";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { projectId } = await params;

  const project = await getProjectById(projectId);

  if (!project) {
    notFound();
  }

  const projectGuarantees =
    await getGuaranteesByProjectId(projectId);

  return (
    <ProjectDetailView
      project={project}
      guarantees={projectGuarantees}
    />
  );
}

