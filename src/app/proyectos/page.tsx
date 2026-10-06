"use client";

import { useState } from "react";
import { ProjectsTable } from "@/components/projects/projects-table";
import { ProjectCreateModal } from "@/components/projects/project-create-modal";
import { mockProjects } from "@/data/mock-projects";
import type { Project } from "@/types/project";

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const saveProject = (updatedProject: Project) => {
    setProjects((currentProjects) => {
      const exists = currentProjects.some((project) => project.id === updatedProject.id);
      return exists
        ? currentProjects.map((project) => project.id === updatedProject.id ? updatedProject : project)
        : [...currentProjects, updatedProject];
    });
  };

  return (
    <section>
      <div className="flex items-end justify-between">
        <p className="text-sm font-medium text-primary">Gestión</p>
        <ProjectCreateModal />
      </div>

      <ProjectsTable projects={projects} onSaveProject={saveProject} />
    </section>
  );
}
