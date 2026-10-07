"use client";

import { useState } from "react";
import { ProjectsTable } from "@/components/projects/projects-table";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import type { Project } from "@/types/project";

type ProjectsPageClientProps = {
  initialProjects: Project[];
};

export function ProjectsPageClient({
  initialProjects,
}: ProjectsPageClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const saveProject = (updatedProject: Project) => {
    setProjects((currentProjects) => {
      const exists = currentProjects.some(
        (project) => project.id === updatedProject.id,
      );

      return exists
        ? currentProjects.map((project) =>
            project.id === updatedProject.id
              ? updatedProject
              : project,
          )
        : [...currentProjects, updatedProject];
    });
  };

  return (
    <section>
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Gestión</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Proyectos
          </h1>
          <p className="mt-1 text-sm text-muted">
            Listado de proyectos registrados y acceso a su historial de cartas
            fianza.
          </p>
        </div>

        <ProjectCreateModal onSave={saveProject} />
      </header>

      <ProjectsTable
        projects={projects}
        onSaveProject={saveProject}
      />
    </section>
  );
}