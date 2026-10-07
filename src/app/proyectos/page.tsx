import { ProjectsPageClient } from "@/components/projects/projects-page-client";
import { getProjects } from "@/lib/projects/project-repository";

export const dynamic = "force-dynamic";

export default async function ProyectosPage() {
  const projects = await getProjects();

  return (
    <ProjectsPageClient initialProjects={projects} />
  );
}