import { ProjectsTable } from "@/components/projects/projects-table";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import { mockProjects } from "@/data/mock-projects";

export default function ProyectosPage() {
  return (
    <section>
      <div className="flex items-end justify-between">
        <p className="text-sm font-medium text-primary">Gestión</p>
        <ProjectCreateModal />
      </div>

      <ProjectsTable projects={mockProjects} />
    </section>
  );
}
