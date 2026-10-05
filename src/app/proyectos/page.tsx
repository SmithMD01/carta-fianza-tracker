import { ProjectsTable } from "@/components/projects/projects-table";
import { mockProjects } from "@/data/mock-projects";

export default function ProyectosPage() {
  return (
    <section>
      <p className="text-sm font-medium text-primary">Gestión</p>
      <ProjectsTable projects={mockProjects} />
    </section>
  );
}
