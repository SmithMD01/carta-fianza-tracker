import { notFound } from "next/navigation";
import { ProjectDetailView } from "@/components/projects/project-detail-view";
import { mockGuarantees } from "@/data/mock-guarantees";
import { mockProjects } from "@/data/mock-projects";

type ProjectDetailPageProps = {
  params: Promise<{ projectId: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  const project = mockProjects.find((item) => item.id === projectId);

  if (!project) notFound();

  const projectGuarantees = mockGuarantees.filter(
    (guarantee) => guarantee.projectCode === project.projectCode,
  );

  return <ProjectDetailView project={project} guarantees={projectGuarantees} />;
}
